export default function (target: any, fieldName: string): () => any {
  return Reflect.getMetadata("design:type", target, fieldName);
}
