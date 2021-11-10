import { InjectionContext } from "../injection-context";

export function useInjectionContext(): { injectionCtx: InjectionContext } {
  return { injectionCtx: InjectionContext.getInstance() };
}
