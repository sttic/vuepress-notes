const fs = require("fs");
const path = require("path");

const coursePath = "docs/courses/";

const courseCodes = fs
  .readdirSync(coursePath)
  .filter(filename =>
    fs.lstatSync(path.join(coursePath, filename)).isDirectory()
  );

const coursesItems = courseCodes.map(code => ({
  text: `${code}`,
  link: `/courses/${code}/`
}));

const childrenIn = (path, parentFolder) => {
  try {
    return fs
      .readdirSync(`${path}${parentFolder}`)
      .map(file =>
        file.toLowerCase() === "readme.md"
          ? parentFolder
          : `${parentFolder}${file}`
      )
      .sort();
  } catch (error) {}
};

var customSidebar = {};
courseCodes.forEach(code => {
  const courseFolder = `/courses/${code}/`;
  const courseFolders = [
    { title: "Lectures", path: "lectures/" },
    { title: "Assignments", path: "assignments/" },
    { title: "Labs", path: "labs/" },
    { title: "Study", path: "notes/" },
    { title: "Resources", path: "resources/" }
  ];
  customSidebar[courseFolder] =
    fs
      .readdirSync(coursePath + code)
      .map(filename => filename.toLowerCase())
      .indexOf("readme.md") >= 0
      ? [""]
      : [];
  courseFolders.forEach(item =>
    customSidebar[courseFolder].push({
      title: item.title,
      children: childrenIn(`${coursePath}${code}/`, item.path)
    })
  );
});
customSidebar["/"] = [
  "",
  { title: "Courses", children: courseCodes.map(code => `courses/${code}/`) }
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
