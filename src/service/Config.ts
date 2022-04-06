import yargs from "yargs";
import { singleton } from "tsyringe";

@singleton()
export class ConfigService {
  // evntboard
  private readonly _host: string;
  private readonly _port: number;
  private readonly _name: string;
  private readonly _debug: boolean;

  constructor() {
    const params: any = yargs(process.argv.slice(2)).argv;

    this._debug = params?.debug || false;
    this._host = params?.host || "localhost";
    this._port = params?.port || "5000";
    this._name = params?.name || "open";
  }

  get host(): string {
    return this._host;
  }

  get port(): number {
    return this._port;
  }

  get name(): string {
    return this._name;
  }

  get debug(): boolean {
    return this._debug;
  }
}
