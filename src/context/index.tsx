import detectEthereumProvider from "@metamask/detect-provider";
import { Typography } from "@mui/material";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useContracts } from "@/hooks/useContracts";
import { formatBalance, formatTokensAsNum } from "@/utils";
import { addressesDev } from "@/utils/addresses";
import { NETWORK_NAMES, NETWORKS } from "@/utils/const";

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}
interface InitialState {
  accounts: string[];
  balance: string;
  chainId: string;
}

interface StateProvider {
  wallet: InitialState;
  token: string;
  error: string;
  isLoading: boolean;
  connectMetaMask: (cb?: () => void) => void;
  handleChainChanged: (chainId: string) => void;
  updateWallet: (accounts: string[]) => void;
  setError: Dispatch<SetStateAction<string>>;
}

const INITIAL_STATE: InitialState = {
  accounts: [],
  balance: "",
  chainId: "",
};

const StateContext = createContext<StateProvider>({} as StateProvider);

export const StateContextProvider = ({ children }: PropsWithChildren) => {
  const [wallet, setAWallet] = useState(INITIAL_STATE);
  const [token, setToken] = useState("");
  const [isProvider, setIsProvider] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const swapContract = useContracts("token");

  const _updateWallet = useCallback(async (providedAccounts?: any) => {
    const accounts =
      providedAccounts ||
      (await window.ethereum.request({ method: "eth_accounts" }));

    if (accounts.length === 0) {
      setAWallet(INITIAL_STATE);

      return;
    }

    const balance = formatBalance(
      await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    setAWallet({ accounts, balance, chainId });
  }, []);

  const updateWalletAndAccounts = useCallback(
    () => _updateWallet(),
    [_updateWallet]
  );
  const updateWallet = useCallback(
    (accounts: any) => {
      _updateWallet(accounts);
    },
    [_updateWallet]
  );

  const connectMetaMask = useCallback(
    async (cb?: () => void) => {
      setIsLoading(true);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setError("");
        updateWallet(accounts);
        cb?.();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [updateWallet]
  );

  const handleChainChanged = async (chainId: string) => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainId }],
        });
      } catch (switchError) {
        const { code } = switchError as ProviderRpcError;

        // This error code indicates that the chain has not been added to MetaMask.
        if (code === 4902) {
          const networkSettings = NETWORK_NAMES.filter(
            (network) => NETWORKS[network].chainId === chainId
          ).map((network) => NETWORKS[network]);

          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: networkSettings,
            });
          } catch (addError) {
            const { message } = addError as ProviderRpcError;

            setError(message);
          }
        }
      }
    }
  };

  // update wallet
  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });

      setIsProvider(!!provider);

      if (provider) {
        await updateWalletAndAccounts();
        window.ethereum.on("accountChanged", updateWallet);
        window.ethereum.on("chainChanged", updateWalletAndAccounts);
      }
    };

    getProvider();
  }, [updateWallet, updateWalletAndAccounts]);

  // get decimals and amount of tokens
  useEffect(() => {
    const getTokens = async () => {
      try {
        const balance = wallet.accounts[0]
          ? await swapContract(addressesDev.sepolia)
              .methods.balanceOf(wallet.accounts[0])
              .call()
          : "";
        const decimals = await swapContract(addressesDev.sepolia)
          .methods.decimals()
          .call();

        setToken(formatTokensAsNum(balance, decimals));
      } catch (err) {
        const { message } = err as ProviderRpcError;

        setError(message);
      }
    };

    getTokens();
  }, [wallet.accounts]);

  // check are chains and accounts  changed
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }

    if (window?.ethereum) {
      window.ethereum.removeListener("accountChanged", updateWallet);
      window.ethereum.removeListener("chainChanged", updateWalletAndAccounts);
    }
  });

  return (
    <StateContext.Provider
      value={{
        wallet,
        token,
        error,
        isLoading,
        connectMetaMask,
        handleChainChanged,
        updateWallet,
        setError,
      }}
    >
      {isProvider ? (
        children
      ) : (
        <Typography>You need connect to Metamask</Typography>
      )}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
