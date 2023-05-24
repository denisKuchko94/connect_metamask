import { DEFAULT_DECIMALS } from "@/utils/const";

export const formatBalance = (rawBalance: string) =>
  (parseInt(rawBalance) / 1000000000000000000).toFixed(DEFAULT_DECIMALS);

export const formatChainAsNum = (chainIdHex: string) =>
  parseInt(chainIdHex) || "--";

export const formatTokensAsNum = (balance: string, decimals: string) => {
  return (Number(balance) / 10 ** Number(decimals)).toFixed(DEFAULT_DECIMALS);
};
