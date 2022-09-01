export const TSI_LOG_KEY = "TSI_DEBUG";
export const PARAM_LIST = Symbol("TSI_PARAM_LIST");
export const AUTO_WIRE_LIST = Symbol("TSI_AUTO_WIRE_LIST");

export const PRIMITIVE_TYPES = {
  NUMBER: (1).constructor,
  STRING: "S".constructor,
  OBJECT: {}.constructor,
  ARRAY: [].constructor,
  BOOLEAN: true.constructor,
};
