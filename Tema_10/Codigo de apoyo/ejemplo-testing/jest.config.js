const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/tests/"], // Ignora tests E2E de Playwright
});
