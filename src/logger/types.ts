export enum LogLevel {
  ALL = "*",
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export enum LogNamespace {
  AUTOWIRE = "AUTOWIRE",
  INJECTION_CONTAINER = "INJECTION_CONTAINER",
  CLASS_REGISTRY = "CLASS_REGISTRY",
  INJECTABLE_REPO = "INJECTABLE_REPO",
  INJECTABLE = "INJECTABLE",
  ENV = "ENV",
}

export interface ILogger {
  debug: LogFunction;
  info: LogFunction;
  warn: LogFunction;
  error: LogFunction;
  log?: (level: LogLevel, msg: string, ...meta: any[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type LogFunction = (msg: string, ...meta: any[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
