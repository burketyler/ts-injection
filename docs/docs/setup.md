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

:::warning

Your runtime must support `Symbols`.

:::
