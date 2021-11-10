export function extractType(target: any, fieldName: string): () => any {
  return Reflect.getMetadata("design:type", target, fieldName);
}
