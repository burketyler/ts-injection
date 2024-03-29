/* eslint-disable no-console, @typescript-eslint/no-explicit-any */

import { ILogger, LogLevel } from "./types";
import { format, parseLogLvl } from "./utils";

export class Logger implements ILogger {
  private readonly isEnabled: boolean;

  private readonly level: LogLevel;

  constructor(
    private readonly namespace: string,
    private readonly envKey: string,
    private readonly instance?: ILogger
  ) {
    const { level, isEnabled } = this.parseNamespace();

    this.isEnabled = isEnabled;
    this.level = level;
  }

  public debug(msg: string, ...meta: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      if (this.instance) {
        this.instance.debug(msg, ...meta);
      } else {
        console.debug(format(this.namespace, LogLevel.DEBUG, msg, ...meta));
      }
    }
  }

  public info(msg: string, ...meta: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      if (this.instance) {
        this.instance.info(msg, ...meta);
      } else {
        console.debug(format(this.namespace, LogLevel.INFO, msg, ...meta));
      }
    }
  }

  public warn(msg: string, ...meta: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      if (this.instance) {
        this.instance.warn(msg, ...meta);
      } else {
        console.debug(format(this.namespace, LogLevel.WARN, msg, ...meta));
      }
    }
  }

  public error(msg: string, ...meta: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      if (this.instance) {
        this.instance.error(msg, ...meta);
      } else {
        console.debug(format(this.namespace, LogLevel.ERROR, msg, ...meta));
      }
    }
  }

  public log(level: LogLevel, msg: string, ...meta: any[]): void {
    console.log(format(this.namespace, level, msg, ...meta));
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG,
      LogLevel.ALL,
    ];

    return (
      this.isEnabled &&
      levels.slice(0, levels.indexOf(this.level) + 1).some((l) => l === level)
    );
  }

  private parseNamespace(): { isEnabled: boolean; level: LogLevel } {
    const logEnvVar = process.env[this.envKey];

    if (logEnvVar === "*") {
      return { isEnabled: true, level: LogLevel.ALL };
    }

    let level = LogLevel.ALL;
    let isEnabled = false;

    logEnvVar?.split(",").forEach((namespace) => {
      const [name, logLvl] = namespace.split("=");

      if (name.toLowerCase() === this.namespace.toLowerCase() || name === "*") {
        isEnabled = true;
        level = parseLogLvl(logLvl);
      }
    });

    return {
      isEnabled,
      level,
    };
  }
}
