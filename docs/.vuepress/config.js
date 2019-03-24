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
              .filter(name => !ignoreStartList.includes(name[0]))
              .map(name => getFileTree(path.join(dir, name), limit, depth + 1))
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

    const folderFiles = subsection.children.filter(dir => dir.isFile);
    customSidebar[subsectionPath] = folderFiles.some(child =>
      indexPages.includes(child.name.toLowerCase())
    )
      ? [""]
      : [];

    const baseSections = subsection.children.filter(dir => !dir.isFile);
    baseSections.forEach(baseSection => {
      const baseSectionName = baseSection.name;

      var baseFiles = baseSection.children
        .filter(dir => dir.isFile && dir.ext === ".md")
        .map(file =>
          indexPages.includes(file.base.toLowerCase())
            ? `${baseSectionName}/`
            : `${baseSectionName}/${file.name}`
        )
        .sort();

      baseFiles =
        baseFiles.length > 1 && baseFiles[0] === baseFiles[1]
          ? baseFiles.splice(1)
          : baseFiles;

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

customSidebar["/"] = [""];
sections.forEach(section => {
  customSidebar["/"].push({
    title: section.name,
    children: section.children
      .filter(dir => !dir.isFile)
      .map(subsection => `/${section.base}/${subsection.base}/`)
  });
});

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
