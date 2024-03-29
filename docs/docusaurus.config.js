// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/oceanicNext");
const darkCodeTheme = require("prism-react-renderer/themes/vsDark");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Documentation",
  tagline: "ts-injection documentation",
  url: "https://burketyler.github.io",
  baseUrl: "/ts-injection/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",
  organizationName: "burketyler", // Usually your GitHub org/user name.
  projectName: "ts-injection", // Usually your repo name.
  trailingSlash: false,

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebar.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "ts-injection",
        logo: {
          alt: "ts-injection logo",
          src: "img/logo.png",
        },
        items: [
          {
            type: "doc",
            docId: "setup",
            position: "left",
            label: "Docs",
          },
          {
            href: "https://github.com/burketyler/ts-injection",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Setup",
                to: "/docs/setup",
              },
              {
                label: "Usage",
                to: "/docs/usage",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "NPM",
                href: "https://www.npmjs.com/package/ts-injection",
              },
              {
                label: "GitHub",
                href: "https://github.com/burketyler/ts-injection",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Wirt's Leg Pty Ltd.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
