import * as vscode from "vscode";

interface CodeInfoProps {
  type: "css" | "js";
  code: string;
  name: string;
}

const codeList: CodeInfoProps[] = [
  {
    "code": ".fs-8 {\n  font-size: 12px;\n  zoom: 0.6666;\n}\n",
    "type": "css",
    "name": "fs-8"
  },
  {
    "code": ".fs-10 {\n  font-size: 12px;\n  zoom: 0.8333;\n}\n",
    "type": "css",
    "name": "fs-10"
  },
  {
    "code": "/* 单行文本溢出隐藏 */\n.overflow-ellipsis {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n",
    "type": "css",
    "name": "overflow-ellipsis"
  },
  {
    "code": "/* 多行文本溢出隐藏 */\n.multi-line-overflow-ellipsis {\n  display: -webkit-box;\n  -webkit-line-clamp: 2; /* 设置显示行数 */\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n",
    "type": "css",
    "name": "multi-line-overflow-ellipsis"
  }
];

export function activate(context: vscode.ExtensionContext) {
  const generateCodeCommandList = codeList.map((d) => {
    const { type, code, name } = d;
    return vscode.commands.registerCommand(
      `fe-integration.${type}.${name}`,
      () => {
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
      }
    );
  });
  context.subscriptions.push(...generateCodeCommandList);
}

// This method is called when your extension is deactivated
export function deactivate() {}

