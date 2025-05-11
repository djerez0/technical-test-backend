import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/src", "<rootDir>/__tests__"],
  globals: {
    "ts-jest": {
      useESM: true, // Habilita el uso de ECMAScript Modules
      babelConfig: true, // Asegúrate de que Babel sea usado para transformar
    },
  },
  transformIgnorePatterns: [
    "/node_modules/(?!lowdb|other-esm-libraries)/", // Asegúrate de incluir lowdb
  ],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest", // Usa ts-jest para transpilación de TypeScript
  },
};

export default config;
