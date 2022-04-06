import path from "node:path";
import util from "node:util";
import { createLogger, format, transports } from "winston";
import { inject, singleton } from "tsyringe";
import * as Transport from "winston-transport";

import { ConfigService } from "./Config";

const getCurrentData = () => {
  const currentDate = new Date();
  return `module-twitch-${process.pid}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${currentDate
    .getDate()
    .toString()
    .padStart(2, "0")}-${currentDate
    .getFullYear()
    .toString()
    .padStart(4, "0")}_${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}-${currentDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}-${currentDate
    .getSeconds()
    .toString()
    .padStart(2, "0")}-${currentDate
    .getMilliseconds()
    .toString()
    .padStart(4, "0")}`;
};

const logFileName = `log-${getCurrentData()}.txt`;

@singleton()
export class LoggerService {
  private logger: any;

  constructor(@inject(ConfigService) configService: ConfigService) {
    const transportsList: Transport[] = [
      new transports.File({
        format: LoggerService.utilFormat(false),
        filename: path.join(process.cwd(), "logs", logFileName),
      }),
    ];

    if (configService.debug) {
      transportsList.push(
        new transports.Console({
          format: LoggerService.utilFormat(true),
        })
      );
    }

    this.logger = createLogger({
      exitOnError: false,
      level: configService.debug ? "debug" : "info",
      transports: transportsList,
    });
  }

  static utilFormat(enableColor: boolean) {
    const printFormat = format.printf(
      ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
    );
    const formatFn = format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      {
        transform: (info: any) => {
          const args = info[Symbol.for("splat")] || [];
          info.message = util.formatWithOptions(
            { colors: enableColor },
            info.message,
            ...args
          );
          info.level = info.level.toUpperCase();
          return info;
        },
      }
    );
    return enableColor
      ? format.combine(formatFn, format.colorize(), printFormat)
      : format.combine(formatFn, printFormat);
  }

  log = (message: any, ...args: any[]) => this.logger.info(message, ...args);
  info = (message: any, ...args: any[]) => this.logger.info(message, ...args);
  warn = (message: any, ...args: any[]) => this.logger.warn(message, ...args);
  error = (message: any, ...args: any[]) => this.logger.error(message, ...args);
  debug = (message: any, ...args: any[]) => this.logger.debug(message, ...args);
}
