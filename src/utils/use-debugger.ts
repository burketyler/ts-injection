import { Debugger } from "../debugger";

export function useDebugger(className: string): { logger: Debugger } {
  return { logger: Debugger.getInstance(className) };
}
