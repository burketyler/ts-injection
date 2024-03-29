import { InitialOptionsTsJest } from "ts-jest";

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./src", "./tests"],
  testPathIgnorePatterns: ["node_modules", ".build", "src"],
  collectCoverageFrom: ["src/**/*.ts"]
} as InitialOptionsTsJest;
