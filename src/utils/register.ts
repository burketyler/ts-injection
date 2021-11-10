import "reflect-metadata";
import { useInjectionContext } from "./use-injection-context";
import { META_TYPE } from "../constants";

const { injectionCtx } = useInjectionContext();

export function register<T>(
  injectable: T,
  token: string,
  type = "OBJECT"
): void {
  Reflect.defineMetadata(META_TYPE, type, injectable);
  injectionCtx.registerWithToken(injectable, token);
}
