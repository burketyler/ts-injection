import "reflect-metadata";
import { META_TYPE } from "./di.model";
import { useInjectionContext } from "./useInjectionContext";

const { injectionCtx } = useInjectionContext();

export function register<T>(
  injectable: T,
  token: string,
  type: string = "OBJECT"
): void {
  Reflect.defineMetadata(META_TYPE, type, injectable);
  injectionCtx.registerWithToken(injectable, token);
}
