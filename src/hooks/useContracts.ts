import Web3 from "web3";
import { AbiItem } from "web3-utils";

import token from "../../abis/token.json";

const ABIs = {
  token,
};

export const useContracts =
  (contract: keyof typeof ABIs) => (address: string) => {
    const web3 = new Web3(Web3.givenProvider);

    return new web3.eth.Contract(ABIs[contract].abi as AbiItem[], address);
  };
