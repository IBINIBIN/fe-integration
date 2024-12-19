import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import path from "node:path";
import { parse } from "acorn";
import { simple } from "acorn-walk";
import { rollup } from "rollup";
import axios from "axios";
import virtual from "@rollup/plugin-virtual";
import { Project, printNode, SyntaxKind } from "ts-morph";

const ROOT_PATH = fileURLToPath(new URL("../", import.meta.url));

let jsSourceCodeLinkList = [
  "https://unpkg.com/@utilslib/core/lib/index.esm.js",
  "https://unpkg.com/@utilslib/dom/lib/index.esm.js",
  "https://unpkg.com/@utilslib/vue2/lib/index.esm.js",
  "https://unpkg.com/@utilslib/vue3/lib/index.esm.js",
];

const isDEV = process.env.NODE_ENV === "dev";

if (isDEV) {
  jsSourceCodeLinkList = [
    // 这里设置本地包链接
    path.join(ROOT_PATH, "../utilslib/packages/core/lib/index.esm.js"),
    path.join(ROOT_PATH, "../utilslib/packages/dom/lib/index.esm.js"),
    path.join(ROOT_PATH, "../utilslib/packages/vue2/lib/index.esm.js"),
    path.join(ROOT_PATH, "../utilslib/packages/vue3/lib/index.esm.js"),
  ];
}

function getClearExportDescHandle(code, exportName) {
  const project = new Project({
    compilerOptions: {
      target: "ESNext",
    },
  });

  const sourceFile = project.createSourceFile("这里随便输入.ts", code);
  sourceFile.compilerNode.statements.pop();

  return printNode(sourceFile.compilerNode);
}

const introMap = {};

/**
 * 去除其他export方法的注释
 * export只保留exportName
 * @param {String} code
 * @param {String} exportName
 * @returns String
 */
function astHandle(code, exportName) {
  const project = new Project();
  const sourceFile = project.createSourceFile("这里随便输入.ts", code);

  /*======================================  仅保留需要导出方法的注释 -- start  ======================================*/
  const curNode = sourceFile.getFunction(exportName) ?? sourceFile.getVariableStatement(exportName);
  const curJSDocs = curNode?.getJsDocs?.();
  const JSDoc = curJSDocs?.[0];
  const structure = JSDoc?.getStructure();
  // 保存注释头描述
  introMap[exportName] = JSDoc?.getComment();

  // 删除所有注释;
  for (const item of [
    ...sourceFile.getDescendantsOfKind(SyntaxKind.MultiLineCommentTrivia),
    ...sourceFile.getDescendantsOfKind(SyntaxKind.JSDoc),
  ]) {
    item.remove();
  }

  if (structure) {
    // 如果有JSDoc信息，返回给原方法
    sourceFile.getFunction(exportName)?.addJsDoc(structure);
    sourceFile.getVariableStatement(exportName)?.addJsDoc(structure);
  }
  /*---------------------------------------  仅保留需要导出方法的注释 -- end  ---------------------------------------*/

  // 删除其他export
  const ns = sourceFile.getDescendantsOfKind(SyntaxKind.ExportDeclaration);
  for (const node of ns) {
    node.compilerNode.exportClause.elements = node.compilerNode.exportClause.elements.filter(
      (n) => n.name.escapedText === exportName
    );
  }

  return printNode(sourceFile.compilerNode);
}

/** 除屑优化 */
async function getTreeShakingCode(code) {
  const bundle = await rollup({
    input: "virtual-input.js",
    treeshake: {
      moduleSideEffects: false,
    },
    external: [/.*/],
    plugins: [
      virtual({ "virtual-input.js": code }), // 使用虚拟文件插件
    ],
  });

  const { output } = await bundle.generate({
    format: "es",
  });

  return output[0].code;
}

/** 获取export列表 */
async function getExportList(code) {
  let exportList = [];
  const ast = parse(code, {
    ecmaVersion: "latest",
    sourceType: "module",
  });

  simple(ast, {
    ExportNamedDeclaration(n, ...args) {
      exportList = n.specifiers.map((n_1) => n_1.exported.name);
    },
  });

  return exportList;
}

async function getSourceCode(url) {
  let code;
  if (isDEV) {
    code = await fs.readFile(url, "utf-8");
  } else {
    let { data } = await axios.get(url);
    code = data;
  }

  return code;
}

async function main() {
  let jsCodeList = [];
  for (const url of jsSourceCodeLinkList) {
    console.log(`url: `, url);
    const code = await getSourceCode(url);

    // 获取所有export变量
    let exportList = await getExportList(code);
    for (const exportName of exportList) {
      console.log(`exportName: `, exportName);
      let latestCode = code;
      latestCode = await astHandle(latestCode, exportName);
      latestCode = await getTreeShakingCode(latestCode);
      latestCode = await getClearExportDescHandle(latestCode);
      jsCodeList.push({
        code: latestCode,
        type: "js",
        name: exportName,
        intro: introMap[exportName],
      });
    }
  }

  return jsCodeList;
}

export default main;
