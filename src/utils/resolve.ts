import { useInjectionContext } from "./use-injection-context";
import { META_TOKEN } from "../constants";
import { Newable } from "../types/newable";

const { injectionCtx } = useInjectionContext();

export function resolve<T>(injectable: Newable): T {
  const token: string = Reflect.getMetadata(META_TOKEN, injectable);
  if (!token) {
    throw new Error(
      `Unable to get token from class metaData for ${injectable.name}.`
    );
  }
  return injectionCtx.retrieveByToken(token) as T;
}
