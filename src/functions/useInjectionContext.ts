import { InjectionContext } from "../classes/injectionContext";

export function useInjectionContext(): { injectionCtx: InjectionContext } {
  return { injectionCtx: InjectionContext.getInstance() };
}
