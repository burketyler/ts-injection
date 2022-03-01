export const TAG_CLASS = "TSI_CLASS";
export const TAG_OBJECT = "TSI_OBJECT";

export const PARAM_LIST = Symbol("TSI_PARAM_LIST");
export const AUTO_WIRE_LIST = Symbol("TSI_AUTO_WIRE_LIST");

export const PRIMITIVE_TYPES = {
  NUMBER: (1).constructor,
  STRING: "S".constructor,
  OBJECT: {}.constructor,
  ARRAY: [].constructor,
  BOOLEAN: true.constructor,
};

export const ERROR_LINK_CIRC_DEP =
  "https://burketyler.github.io/ts-injection/docs/caveats#circular-dependencies";
