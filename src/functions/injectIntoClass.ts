export function injectIntoClass(
  classCtor: any,
  member: string,
  injectable: any
): void {
  classCtor[member] = injectable;
}
