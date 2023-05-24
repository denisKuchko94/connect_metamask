export const DEFAULT_DECIMALS = 18;

export const METAMASK_ACCOUNTS = [
  {
    value: "0xD02AfF6ec46e081137453D33743DE12a0b7D9001",
    label: "Test account 2",
  },
  {
    value: "0x20C257f7672aD92eeF55102a6F07c54E533B60d9",
    label: "Account 1",
  },
];
export const NETWORKS = {
  andromedaMainnet: {
    chainId: `0x${Number(1088).toString(16)}`,
    chainName: "Metis Andromeda Mainnet",
    nativeCurrency: {
      name: "Metis",
      symbol: "METIS",
      decimals: 18,
    },
    rpcUrls: ["https://andromeda.metis.io/?owner=1088"],
    blockExplorerUrls: ["https://andromeda-explorer.metis.io"],
    iconUrls: [],
  },
  confluxESpace: {
    chainId: `0x${Number(1030).toString(16)}`,
    chainName: "Conflux eSpace",
    nativeCurrency: {
      name: "CFX",
      symbol: "CFX",
      decimals: 18,
    },
    rpcUrls: ["https://evm.confluxrpc.com"],
    blockExplorerUrls: ["https://evm.confluxscan.net"],
    iconUrls: [],
  },
} as const;

export type NetworksKeys = keyof typeof NETWORKS;

export const NETWORK_NAMES = Object.keys(NETWORKS) as Array<NetworksKeys>;
export const NETWORKS_ARR = NETWORK_NAMES.map((network) => NETWORKS[network]);

export const isNetworksKey = (name: string): name is NetworksKeys => {
  return NETWORK_NAMES.some((network) => network === name);
};
