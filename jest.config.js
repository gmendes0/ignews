/** @type {import('jest').Config} */
const config = {
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTest.ts"],
  transform: {
    "^.+\\.(?:js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^.+\\.(?:css|scss|sass)$": "identity-obj-proxy",
  },
};

module.exports = config;