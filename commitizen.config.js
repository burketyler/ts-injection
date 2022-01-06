module.exports = {
  types: [
    {
      value: "feat",
      name: "✨   Feat: A new feature",
    },
    {
      value: "fix",
      name: "🐛  Fix: A bug fix",
    },
    {
      value: "docs",
      name: "📚  Docs: Documentation only changes",
    },
    {
      value: "style",
      name: "💅  Style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
    },
    {
      value: "refactor",
      name: "📦  Refactor: A code change that neither fixes a bug nor adds a feature",
    },
    {
      value: "perf",
      name: "🚀  Perf: A code change that improves performance",
    },
    {
      value: "test",
      name: "🚨  Test: Adding missing tests or correcting existing tests",
    },
    {
      value: "build",
      name: "🛠  Build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
    },
    {
      value: "ci",
      name: "⚙️  CI: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
    },
    {
      value: "chore",
      name: "♻️  Chore: Other changes that don't modify src or test files",
    },
    {
      value: "revert",
      name: "🗑  Revert: Reverts a previous commit",
    },
  ],
  allowCustomScopes: false,
  allowBreakingChanges: ["feat"],
};
