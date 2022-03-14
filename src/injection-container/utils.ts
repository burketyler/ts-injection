let instanceCursor = 0;

export function generateInstanceName(): string {
  instanceCursor += 1;
  return `cont[${instanceCursor}]`;
}
