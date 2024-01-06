const fs = require("fs-extra");
const path = require("path");
const getCssCodeList = require("./getCssCodeList.js").default;

const filePath = path.resolve(process.cwd(), "src/extension.ts");
const packagePath = path.resolve(process.cwd(), "package.json");
const packageName = JSON.parse(fs.readFileSync(packagePath,'utf-8')).name;
const variableName = "codeList";

async function updateExtension(list) {
  // 读取 TypeScript 文件
  const fileContent = await fs.readFile(filePath, "utf-8");

  // 在文件内容中找到要修改的变量
  const regex = new RegExp(
    `(const\\s+${variableName}.+?=\\s*)(\\[.*?\\])`,
    "s"
  );
  const match = fileContent.match(regex);

  if (match[1]) {
    const modifiedContent = fileContent.replace(
      match[0],
      `${match[1]}${JSON.stringify(list, 0, 2)}`
    );

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
    let title = `${item.type} 生成代码 ${item.name} `;
    return {
      command: `${packageName}.${item.type}.${item.name}`,
      title,
    };
  });

  if (match[1]) {
    const modifiedContent = fileContent.replace(
      match[0],
      `${match[1]}${JSON.stringify(commandList, 0, 6)}`
    );

    // 写回文件
    await fs.writeFile(packagePath, modifiedContent, "utf-8");
  } else {
    console.error(`${variableName} not found in the file.`);
  }
}

async function main() {
  const list = await getCssCodeList();

  updateExtension(list);
  updatePackage(list);
}

main();
