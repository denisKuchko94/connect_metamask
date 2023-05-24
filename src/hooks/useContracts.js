import Web3 from "web3";

import token from "abis/Token.json";

const ABIs = {
  token,
};

export const useContracts = (contract) => (address) => {
  const web3 = new Web3(Web3.givenProvider);

  return new web3.eth.Contract(ABIs[contract].abi, address);
};
