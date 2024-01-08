import path from "path";
import fs from "fs-extra";
import { parse } from "acorn";
import { simple } from "acorn-walk";
import { generate } from "escodegen";
import esbuild from "esbuild";
import { cloneDeep } from "lodash-es";
import axios from "axios";

const jsSourceCodeLinkList = [
  "https://cdn.jsdelivr.net/npm/@utilslib/core/lib/index.esm.js",
  "https://cdn.jsdelivr.net/npm/@utilslib/dom/lib/index.esm.js",
];

async function main() {
  let jsCodeList = [];
  for (const url of jsSourceCodeLinkList) {
    let exportList = [];

    console.log(`url: `, url);
    const { data: code } = await axios.get(url);
    const ast = parse(code, {
      // locations: true,
      ecmaVersion: "latest",
      sourceType: "module",
    });

    simple(ast, {
      ExportNamedDeclaration(n, ...args) {
        exportList = n.specifiers.map((n_1) => n_1.exported.name);
      },
    });

    for (const exportName of exportList) {
      const oldAst = cloneDeep(ast);
      simple(oldAst, {
        ExportNamedDeclaration(n, ...args) {
          n.specifiers = n.specifiers.filter(
            (n_1) => exportName === n_1.exported.name
          );
        },
      });
      const code = generate(oldAst);

      const newCode = await esbuild.transform(code, {
        treeShaking: true,
      });

      const latestAst = parse(newCode.code, {
        ecmaVersion: "latest",
        sourceType: "module",
      });

      latestAst.body.pop();

      const latestCode = generate(latestAst, {
        format: {
          indent: {
            style: "  ",
          },
        },
      });

      jsCodeList.push({
        code: latestCode,
        type: "js",
        name: exportName,
      });
    }
  }

  return jsCodeList;
}

// main();
export default main;
