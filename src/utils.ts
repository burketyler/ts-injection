import { ClassDef, Newable } from "./types";

export function isNewable(newable: unknown): newable is Newable {
  return !!(newable as Newable).constructor && (newable as Newable)?.prototype;
}

export function isClassDef(Class: unknown): Class is ClassDef {
  return !!(Class as ClassDef)?.name && (Class as ClassDef)?.prototype;
}
