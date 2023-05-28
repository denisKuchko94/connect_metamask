import { GasPrice, StargateClient } from "@cosmjs/stargate";
import { StargateClientOptions } from "@cosmjs/stargate/build/stargateclient";
import { NextApiRequest, NextApiResponse } from "next";

const RPC_URL = "http://128.140.84.101:26657";
const CLIENT_OPTIONS = {
  gasPrice: GasPrice.fromString("10000000000000mpx"),
  broadcastTimeoutMs: 5000,
  broadcastPollIntervalMs: 1000,
};

interface MyRequest extends NextApiRequest {
  query: { address: string };
}
export default async function handler(req: MyRequest, res: NextApiResponse) {
  const { method, query } = req;

  try {
    if (method === "GET") {
      const client = await StargateClient.connect(
        RPC_URL,
        CLIENT_OPTIONS as StargateClientOptions
      );
      const balances = await client.getAllBalances(query.address);

      res.status(200).send({
        balances,
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
}
