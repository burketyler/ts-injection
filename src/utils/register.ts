import "reflect-metadata";
import { META_TYPE } from "../constants";
import { useInjectionContext } from "../injection-context";

const { injectionCtx } = useInjectionContext();

export function register<InjectableType>(
  injectable: InjectableType,
  token: string,
  type = "OBJECT"
): void {
  Reflect.defineMetadata(META_TYPE, type, injectable);

  injectionCtx.registerWithToken<InjectableType>(injectable, token);
}
