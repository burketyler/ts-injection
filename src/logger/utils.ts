import { inspect } from "util";

import { LogLevel } from "./types";

export function format(
  namespace: string,
  level: string,
  msg: string,
  ...metadata: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
): string {
  const payload: Record<string, unknown> = {
    time: Date.now(),
    namespace,
    level,
    msg,
  };

  if (metadata?.[0]) {
    payload.metadata = metadata.map((m) => {
      return inspect(m, false, 3);
    });
  }

  return JSON.stringify(payload);
}

export function parseLogLvl(lvl: string | undefined): LogLevel {
  switch (lvl?.toUpperCase()) {
    case LogLevel.ALL:
      return LogLevel.ALL;
    case LogLevel.DEBUG:
      return LogLevel.DEBUG;
    case LogLevel.ERROR:
      return LogLevel.ERROR;
    case LogLevel.INFO:
      return LogLevel.INFO;
    case LogLevel.WARN:
      return LogLevel.WARN;
    default:
      return LogLevel.ALL;
  }
}
