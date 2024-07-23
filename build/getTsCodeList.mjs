import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import path from "node:path";
import axios from "axios";

const ROOT_PATH = fileURLToPath(new URL("../", import.meta.url));

let sourceCodeLinkList = [
  "https://unpkg.com/@utilslib/core/lib/tsSnippets.json",
  "https://unpkg.com/@utilslib/dom/lib/tsSnippets.json",
  "https://unpkg.com/@utilslib/vue2/lib/tsSnippets.json",
  "https://unpkg.com/@utilslib/vue3/lib/tsSnippets.json",
];

const isDEV = process.env.NODE_ENV === "dev";

if (isDEV) {
  sourceCodeLinkList = [
    // 这里设置本地包链接
    path.join(ROOT_PATH, "../utilslib/packages/core/lib/tsSnippets.json"),
    path.join(ROOT_PATH, "../utilslib/packages/dom/lib/tsSnippets.json"),
    path.join(ROOT_PATH, "../utilslib/packages/vue2/lib/tsSnippets.json"),
    path.join(ROOT_PATH, "../utilslib/packages/vue3/lib/tsSnippets.json"),
  ];
}

async function getSourceCode(url) {
  let code;
  if (isDEV) {
    code = JSON.parse(await fs.readFile(url, "utf-8"));
  } else {
    let { data } = await axios.get(url);
    code = data;
  }

  return code;
}

async function main() {
  let tsCodeList = [];
  for (const url of sourceCodeLinkList) {
    console.log(`url: `, url);
    const snippets = await getSourceCode(url);
    tsCodeList.push(...snippets);
  }

  return tsCodeList;
}

export default main;
