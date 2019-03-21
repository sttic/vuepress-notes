const fs = require("fs");
const path = require("path");

const coursePath = "docs/courses/";
const indexPages = ["readme.md", "index.md"];
const sidebarGroups = [
  { title: "Lectures", path: "lectures/" },
  { title: "Assignments", path: "assignments/" },
  { title: "Labs", path: "labs/" },
  { title: "Study", path: "notes/" },
  { title: "Resources", path: "resources/" }
];

function childrenIn(pathTo, parentFolder) {
  try {
    const folderPath = `${pathTo}${parentFolder}`;
    const children = fs
      .readdirSync(folderPath)
      .filter(fileOrDir =>
        fs.lstatSync(path.join(folderPath, fileOrDir)).isFile()
      )
      .filter(filename => path.extname(filename) === ".md")
      .map(filename =>
        indexPages.includes(filename.toLowerCase())
          ? parentFolder
          : `${parentFolder}${filename}`
      )
      .sort();
    return children.length > 1 && children[0] === children[1]
      ? children.splice(1)
      : children;
  } catch (error) {}
}

const courseCodes = fs
  .readdirSync(coursePath)
  .filter(filename =>
    fs.lstatSync(path.join(coursePath, filename)).isDirectory()
  );

const coursesItems = courseCodes.map(code => ({
  text: `${code}`,
  link: `/courses/${code}/`
}));

var customSidebar = {};
courseCodes.forEach(code => {
  const courseFolder = `/courses/${code}/`;
  const pathToCourse = path.join(coursePath, code);
  customSidebar[courseFolder] = fs
    .readdirSync(pathToCourse)
    .filter(fileOrDir =>
      fs.lstatSync(path.join(pathToCourse, fileOrDir)).isFile()
    )
    .some(filename => indexPages.includes(filename.toLowerCase()))
    ? [""]
    : [];
  sidebarGroups.forEach(group =>
    customSidebar[courseFolder].push({
      title: group.title,
      children: childrenIn(`${pathToCourse}/`, group.path)
    })
  );
});
customSidebar["/"] = [
  "",
  { title: "Courses", children: courseCodes.map(code => `/courses/${code}/`) }
];

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
