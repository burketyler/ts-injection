import { InjectableOptions } from "../types";

export type RegisterOptions = Omit<InjectableOptions, "token"> & {
  token?: string;
};

export interface InjectionContainerOptions {
  isManualInit?: boolean;
}
