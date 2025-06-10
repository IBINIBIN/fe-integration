import * as vscode from "vscode";

interface CodeInfoProps {
  type: "css" | "js" | "ts";
  code: string;
  name: string;
  intro?: string;
}

export async function activate(context: vscode.ExtensionContext) {
  const generateCodeCommandList = codeList.map((d) => {
    const { type, code, name } = d;
    return vscode.commands.registerCommand(`fe-integration.${type}.${name}`, () => {
      // 获取当前活动编辑器
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        // 获取当前光标位置
        const position = editor.selection.active;
        // 插入代码
        editor.edit((editBuilder) => {
          editBuilder.insert(position, code);
        });
      }
    });
  });
  context.subscriptions.push(...generateCodeCommandList);

  const optionsCommand = ["css", "js", "ts"].map((type) =>
    vscode.commands.registerCommand(`fe-integration.${type}.options`, async () => {
      const options = codeList
        .filter((item) => item.type === type)
        .map((item) => `${item.name}${item.intro ? " - " + item.intro : ""}`);

      const selectedOption = await vscode.window.showQuickPick(options, {
        title: "生成代码",
        placeHolder: "搜索你想生成的代码",
      });

      if (selectedOption) {
        vscode.commands.executeCommand(`fe-integration.${type}.${selectedOption.split(" - ")[0]}`);
      }
    })
  );

  context.subscriptions.push(...optionsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}

const codeList: CodeInfoProps[] = [];
// codeList -- end
