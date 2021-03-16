import { InjectionContext } from "./injectionContext";

export function useInjectionContext(): { injectionCtx: InjectionContext } {
  return { injectionCtx: InjectionContext.getInstance() };
}
