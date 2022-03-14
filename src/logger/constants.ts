import { LogLevel } from "./types";

export const logLevelValueMap: { [key in LogLevel]: number } = {
  [LogLevel.DEBUG]: 20,
  [LogLevel.INFO]: 30,
  [LogLevel.WARN]: 40,
  [LogLevel.ERROR]: 50,
  [LogLevel.ALL]: Infinity,
};
