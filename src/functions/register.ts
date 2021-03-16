import "reflect-metadata";
import { useInjectionContext } from "./useInjectionContext";
import { META_TYPE } from "../domain/metaAttribs.const";

const { injectionCtx } = useInjectionContext();

export function register<T>(
  injectable: T,
  token: string,
  type: string = "OBJECT"
): void {
  Reflect.defineMetadata(META_TYPE, type, injectable);
  injectionCtx.registerWithToken(injectable, token);
}
