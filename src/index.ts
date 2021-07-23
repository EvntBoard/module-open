import { getEvntComServerFromChildProcess } from "evntboard-communicate";
import open from "open";

const evntComServer = getEvntComServerFromChildProcess();

evntComServer.expose("open", async (target:string, options?: {}) => {
    return open(target, options)
});