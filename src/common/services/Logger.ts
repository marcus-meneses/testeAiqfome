import chalk from "chalk";
import { logLevel, logConfig } from "@common/types/loggerTypes";
import { Config } from "@common/services/Config";

export class Logger {
  options: logConfig;
  private static _instance: Logger;
  constructor() {
    const configuration = Config.Instance;
    this.options = {
      logLevel: configuration.get("LOGLEVEL") || logLevel.info,
      logFile: configuration.get("LOGFILE") || "",
      logTransport: null,
    };
  }

  public static get Instance(): Logger {
    return this._instance || (this._instance = new this());
  }

  public setLogTransport(transport: Function) {
    this.options.logTransport = transport;
  }

  private log(contents: { level: logLevel; message: string }) {
    const textContents = JSON.stringify({
      ...contents,
      level: logLevel[contents.level],
      timestamp: new Date().toISOString(),
    }, null, 2);

    const logType = Number(logLevel[this.options.logLevel]);
    if (contents.level >= logType) {
      switch (contents.level) {
        case logLevel.debug:
          if (this.options.logTransport) {
            this.options.logTransport(textContents);
          }
          if (this.options.logFile) {
            this.logToFile(textContents);
            break;
          }
          this._debug(textContents);
          break;
        case logLevel.info:
          if (this.options.logTransport) {
            this.options.logTransport(textContents);
          }
          if (this.options.logFile) {
            this.logToFile(textContents);
            break;
          }
          this._info(textContents);
          break;
        case logLevel.warning:
          if (this.options.logTransport) {
            this.options.logTransport(textContents);
          }
          if (this.options.logFile) {
            this.logToFile(textContents);
            break;
          }
          this._warning(textContents);
          break;
        case logLevel.error:
          if (this.options.logTransport) {
            this.options.logTransport(textContents);
          }
          if (this.options.logFile) {
            this.logToFile(textContents);
            break;
          }
          this._error(textContents);
          break;
      }
    }
  }

  public debug(message: string) {
    this.log({ level: logLevel.debug, message: message });
  }
  public info(message: string) {
    this.log({ level: logLevel.info, message: message });
  }
  public warning(message: string) {
    this.log({ level: logLevel.warning, message: message });
  }
  public error(message: string) {
    this.log({ level: logLevel.error, message: message });
  }

  private _debug(message: string) {
    console.log(chalk.gray(message));
  }
  private _info(message: string) {
    console.log(chalk.blue(message));
  }
  private _warning(message: string) {
    console.log(chalk.yellow(message));
  }
  private _error(message: string) {
    console.log(chalk.red(message));
  }

  private logToFile(message: string) {
    if (this.options.logFile) {
      const fs = require("fs");
      const path = require("path");
      const logFilePath = path.resolve(process.cwd(), this.options.logFile);
      if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, "", { flag: "w" });
      }

      fs.appendFile(this.options.logFile, message + "\n", (err: any) => {
        if (err) {
          console.error("Error writing to log file:", err);
        }
      });
    }
  }
}
