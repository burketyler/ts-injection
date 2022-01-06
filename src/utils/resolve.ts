import { META_TOKEN } from "../constants";
import { useInjectionContext } from "../injection-context";
import { InjectionError, Newable } from "../types";

const { injectionCtx } = useInjectionContext();

export function resolve<InjectableType extends Newable>(
  injectable: InjectableType
): InstanceType<InjectableType> {
  const token: string = Reflect.getMetadata(META_TOKEN, injectable);

  if (!token) {
    throw new InjectionError(
      `Unable to get token from class metaData for ${injectable.name}.`
    );
  }

  const getItemResult = injectionCtx.getItemByToken<InjectableType>(token);

  if (getItemResult.isError()) {
    throw new InjectionError(
      `Failed to resolve ${injectable.name}. Injectable with token ${token} doesn't exist.`
    );
  }

  return getItemResult.value().instance as InstanceType<InjectableType>;
}
