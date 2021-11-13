import { EvntComNode } from "evntcom-js/dist/node";
import open from "open";

export class OpenConnexion {
  private name: string;
  private evntCom: EvntComNode;

  constructor(evntBoardHost: string, evntBoardPort: number, name: string) {
    this.name = name;
    this.evntCom = new EvntComNode({
      name,
      port: evntBoardPort,
      host: evntBoardHost,
    });

    this.evntCom.on('open', async () => {
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
