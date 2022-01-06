export const META_PARAMS = "design:paramtypes";
export const META_TOKEN = "inj:token";
export const META_TYPE = "inj:type";

export const PARAM_LIST = Symbol("ParamList");
export const AUTO_WIRE_LIST = Symbol("AutoWireList");

export const PRIMITIVE_TYPES = {
  NUMBER: (1).constructor,
  STRING: "S".constructor,
  OBJECT: {}.constructor,
  ARRAY: [].constructor,
  BOOLEAN: true.constructor,
};
