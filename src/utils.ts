import { TAG_CLASS } from "./constants";
import { ClassMetadata, Newable } from "./types";

export function isNewable(newable: unknown): newable is Newable {
  return !!(
    (newable as Newable)?.constructor && (newable as Newable)?.prototype
  );
}

export function isClass(_class: unknown): _class is Newable {
  const options = Reflect.getMetadata(
    ClassMetadata.OPTIONS,
    (_class as Newable).constructor
  );

  return options?.tags.some((tag: string) => tag === TAG_CLASS) ?? false;
}
