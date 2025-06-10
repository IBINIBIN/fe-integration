// const postcss = require("postcss");
const { globSync } = require("glob");
const path = require("path");
const fs = require("fs-extra");
const prettier = require("prettier");

const postcss = require("postcss");
const selectorParser = require("postcss-selector-parser");

function extractFirstClass(selector) {
  let firstClass = null;

  const parser = selectorParser((selectors) => {
    selectors.walkClasses((classNode) => {
      if (!firstClass) {
        firstClass = classNode.value;
      }
    });
  });

  parser.processSync(selector);
  return firstClass;
}

async function extractStyleGroups(cssText) {
  const root = postcss.parse(cssText);
  const styleGroup = {};

  root.walkRules((rule) => {
    let commentCode = "";
    let commentText = "";
    const prevDecl = rule.prev();

    if (prevDecl?.type === "comment") {
      const preEndLine = prevDecl.source.end.line;
      const curStartLine = rule.source.start.line;
      if (curStartLine - preEndLine === 1) {
        commentText = prevDecl.text;
        commentCode = prevDecl.toString();
      }
    }

    rule.selectors.forEach((sel) => {
      const firstClass = extractFirstClass(sel);
      if (!firstClass) return;

      styleGroup[firstClass] ??= [];
      styleGroup[firstClass].push({
        commentText,
        code: `${commentCode}\n${rule.toString()}`,
      });
    });
  });

  const result = await Promise.all(
    Object.entries(styleGroup).map(async ([prefix, groups]) => {
      const intro = groups.find(({ commentText }) => commentText)?.commentText ?? "";
      const css = groups.map(({ commentText, code }) => code).join("");
      const css2 = await prettier.format(css, { parser: "css" });
      return {
        code: css2,
        type: "css",
        name: prefix,
        intro,
      };
    })
  );

  return result;
}

async function main() {
  const cssFilePaths = globSync("src/css/*.css").map((p) => path.resolve(p));

  return cssFilePaths.reduce(async (prev, cur) => {
    const css = await fs.readFile(cur, "utf-8");
    return prev.concat(await extractStyleGroups(css));
  }, []);
}

module.exports = main;
