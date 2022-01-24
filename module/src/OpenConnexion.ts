import { EvntCom } from "evntcom-js";
import open from "open";

export class OpenConnexion {
  private name: string;
  private evntCom: EvntCom;

  constructor(evntBoardHost: string, evntBoardPort: number, name: string) {
    this.name = name;
    this.evntCom = new EvntCom({
      name,
      port: evntBoardPort,
      host: evntBoardHost,
    });

    this.evntCom.on("open", async () => {
      await this.evntCom.notify("newEvent", [
        "open-load",
        null,
        { emitter: this.name },
      ]);
    });

    this.evntCom.expose("open", async (target: string, options?: {}) => {
      return open(target, options);
    });

    this.evntCom.connect();
  }
}
