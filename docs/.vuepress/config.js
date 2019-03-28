const navigator = require("./navigator");

module.exports = {
  title: "Tommy Deng Notes",
  description: "Notes by Tommy Deng.",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css"
      }
    ]
  ],
  themeConfig: {
    nav: navigator.customNav,
    sidebar: navigator.customSidebar
  },

  markdown: {
    config: md => {
      md.use(require("markdown-it-container"), "center");
      md.use(require("markdown-it-katex"));
    }
  }
};
