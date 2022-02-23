/* eslint-disable no-console */

export class Debugger {
  private static readonly loggers: { [key: string]: Debugger } = {};

  private isDebugMode = false;

  public static getInstance(className: string): Debugger {
    const debugClasses = process.env.DEBUG_CLASSES;
    let logger: Debugger | undefined = Debugger.loggers[className];

    if (!logger) {
      logger = new Debugger();
      Debugger.loggers[className] = logger;
    }

    if (debugClasses) {
      logger.isDebugMode = debugClasses
        .split(",")
        .some((tar) => tar === className);
    } else {
      logger.isDebugMode = false;
    }

    return logger;
  }

  public debug(msg: string, ...meta: unknown[]): void {
    if (!this.isDebugMode) {
      return;
    }

    console.debug(msg, ...meta);
  }
}
