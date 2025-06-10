const fs = require("fs-extra");
const path = require("path");
const getCssCodeList = require("./getCssCodeList.js");

const filePath = path.resolve(process.cwd(), "src/extension.ts");
const packagePath = path.resolve(process.cwd(), "package.json");
const packageName = JSON.parse(fs.readFileSync(packagePath, "utf-8")).name;
const variableName = "codeList";

async function updateExtension(list) {
  const fileContent = await fs.readFile(filePath, "utf-8");

  // 在文件内容中找到要修改的变量
  const regex = new RegExp(`(const\\s+${variableName}.+?=\\s*)(.*?)(// codeList -- end)`, "s");
  const match = fileContent.match(regex);

  if (match[1]) {
    const modifiedContent = fileContent.replace(match[0], `${match[1]}${JSON.stringify(list, 0, 2)}\n${match[3]}`);

    // 写回文件
    await fs.writeFile(filePath, modifiedContent, "utf-8");
  } else {
    console.error(`${variableName} not found in the file.`);
  }
}
async function updatePackage(list) {
  const fileContent = await fs.readFile(packagePath, "utf-8");

  // 在文件内容中找到要修改的变量
  const regex = new RegExp(`("commands":)(\\s*?\\[.*?\\])`, "s");
  const match = fileContent.match(regex);

  const commandList = list.map((item) => {
    let title = `${item.type} (g) ${item.name} - ${item.intro ? item.intro : "生成代码片段"}`;
    return {
      command: `${packageName}.${item.type}.${item.name}`,
      title,
    };
  });

  commandList.unshift({
    command: "fe-integration.css.options",
    title: "css (g) Panel - 代码片段生成选择器",
  });
  commandList.unshift({
    command: "fe-integration.js.options",
    title: "js (g) Panel - 代码片段生成选择器",
  });
  commandList.unshift({
    command: "fe-integration.ts.options",
    title: "ts (g) Panel - 代码片段生成选择器",
  });

  if (match[1]) {
    const modifiedContent = fileContent.replace(match[0], `${match[1]}${JSON.stringify(commandList, 0, 2)}`);

    // 写回文件
    await fs.writeFile(packagePath, modifiedContent, "utf-8");
  } else {
    console.error(`${variableName} not found in the file.`);
  }
}

function deduplicateArray(arr) {
  let map = {};
  arr.forEach((item) => {
    if (map[item.name]) {
      let count = 1;
      while (map[`${item.name} - ${count}`]) {
        count++;
      }
      item.name = `${item.name} - ${count}`;
    }
    map[item.name] = true;
  });
  return arr;
}

(async function () {
  const getJsCodeList = (await import("./getJsCodeList.mjs")).default;
  const getTsCodeList = (await import("./getTsCodeList.mjs")).default;

  const cssSnippets = await getCssCodeList();
  const jsSnippets = deduplicateArray(await getJsCodeList());
  const tsSnippets = deduplicateArray(await getTsCodeList());

  updateExtension(cssSnippets.concat(jsSnippets, tsSnippets));
  updatePackage(cssSnippets.concat(jsSnippets, tsSnippets));
})();
