/* eslint-disable no-console, @typescript-eslint/no-explicit-any */

import { LogLevel } from "./types";
import { format, parseLogLvl } from "./utils";

export class Loxgger {
  private readonly isEnabled: boolean;

  private readonly level: LogLevel;

  constructor(
    private readonly namespace: string,
    private readonly envKey: string
  ) {
    const { level, isEnabled } = this.parseNamespace();

    this.isEnabled = isEnabled;
    this.level = level;
  }

  public debug(msg: string, ...meta: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(format(this.namespace, LogLevel.DEBUG, msg, ...meta));
    }
  }

  public info(msg: string, ...meta: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(format(this.namespace, LogLevel.INFO, msg, ...meta));
    }
  }

  public warn(msg: string, ...meta: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(format(this.namespace, LogLevel.WARN, msg, ...meta));
    }
  }

  public error(msg: string, ...meta: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(format(this.namespace, LogLevel.ERROR, msg, ...meta));
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

    process.env.TSI_DEBUG?.split(",").forEach((namespace) => {
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
