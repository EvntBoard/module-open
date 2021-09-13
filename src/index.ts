require("dotenv").config();
import { EvntComNode } from "evntcom-js/dist/node";
import open from "open";

const NAME: string = process.env.EVNTBOARD_NAME || "open";
const HOST: string = process.env.EVNTBOARD_HOST || "localhost";
const PORT: number = process.env.EVNTBOARD_PORT
  ? parseInt(process.env.EVNTBOARD_PORT)
  : 5001;

const evntCom = new EvntComNode({
  name: NAME,
  port: PORT,
  host: HOST,
});

evntCom.expose("open", async (target: string, options?: {}) => {
  return open(target, options);
});
