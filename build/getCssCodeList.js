const postcss = require("postcss");
const { globSync } = require("glob");
const path = require("path");
const fs = require("fs-extra");

async function main() {
  let cssCodeList = [];
  /** 获取所有css文件地址 */
  const cssFilePaths = globSync("src/css/*.css").map((p) => path.resolve(p));

  for (const i in cssFilePaths) {
    const p = cssFilePaths[i];

    try {
      const css = await fs.readFile(p, "utf-8");
      const ast = postcss.parse(css);
      ast.walkRules((decl) => {
        const prevDecl = decl.prev();
        let commentCode = "";
        if (prevDecl.type === "comment") {
          const preEndLine = prevDecl.source.end.line;
          const curStartLine = decl.source.start.line;
          if (curStartLine - preEndLine === 1) {
            commentCode = `${prevDecl.toString()}\n`;
          }
        }

        const fileName = decl.selector.slice(1);
        const cssSingleClass = `${decl.toString()}\n`;

        const cssCode = `${commentCode}${cssSingleClass}`;
        cssCodeList.push({
          code: cssCode,
          type: "css",
          name: fileName,
        });
      });
    } catch (error) {}

    return cssCodeList;
  }
}

exports.default = main;
