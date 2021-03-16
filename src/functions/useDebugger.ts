import { Debugger } from "../classes/debugger";

export function useDebugger(className: string): { logger: Debugger } {
  return { logger: Debugger.getInstance(className) };
}
