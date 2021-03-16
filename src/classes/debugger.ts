export class Debugger {
  private static readonly loggers: { [key: string]: Debugger } = {};
  private isDebugMode: boolean;

  private constructor() {}

  public static getInstance(className: string): Debugger {
    let logger: Debugger = Debugger.loggers[className];
    if (!logger) {
      logger = new Debugger();
      Debugger.loggers[className] = logger;
    }
    this.setDebugMode(logger, className);
    return logger;
  }

  public debug(msg: string, object?: any) {
    if (this.isDebugMode) {
      if (object) {
        console.debug(msg, object);
      } else {
        console.debug(msg);
      }
    }
  }

  private static setDebugMode(logger: Debugger, className: string) {
    const debugClasses: string = process.env.DEBUG_CLASSES;
    if (debugClasses) {
      logger.isDebugMode = debugClasses
        .split(",")
        .some(tar => tar === className);
    } else {
      logger.isDebugMode = false;
    }
  }
}
