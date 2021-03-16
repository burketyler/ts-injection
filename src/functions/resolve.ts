import { useInjectionContext } from "./useInjectionContext";
import { META_TOKEN } from "../domain/metaAttribs.const";

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
