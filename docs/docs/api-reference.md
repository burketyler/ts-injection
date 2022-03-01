---
sidebar_position: 3
---

# API Reference

## Annotations

### @Injectable

`@Injectable`

Indicate to `ts-injection` that this class should be handled by the injection context.
It can be retrieved from the context using `resolve` or `@Autowire`.

### @Autowire

`@Autowire(tokenOrClass: string | Newable)`

Inject the specified named injectable or class injectable by its reference.
In the case of a named injectable, provide the id name:

```typescript
@Autowire("TOKEN_NAME")
```

In the case of a class injectable, provide a reference to the class newable:

```typescript
@Autowire(MyClass)
```

### @Env

`@Env<VariableType>(varName: string, options?: InjectableOptions)`

Inject the specified environment variable from process.env into the annotated class member.
The `type` of the `class member` this annotation has been applied to is used to infer how
to parse the value. Supported types are: `string`, `boolean`, `object`, `number`.

You can also optionally pass a mapping function that will take in the string value and
return the mapped value.

:::info

If an environment variable isn't found at runtime, by default a warning will be logged but
the program will continue to run. If you want to throw instead, this behaviour can be
configured in the options using `failBehaviour`.

:::

##### InjectableOptions

```typescript
export interface InjectableOptions<VariableType> {
  default?: VariableType;
  failBehaviour?: "THROW" | "LOG" | "SILENT";
  mapper?: (val: string) => VariableType;
}
```

## Functions

### resolve

`resolve<ClassType extends Newable>( injectable: ClassType ): InstanceType<ClassType>`

Get an instance of the provided injectable class from the injection context.
Use this instead of calling `new` on injectable classes.
Must supply a reference to the injectable class's newable:

```typescript
resolve<MyClass>(MyClass);
```

:::warning

Providing a non-injectable class (not annotated with `@Injectable`)
will throw an error.

:::

### register

`register<ClassType>(injectable: ClassType, id: string, type = InjectType.OBJECT): void`

Register any object or value with the injectable context given a specified id
(used as reference). This injectable can then be accessed in classes with the `@Autowire`
annotation. You can optionally specify a `type` which can be useful when extending this framework.

```typescript
register<{ myVar: string }>({ myVar: "test" }, "MY_TOKEN");
```

## Extending ts-injection

Some internal APIs can be used to extend the functionality provided by `ts-injection`.
An example of this is the [fastify-boot](https://github.com/burketyler/fastify-boot) library.

### useInjectionContext

`useInjectionContext(): { injectionCtx: InjectionContext }`

Obtain the instance of the `InjectionContext` class.
Read more about this in [InjectionContext](/docs/api-reference#injectioncontext).

### makeClassInjectable

`makeClassInjectable<ClassType extends Newable>(classCtor: ClassType) : Throwable<InjectionError, InjectableItem<InstanceType<ClassType>>>`

The internal API that `@Injectable` invokes to instantiate the provided class and add
the instance to the injection context. Input must be a class newable. The return object
is a `Throwable` with either an `InjectionError` on error or an `InjectableItem` on success.

### InjectionContext

The class responsible for managing the injection context that `ts-injection` uses.

#### Domain

##### InjectableItem

```typescript
export interface InjectableItem<ClassType> {
  id: string;
  value: ClassType;
}
```

##### Newable

```typescript
type Newable = new (...args: any[]) => any;
```

#### Methods

##### register

`register<ClassType extends Newable>(injectable: ClassType): string`

Register an injectable class object or value into the injection context.
Returns an auto-generated id reference to the injectable.

##### registerWithToken

`registerWithToken<ClassType>(injectable: ClassType, id: string): void`

Register an injectable class object or value into the injection context with a specific id.
If the id already exists in the context, it will replace the existing item.

##### doesItemExist

`doesItemExist(id: string): boolean`

Check if a given injectable exists in the injectable context by its id reference.

##### getItemByToken

`getItemByToken<ClassType>(id: string): Throwable<InjectableNotFoundError, InjectableItem<ClassType>>`

Retrieve an injectable by its id reference. Returns a `Throwable` instance which will
contain an `InjectableNotFoundError` on error or the `InjectableItem` on success.

```typescript
const getItemResult = getItemByToken<MyType>("id");

if (getItemResult.isError()) {
  // Handle error
}

return getItemResult.value(); // <- InjectableItem
```

##### addMetadataToItem

`addMetadataToItem(id: string, metaData: { [key: string]: unknown }): void`

Add the specified metaData keys to an injectable instance based on its id reference.\
E.g:

```typescript
const id = makeClassInjectable(classCtor);
injectionCtx.addMetadataToItem(id, {
  [META_TYPE]: "MY_TYPE",
});
```

#### queryItemsByType

`queryItemsByType<ClassType>(type: string): ClassType[]`

Retrieve an array of injectables that match the provided type.\
ClassType is defined by the string value added to the injectable metaData key [META_TYPE](#meta_type).

```typescript
const injectables = injectionCtx.queryItemsByType("MY_TYPE");
```
