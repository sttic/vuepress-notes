const fs = require("fs");
const path = require("path");

const getFileTree = (dir, limit = Infinity, depth = 0) => {
  dir = path.join(dir).replace(/\\/g, "/");
  const isFile = fs.lstatSync(dir).isFile();
  return {
    dir,
    depth,
    isFile,
    children:
      isFile || depth >= limit
        ? null
        : fs
            .readdirSync(dir)
            .map(d => getFileTree(path.join(dir, d), limit, depth + 1))
  };
};

const courseFolderPath = "docs/courses";
const indexPages = ["readme.md", "index.md"];
const courseFolderTree = getFileTree(courseFolderPath, 3);

const coursesItems = [];
const customSidebar = {};
courseFolderTree.children
  .filter(course => !course.isFile)
  .map(course => {
    const coursePath = `/${course.dir.replace("docs/", "")}/`;
    coursesItems.push({
      text: path.basename(course.dir),
      link: `/${course.dir.replace("docs/", "")}/`
    });
    customSidebar[coursePath] = course.children
      .filter(child => child.isFile)
      .some(child =>
        indexPages.includes(path.basename(child.dir).toLowerCase())
      )
      ? [""]
      : [];

    course.children
      .filter(child => !child.isFile)
      .forEach(child => {
        const courseComponent = path.basename(child.dir);
        var children = child.children
          .filter(child => child.isFile && path.extname(child.dir) === ".md")
          .map(child => {
            const filename = path.basename(child.dir);
            return indexPages.includes(filename.toLowerCase())
              ? `${courseComponent}/`
              : `${courseComponent}/${filename}`;
          })
          .sort();
        children =
          children.length > 1 && children[0] === children[1]
            ? children.splice(1)
            : children;
        customSidebar[coursePath].push({
          title: courseComponent,
          children
        });
      });
  });
customSidebar["/"] = [
  "",
  { title: "Courses", children: coursesItems.map(item => item.link) }
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
    nav: [
      {
        text: "Courses",
        items: coursesItems
      },
      { text: "GitHub", link: "https://github.com/sttic" }
    ],
    sidebar: customSidebar
  },

  markdown: {
    config: md => {
      md.use(require("markdown-it-container"), "center");
      md.use(require("markdown-it-katex"));
    }
  }
};
