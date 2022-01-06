---
sidebar_position: 1
---

# Setup

## Installation

`npm install ts-injection`

or

`yarn add ts-injection`

## Requirements

Make sure your tsconfig.json contains

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

Install [reflect-metadata](https://www.npmjs.com/package/reflect-metadata).
At the entrypoint to your application, include:

```typescript
import "reflect-metadata";
```

:::warning

Your runtime must support `Symbols`.

:::
