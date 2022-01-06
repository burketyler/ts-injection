import { META_TYPE } from "../constants";
import { useInjectionContext } from "../injection-context";
import { InjectableType as InjectType } from "../types";

const { injectionCtx } = useInjectionContext();

export function register<InjectableType>(
  injectable: InjectableType,
  token: string,
  type = InjectType.OBJECT
): void {
  Reflect.defineMetadata(META_TYPE, type, injectable);

  injectionCtx.registerWithToken<InjectableType>(injectable, token);
}
