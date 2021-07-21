import process from 'process';
import { EvntComClient, EvntComServer } from "evntboard-communicate";
import open from "open";

// parse params
const { name: NAME, customName: CUSTOM_NAME, config: {} } = JSON.parse(process.argv[2]);
const EMITTER = CUSTOM_NAME || NAME;

// create Client and Server COM
const evntComClient = new EvntComClient(
    (cb: any) => process.on('message', cb),
    (data: any) => process.send(data),
);

const evntComServer = new EvntComServer();

evntComServer.registerOnData((cb: any) => process.on('message', async (data) => {
    const toSend = await cb(data);
    if (toSend) process.send(toSend);
}));

evntComServer.expose("newEvent", () => {});
evntComServer.expose("load", () => {});
evntComServer.expose("unload", () => {});
evntComServer.expose("reload", () => {});

evntComServer.expose("open", async (target:string, options?: {}) => {
    return open(target, options)
});