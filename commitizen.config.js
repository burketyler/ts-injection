const types = [
  {
    value: "feat",
    name: "✨   Features: A new feature",
  },
  {
    value: "fix",
    name: "🐛  Bug Fixes: A bug fix",
  },
  {
    value: "docs",
    name: "📚  Documentation: Documentation only changes",
  },
  {
    value: "style",
    name:
      "💎  Styles: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
  },
  {
    value: "refactor",
    name:
      "📦  Code Refactoring: A code change that neither fixes a bug nor adds a feature",
  },
  {
    value: "perf",
    name:
      "🚀  Performance Improvements: A code change that improves performance",
  },
  {
    value: "test",
    name: "🚨  Tests: Adding missing tests or correcting existing tests",
  },
  {
    value: "build",
    name:
      "🛠  Builds: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
  },
  {
    value: "ci",
    name:
      "⚙️  Continuous Integrations: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
  },
  {
    value: "chore",
    name: "♻️  Other changes that don't modify src or test files",
  },
  {
    value: "revert",
    name: "🗑  Reverts: Reverts a previous commit",
  },
];

module.exports = {
  types,
  allowCustomScopes: false,
  allowBreakingChanges: ["feat"],
};
