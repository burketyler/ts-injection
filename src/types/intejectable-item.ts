/**
 * @deprecated please use InjectableItem instead
 */
export type InjectableItemModel<T> = InjectableItem<T>;

export interface InjectableItem<T> {
  token: string;
  value: T;
}
