import { InjectionContext } from "./main";

export function useInjectionContext(): { injectionCtx: InjectionContext } {
  return { injectionCtx: InjectionContext.getInstance() };
}
