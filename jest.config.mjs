// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  testURL: 'http://localhost/',
  collectCoverage: true,
  coverageReporters: ["json", "html"],
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**"
  ]
};