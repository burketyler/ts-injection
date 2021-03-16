import { META_TOKEN } from "./di.model";
import { useInjectionContext } from "./useInjectionContext";

const { injectionCtx } = useInjectionContext();

export function resolve<T>(injectable: new (...args: any[]) => any): T {
  const token: string = Reflect.getMetadata(META_TOKEN, injectable);
  if (!token) {
    throw new Error(
      `Unable to get token from class metaData for ${injectable.name}.`
    );
  }
  return injectionCtx.retrieveByToken(token) as T;
}
