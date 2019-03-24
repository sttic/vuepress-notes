const fs = require("fs");
const path = require("path");

const ignoreStartList = [".", "_"];
const getFileTree = (dir, limit = Infinity, depth = 0) =>
  ((dir, isFile) =>
    Object.assign(path.parse(dir), {
      fullPath: dir,
      depth,
      isFile,
      children:
        isFile || depth >= limit
          ? null
          : fs
              .readdirSync(dir)
              .filter(base => !ignoreStartList.includes(base[0]))
              .map(base => getFileTree(path.join(dir, base), limit, depth + 1))
    }))(path.join(dir).replace(/\\/g, "/"), fs.lstatSync(dir).isFile());

const vuepressRoot = "docs";
const vuepressTree = getFileTree(vuepressRoot, 4);
const indexPages = ["readme.md", "index.md"];
const customSidebar = {};
const customNav = [];

const sections = vuepressTree.children.filter(dir => !dir.isFile);

sections.forEach(section => {
  const navItems = [];
  const subsections = section.children.filter(dir => !dir.isFile);
  subsections.forEach(subsection => {
    const subsectionPath = `/${subsection.fullPath.replace(
      `${vuepressRoot}/`,
      ""
    )}/`;

    navItems.push({
      text: subsection.base,
      link: subsectionPath
    });

    const folderFiles = subsection.children.filter(
      dir => dir.isFile && dir.ext === ".md"
    );
    customSidebar[subsectionPath] = [
      ...new Set(
        folderFiles
          .map(file =>
            indexPages.includes(file.base.toLowerCase()) ? "" : file.base
          )
          .sort()
      )
    ];

    const baseSections = subsection.children.filter(dir => !dir.isFile);
    baseSections.forEach(baseSection => {
      const baseSectionName = baseSection.name;

      var baseFiles = [
        ...new Set(
          baseSection.children
            .filter(dir => dir.isFile && dir.ext === ".md")
            .map(file =>
              indexPages.includes(file.base.toLowerCase())
                ? `${baseSectionName}/`
                : `${baseSectionName}/${file.name}`
            )
            .sort()
        )
      ];

      customSidebar[subsectionPath].push({
        title: baseSectionName,
        children: baseFiles
      });
    });
  });

  if (navItems.length !== 0)
    customNav.push({ text: section.name, items: navItems });
});

customNav.push({ text: "GitHub", link: "https://github.com/sttic" });

customSidebar["/"] = [
  ...[
    ...new Set(
      vuepressTree.children
        .filter(dir => dir.isFile && dir.ext === ".md")
        .map(file =>
          indexPages.includes(file.base.toLowerCase()) ? "" : file.base
        )
        .sort()
    )
  ],
  ...sections.map(section => ({
    title: section.name,
    children: section.children
      .filter(
        dir =>
          dir.isFile ||
          (!dir.isFile &&
            dir.children
              .map(child => child.base)
              .some(base => indexPages.includes(base.toLowerCase())))
      )
      .map(dir => `/${section.base}/${dir.base}${dir.isFile ? "" : "/"}`)
  }))
];

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
    nav: customNav,
    sidebar: customSidebar
  },

  markdown: {
    config: md => {
      md.use(require("markdown-it-container"), "center");
      md.use(require("markdown-it-katex"));
    }
  }
};
