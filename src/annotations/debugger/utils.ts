import { Debugger } from "./main";

/**
 * @deprecated I'm not super happy with how logging is done at the moment,
 * and thinking about removing this. I wouldn't recommend building with it.
 */
export function useDebugger(className: string): { logger: Debugger } {
  return { logger: Debugger.getInstance(className) };
}
