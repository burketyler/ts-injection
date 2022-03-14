import { inspect } from "util";

import { logLevelValueMap } from "./constants";
import { LogLevel } from "./types";

export function format(
  ns: string,
  level: LogLevel,
  msg: string,
  ...metadata: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
): string {
  const payload: Record<string, unknown> = {
    level: logLevelValueMap[level],
    time: Date.now(),
    ns: `tsi:${ns.toLowerCase()}`,
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
