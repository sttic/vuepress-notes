const fs = require("fs");
const path = require("path");

const vuepressRoot = "docs";
const indexPages = ["readme.md", "index.md"];
const ignoreStartList = [".", "_"];
const validFileExtList = [".md"];

const getFileTree = (dir, limit = Infinity, depth = 0) => {
  const dirFSlash = path.join(dir).replace(/\\/g, "/");
  const lstat = fs.lstatSync(dir);
  return Object.assign(path.parse(dirFSlash), {
    fullPath: dirFSlash,
    depth,
    isDirectory: lstat.isDirectory(),
    isFile: lstat.isFile(),
    children: lstat.isFile()
      ? null
      : depth >= limit
      ? []
      : fs
          .readdirSync(dir)
          .filter(base => {
            const lstat = fs.lstatSync(path.join(dir, base));
            return (
              (!ignoreStartList.includes(base[0]) && lstat.isDirectory()) ||
              (lstat.isFile() && validFileExtList.includes(path.extname(base)))
            );
          })
          .map(base => getFileTree(path.join(dir, base), limit, depth + 1))
  });
};

const removeDuplicates = arr => [...new Set(arr)];

const containsIndexFile = routeTree =>
  routeTree.children
    .map(child => child.base)
    .some(base => indexPages.includes(base.toLowerCase()));

const caseInsensitiveCompare = (a, b) =>
  a.localeCompare(b, "en", { sensitivity: "base" });

const sidebarFiles = routeTree =>
  removeDuplicates(
    routeTree.children
      .filter(dir => dir.isFile)
      .map(file =>
        indexPages.includes(file.base.toLowerCase()) ? "" : file.base
      )
  ).sort(caseInsensitiveCompare);

const sidebarGroups = routeTree =>
  removeDuplicates(
    routeTree.children
      .filter(dir => dir.isDirectory)
      .map(folder => ({
        title: folder.name,
        children: removeDuplicates(
          folder.children
            .filter(
              dir => dir.isFile || (dir.isDirectory && containsIndexFile(dir))
            )
            .map(
              dir =>
                `${folder.base}/${
                  indexPages.includes(dir.base.toLowerCase()) ? "" : dir.base
                }${dir.isFile ? "" : "/"}`
            )
        ).sort(caseInsensitiveCompare)
      }))
  );

const createSidebar = routeTree => {
  return [...sidebarFiles(routeTree), ...sidebarGroups(routeTree)];
};

const parseRootPath = routeTree =>
  `${routeTree.fullPath.replace(vuepressRoot, "")}/`;

const recurseSidebar = (sidebar, routeTree) => {
  routeTree.children
    .filter(dir => dir.isDirectory)
    .map(route => recurseSidebar(sidebar, route));
  sidebar[parseRootPath(routeTree)] = createSidebar(routeTree);
};

const vuepressTree = getFileTree(vuepressRoot);
const customSidebar = {};
const customNav = [];

recurseSidebar(customSidebar, vuepressTree);

const sections = vuepressTree.children.filter(dir => dir.isDirectory);
sections.forEach(section => {
  const navItems = [];
  section.children
    .filter(dir => dir.isDirectory)
    .forEach(subsection => {
      const subsectionPath = parseRootPath(subsection);
      if (containsIndexFile(subsection))
        navItems.push({
          text: subsection.base,
          link: subsectionPath
        });
    });

  if (navItems.length !== 0) {
    customNav.push({ text: section.name, items: navItems });
  }
});

customNav.push({
  text: "GitHub",
  link: "https://github.com/sttic/vuepress-notes"
});

exports.customNav = customNav;
exports.customSidebar = customSidebar;
