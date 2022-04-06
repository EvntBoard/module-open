import WebSocket from "ws";
import open from "open";
import { inject, singleton } from "tsyringe";
import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from "json-rpc-2.0";

import { LoggerService } from "./Logger";
import { ConfigService } from "./Config";

@singleton()
export class EvntBoardService {
  private ws: WebSocket;
  public readonly rpc: JSONRPCServerAndClient;

  private loggerService: LoggerService;
  private configService: ConfigService;

  private attempts: number = 0;

  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(LoggerService) loggerService: LoggerService
  ) {
    this.configService = configService;
    this.loggerService = loggerService;

    this.rpc = new JSONRPCServerAndClient(
      new JSONRPCServer(),
      new JSONRPCClient((request) => {
        try {
          this.ws.send(JSON.stringify(request));
          return Promise.resolve();
        } catch (error) {
          return Promise.reject(error);
        }
      })
    );

    this.rpc.addMethod("open", ([target, options]: any) => open(target, options));

    this.rpc.addMethod("connected",async () => {
      this.loggerService.info(`Connected`);
      this.attempts = 0;

      await this.rpc.request("module.register", {
        name: this.configService.name,
      });

      await this.rpc.request("event.new", {
        name: 'open-load',
        emitter: this.configService.name,
      });
    })
  }

  async load() {
    const wsUrl = `ws://${this.configService.host}:${this.configService.port}/api-ws`;
    this.loggerService.info(`Connect to ${wsUrl}`);
    this.ws = new WebSocket(wsUrl);

    this.ws.on("message", async (data) => {
      let payload;
      try {
        payload = JSON.parse(data.toString());
      } catch (e) {
        console.error("Received an mal formatted JSON-RPC message");
        return;
      }

      await this.rpc.receiveAndSend(payload);
    });

    this.ws.on("close", async (event) => {
      this.loggerService.info(`Connection is closed`);
      this.rpc.rejectAllPendingRequests(`Connection is closed (${event}).`);
      this.attempts += 1;
      // try to reconnect
      setTimeout(() => {
        this.load();
      }, 1000 * this.attempts);
    });

    this.ws.on("error", (e) => {
      this.loggerService.error(`Connection error`, e);
      // nothing ...
    });
  }
}
