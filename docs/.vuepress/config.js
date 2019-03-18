module.exports = {
  title: "Tommy Deng Notes",
  description: "Notes by Tommy Deng.",
  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css"
      }
    ]
  ],
  themeConfig: {
    nav: [
      {
        text: "Courses",
        items: [
          { text: "CSI3131", link: "/CSI3131/" },
          { text: "SEG3103", link: "/SEG3103/" },
          { text: "SEG3125", link: "/SEG3125/" }
        ]
      },
      { text: "GitHub", link: "https://github.com/sttic" }
    ],
    sidebar: {
      "/CSI3131/": ["", { title: "Lectures", children: [] }],
      "/SEG3103/": ["", { title: "Lectures", children: [] }],
      "/SEG3125/": ["", { title: "Lectures", children: [] }],
      "/": [""]
    }
  },

  markdown: {
    anchor: { permalink: false },
    config: md => {
      md.use(require("markdown-it-katex"));
    }
  }
};
