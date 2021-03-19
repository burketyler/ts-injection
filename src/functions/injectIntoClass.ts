export function injectIntoClass(
  classOrClassCtor: any,
  member: string,
  injectable: any
): void {
  classOrClassCtor[member] = injectable;
}
