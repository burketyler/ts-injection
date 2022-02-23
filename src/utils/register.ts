import { META_TYPE } from "../constants";
import { useInjectionContext } from "../injection-context";

const { injectionCtx } = useInjectionContext();

export function register<InjectableType>(
  injectable: InjectableType,
  token: string,
  type?: string
): void {
  if (type) {
    Reflect.defineMetadata(META_TYPE, type, injectable);
  }

  injectionCtx.registerWithToken<InjectableType>(injectable, token);
}
