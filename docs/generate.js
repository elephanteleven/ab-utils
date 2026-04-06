const jsdoc2md = require("jsdoc-to-markdown");
const fs = require("fs");
const path = require("path");

const data = jsdoc2md.getTemplateDataSync({
   files: ["./ab-utils.js", "./utils/*.js"],
});

const fixLinks = (filename, markdown, folder) => {
   folder = folder ? `${folder}/` : "";
   return markdown.replace(/]\(#([^)+.]+)\+?\.?[^)]*\)/g, (match, name) => {
      if (name.includes(filename)) return match;
      else return match.replace("#", `./${folder}${name}.md#`);
   });
};

const unique = [];
data.forEach((item) => {
   if (unique.find((u) => u.id == item.id)) return;
   unique.push(item);
});

/* reduce templateData to an array of class names */
const classNames = unique.reduce((classNames, identifier) => {
   if (identifier.kind === "class") classNames.push(identifier.name);
   return classNames;
}, []);

const classIndex = [];
/* create a documentation file for each class */
for (const className of classNames) {
   if (className == "service") continue; //This is ab-utils.service (already documented)
   classIndex.push(`[${className}](./docs/${className}.md)`);
   const template = `{{#class name="${className}"}}{{>docs}}{{/class}}`;
   const output = jsdoc2md.renderSync({ data: unique, template });
   fs.writeFileSync(
      `${__dirname}/${className}.md`,
      fixLinks(className, output),
   );
}

const abutils = jsdoc2md.renderSync({
   data,
   template: `{{#module name="ab-utils"}}{{>docs}}{{/module}}`,
});

fs.writeFileSync(`${__dirname}/ab-utils.md`, abutils);
const readmeBase = fs.readFileSync(
   path.resolve(__dirname, "README.hbs"),
   "utf8",
);

const readme = jsdoc2md.renderSync({
   data,
   template: `${readmeBase}
## Classes
 - ${classIndex.join("\n - ")}`,
});

fs.writeFileSync(
   path.resolve(__dirname, "../README.md"),
   fixLinks("module_ab-utils", readme, "docs"),
);
