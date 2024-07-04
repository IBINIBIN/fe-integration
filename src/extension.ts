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

const codeList: CodeInfoProps[] = [
  {
    code: "\n.fs-8 {\n  font-size: 12px;\n  zoom: 0.6666;\n}\n",
    type: "css",
    name: "fs-8",
    intro: "",
  },
  {
    code: "\n.fs-10 {\n  font-size: 12px;\n  zoom: 0.8333;\n}\n",
    type: "css",
    name: "fs-10",
    intro: "",
  },
  {
    code: "/* 单行文本溢出隐藏 */\n.overflow-ellipsis {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n",
    type: "css",
    name: "overflow-ellipsis",
    intro: "单行文本溢出隐藏",
  },
  {
    code: "/* 多行文本溢出隐藏 */\n.multi-line-overflow-ellipsis {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  /* 设置显示行数 */\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n",
    type: "css",
    name: "multi-line-overflow-ellipsis",
    intro: "多行文本溢出隐藏",
  },
  {
    code: "const NOOP = () => { };\n",
    type: "js",
    name: "NOOP",
  },
  {
    code: "const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;\n",
    type: "js",
    name: "ONE_DAY_IN_MS",
  },
  {
    code: "const ONE_DAY_IN_S = 24 * 60 * 60;\n",
    type: "js",
    name: "ONE_DAY_IN_S",
  },
  {
    code: "const ONE_HOUR_IN_MS = 60 * 60 * 1000;\n",
    type: "js",
    name: "ONE_HOUR_IN_MS",
  },
  {
    code: "const ONE_HOUR_IN_S = 60 * 60;\n",
    type: "js",
    name: "ONE_HOUR_IN_S",
  },
  {
    code: "const ONE_MINUTE_IN_MS = 60 * 1000;\n",
    type: "js",
    name: "ONE_MINUTE_IN_MS",
  },
  {
    code: "const ONE_MINUTE_IN_S = 60;\n",
    type: "js",
    name: "ONE_MINUTE_IN_S",
  },
  {
    code: "const ONE_SECOND_IN_MS = 1000;\n",
    type: "js",
    name: "ONE_SECOND_IN_MS",
  },
  {
    code: "const ONE_SECOND_IN_S = 1;\n",
    type: "js",
    name: "ONE_SECOND_IN_S",
  },
  {
    code: "/**\n * 将小驼峰命名转换为蛇形变量名称。\n *\n * @param {string} camelCase - 要转换的小驼峰命名字符串。\n * @returns {string} 转换后的蛇形变量名称。\n * @example\n * ```js\n * camelToSnake('fooBar') // => 'foo_bar'\n * camelToSnake('fooBarBaz') // => 'foo_bar_baz'\n * camelToSnake('foo') // => 'foo'\n * ```\n */\nfunction camelToSnake(camelCase) {\n    return camelCase.replace(/[A-Z]/g, function (match) {\n        return `_${match.toLowerCase()}`;\n    });\n}\n",
    type: "js",
    name: "camelToSnake",
    intro: "将小驼峰命名转换为蛇形变量名称。",
  },
  {
    code: 'function isString(value) {\n    return typeof value === "string";\n}\nfunction isEmptyString(value) {\n    return isString(value) && value.length === 0;\n}\n/**\n * 将单词的首字母转为大写并返回，如果无法转为大写则返回原单词。\n *\n * @type {<T>(word: T) => T}\n * @param {T} word - 要处理的单词。\n * @returns {T} 首字母大写后的单词，如果无法转为大写或参数未提供则返回原单词。\n */\nfunction capitalize(word) {\n    if (isString(word) && !isEmptyString(word)) {\n        const firstChar = word.charAt(0).toUpperCase();\n        return (firstChar + word.slice(1));\n    }\n    return word;\n}\n',
    type: "js",
    name: "capitalize",
    intro: "将单词的首字母转为大写并返回，如果无法转为大写则返回原单词。",
  },
  {
    code: "/**\n * 通用错误捕获函数，用于执行可能会抛出异常的函数，并捕获异常信息。\n *\n * @type {<F extends (...args: any) => any, R = UnpackPromise<ReturnType<F>>>(\n *   this: unknown,\n *   fn: F\n * ) => Promise<[0, R, null] | [1, null, unknown]>}\n * @param {F} fn - 可能会抛出异常的函数。\n * @returns {Promise<[0, R, null] | [1, null, unknown]>} 返回一个元组，包含错误标识、函数执行结果或 null 、异常信息或 null。\n */\nasync function catchError(fn) {\n    let data;\n    let err;\n    let errMsg;\n    try {\n        data = await fn.apply(this, [...arguments]);\n        err = 0;\n        errMsg = null;\n        return [err, data, errMsg];\n    }\n    catch (error) {\n        data = null;\n        err = 1;\n        errMsg = error;\n        return [err, data, errMsg];\n    }\n}\n",
    type: "js",
    name: "catchError",
    intro: "通用错误捕获函数，用于执行可能会抛出异常的函数，并捕获异常信息。",
  },
  {
    code: "/**\n * 确保给定数字在指定范围内。\n *\n * @param {number} numberToClamp - 要限制的数字。\n * @param {[number, number]} range - 范围，表示为 [min, max] 数组。\n * @returns {number} 在指定范围内的值。\n */\nfunction clampNumberWithinRange(numberToClamp, range) {\n    const [min, max] = range;\n    return Math.max(min, Math.min(numberToClamp, max));\n}\n",
    type: "js",
    name: "clampNumberWithinRange",
    intro: "确保给定数字在指定范围内。",
  },
  {
    code: '/**\n * 生成指定长度的随机字符串。\n *\n * @param {number} length - 随机字符串的长度。默认值为 8。\n * @returns {string} 生成的随机字符串。\n * @example\n * ```ts\n * createRandomString(8) // => "aBcDeFgH"\n */\nfunction createRandomString(length = 8) {\n    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";\n    let randomString = "";\n    for (let i = 0; i < length; i++) {\n        const randomIndex = Math.floor(Math.random() * characters.length);\n        randomString += characters[randomIndex];\n    }\n    return randomString;\n}\n',
    type: "js",
    name: "createRandomString",
    intro: "生成指定长度的随机字符串。",
  },
  {
    code: "/**\n * 根据指定属性值进行过滤列表。\n *\n * @template T - 列表中元素的类型。\n * @template R - 属性的键名。\n * @template U - 当T为对象类型时，U为R的类型；否则为undefined。\n * @param {T[]} list - 要过滤的列表。\n * @param {T extends OnlyObject\n *   ? {\n *       property: R;\n *       includes?: unknown[];\n *       excludes?: unknown[];\n *     }\n *   : Partial<{\n *       property: undefined;\n *       includes: unknown[];\n *       excludes: unknown[];\n *     }>} opts - 过滤选项，包括要过滤的属性名、包含的值数组和排除的值数组。\n * @returns {T[]} 过滤后的列表。\n * @type {<\n *   T,\n *   R extends keyof T,\n *   U = T extends OnlyObject ? R : undefined\n * >(\n *   list: T[],\n *   opts: T extends OnlyObject\n *     ? {\n *         property: R;\n *         includes?: unknown[];\n *         excludes?: unknown[];\n *       }\n *     : Partial<{\n *         property: undefined;\n *         includes: unknown[];\n *         excludes: unknown[];\n *       }>\n * ) => T[]}\n */\nfunction filterList(list, opts) {\n    const { property, includes = [], excludes = [] } = opts;\n    return list.filter((item) => {\n        const val = property ? item[property] : item;\n        if (includes?.length && excludes?.length) {\n            return includes.includes(val) && !excludes.includes(val);\n        }\n        else if (includes?.length) {\n            return includes.includes(val);\n        }\n        else if (excludes?.length) {\n            return !excludes.includes(val);\n        }\n        return true;\n    });\n}\n",
    type: "js",
    name: "filterList",
    intro: "根据指定属性值进行过滤列表。",
  },
  {
    code: "function findNode({ arr, compareAttr, nextLevelAttr, value, layerNodeList = [], layerIndexList = [], }) {\n    for (let i = 0; i < arr.length; i++) {\n        const data = arr[i];\n        if (data[compareAttr] === value) {\n            const [parent] = layerNodeList.slice(-1);\n            return {\n                target: data,\n                layerIndexList: [...layerIndexList, i],\n                layerNodeList: [...layerNodeList, data],\n                parent\n            };\n        }\n        const nextLevelList = data[nextLevelAttr];\n        if (Array.isArray(nextLevelList) && nextLevelList.length) {\n            const result = findNode({\n                arr: nextLevelList,\n                compareAttr,\n                nextLevelAttr,\n                value,\n                layerNodeList: [...layerNodeList, data],\n                layerIndexList: [...layerIndexList, i]\n            });\n            if (result) {\n                return result;\n            }\n        }\n    }\n    return undefined;\n}\n/**\n * 使用深度优先搜索算法递归查找指定属性值的节点，并返回匹配节点的数据、父级数据列表和层级关系。\n *\n * @type {<T extends Record<string, any>>(arr: T[], compareAttr: string, nextLevelAttr: string, value: unknown) => TargetData<T> | undefined}\n * @param {T[]} arr - 要进行搜索的数组。\n * @param {string} compareAttr - 需要查找的属性名。\n * @param {string} nextLevelAttr - 子级循环字段\n * @param {unknown} value - 需要查找的属性值。\n * @returns {TargetData<T> | undefined} 匹配节点的数据、父级数据列表和层级关系。\n */\nfunction findNodeByDFS(arr, compareAttr, nextLevelAttr, value) {\n    return findNode({ arr, compareAttr, nextLevelAttr, value });\n}\n",
    type: "js",
    name: "findNodeByDFS",
    intro:
      "使用深度优先搜索算法递归查找指定属性值的节点，并返回匹配节点的数据、父级数据列表和层级关系。",
  },
  {
    code: "/**\n * 打平嵌套的树形结构数组，并为每个节点添加 level 和 parentId 字段。\n *\n * @type {<\n *   T extends { level?: never; parentId?: never; [key: string]: any; },\n *   P extends keyof T,\n *   ID extends keyof T,\n *   R = T & { level: number; parentId: T[ID] }\n * >(\n *   arr: T[],\n *   childrenProperty: P,\n *   idAttr: ID,\n *   includeParent?: boolean\n * ) => R[]}\n * @param {T[]} arr - 嵌套的树形结构数组。\n * @param {P} childrenProperty - 子节点属性的键名。\n * @param {ID} idAttr - 节点 ID 属性的键名。\n * @param {boolean} [includeParent=true] - 是否包含父节点，默认为 true。\n * @returns {R[]} 打平后的数组。\n */\nfunction flattenTreeArray(arr, childrenProperty, idAttr, includeParent = true) {\n    function flattenRecursive(nodes, level, parentId) {\n        return nodes.reduce((prev, node) => {\n            const children = node[childrenProperty];\n            const id = node[idAttr];\n            const flattenedNode = Object.assign(node, { level, parentId });\n            let childrenArray = [flattenedNode];\n            if (Array.isArray(children)) {\n                childrenArray = flattenRecursive(children, level + 1, id).concat(includeParent ? flattenedNode : []);\n            }\n            return prev.concat(childrenArray);\n        }, []);\n    }\n    return flattenRecursive(arr, 0, undefined);\n}\n",
    type: "js",
    name: "flattenTreeArray",
    intro: "打平嵌套的树形结构数组，并为每个节点添加 level 和 parentId 字段。",
  },
  {
    code: '/**\n * 格式化数字，如果超过指定值则显示为指定值+。\n *\n * @param {string | number} value - 要格式化的数字。\n * @param {number} threshold - 阈值，超过该值则显示为该值+。默认值为 99。\n * @returns {string} 格式化后的字符串。\n */\nfunction formatNumber(value, threshold = 99) {\n    const num = Number(value);\n    if (isNaN(num)) {\n        return "";\n    }\n    if (num > threshold) {\n        return `${threshold}+`;\n    }\n    return String(num);\n}\n',
    type: "js",
    name: "formatNumber",
    intro: "格式化数字，如果超过指定值则显示为指定值+。",
  },
  {
    code: '/**\n * 格式化价格，添加千位分隔符并保留指定的小数位数。\n *\n * @param {string | number} value - 要格式化的价格。\n * @param {number} decimalPlaces - 可选的小数位数，默认为不处理小数位数。\n * @returns {string} 格式化后的价格。\n */\nfunction formatPrice(value, decimalPlaces = -1) {\n    const numberValue = typeof value === "number" ? value : parseFloat(value);\n    if (isNaN(numberValue)) {\n        return value.toString();\n    }\n    const options = {\n        minimumFractionDigits: decimalPlaces >= 0 ? decimalPlaces : 0,\n        maximumFractionDigits: decimalPlaces >= 0 ? decimalPlaces : 2\n    };\n    return numberValue.toLocaleString(undefined, options);\n}\n',
    type: "js",
    name: "formatPrice",
    intro: "格式化价格，添加千位分隔符并保留指定的小数位数。",
  },
  {
    code: "/**\n * 获取两个数组的交集，通过指定字段属性进行判断。\n *\n * @type  {<T, K extends keyof T>(arr1: T[], arr2: T[], key: K) => T[]}\n * @param {T[]} arr1 - 第一个数组。「主数组,当返回的内容从主数组中获取」\n * @param {T[]} arr2 - 第二个数组。\n * @param {K extends keyof T} [key] - 可选的字段属性，用于判断交集。\n * @returns {T[]} 交集的数组。\n */\nfunction getArrayIntersection(arr1, arr2, key) {\n    if (key) {\n        const set = new Set(arr2.map((item) => item[key]));\n        return arr1.filter((item) => set.has(item[key]));\n    }\n    return arr1.filter((item) => arr2.includes(item));\n}\n",
    type: "js",
    name: "getArrayIntersection",
    intro: "获取两个数组的交集，通过指定字段属性进行判断。",
  },
  {
    code: "/**\n * 从文件路径中提取文件名。\n *\n * @param {string} path - 包含文件名的路径。\n * @returns {string} 提取出的文件名。\n */\nfunction getBasename(path) {\n    const match = path.match(/\\/([^\\/]+)$/);\n    return match ? match[1] : path;\n}\n",
    type: "js",
    name: "getBasename",
    intro: "从文件路径中提取文件名。",
  },
  {
    code: '/**\n * 获取文件名的后缀。\n *\n * @param {string} filename - 文件名。\n * @returns {string | ""} 文件名的后缀。\n */\nconst getFileExtension = (filename) => {\n    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);\n};\n',
    type: "js",
    name: "getFileExtension",
    intro: "获取文件名的后缀。",
  },
  {
    code: 'function getBasename(path) {\n    const match = path.match(/\\/([^\\/]+)$/);\n    return match ? match[1] : path;\n}\n/**\n * 获取文件名（不包含扩展名）。\n *\n * @param {string} fileName - 文件名。\n * @returns {string | ""} 提取的文件名。\n */\nfunction getFileName(fileName) {\n    const name = getBasename(fileName);\n    const lastDotIndex = name.lastIndexOf(".");\n    if (lastDotIndex === -1) {\n        return name;\n    }\n    return name.slice(0, lastDotIndex);\n}\n',
    type: "js",
    name: "getFileName",
    intro: "获取文件名（不包含扩展名）。",
  },
  {
    code: "/**\n * 检查一个值是否为 Array 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is any[]} 如果值为 Array 类型，则返回 true，否则返回 false。\n */\nfunction isArray(value) {\n    return Array.isArray(value);\n}\n",
    type: "js",
    name: "isArray",
    intro: "检查一个值是否为 Array 类型。",
  },
  {
    code: '/**\n * 检查一个值是否为 BigInt 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is BigInt} 如果值为 BigInt 类型，则返回 true，否则返回 false。\n */\nfunction isBigInt(value) {\n    return typeof value === "bigint";\n}\n',
    type: "js",
    name: "isBigInt",
    intro: "检查一个值是否为 BigInt 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Blob 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is Blob} 如果值为 Blob 类型，则返回 true，否则返回 false。\n */\nfunction isBlob(value) {\n    return getType(value) === "Blob";\n}\n',
    type: "js",
    name: "isBlob",
    intro: "检查一个值是否为 Blob 类型。",
  },
  {
    code: '/**\n * 检查一个值是否为 boolean 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is boolean} 如果值为 boolean 类型，则返回 true，否则返回 false。\n */\nfunction isBoolean(value) {\n    return typeof value === "boolean";\n}\n',
    type: "js",
    name: "isBoolean",
    intro: "检查一个值是否为 boolean 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Date 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is Date} 如果值为 Date 类型，则返回 true，否则返回 false。\n */\nfunction isDate(value) {\n    return getType(value) === "Date";\n}\n',
    type: "js",
    name: "isDate",
    intro: "检查一个值是否为 Date 类型。",
  },
  {
    code: '/**\n * 检查一个值是否为非undefined。\n * 注: 非「undefined」类型\n *\n * @param {T | undefined} value - 要检查的值。\n * @returns {value is T} 如果值不为 Undefined 类型，则返回 true，否则返回 false。\n */\nfunction isDef(value) {\n    return typeof value !== "undefined";\n}\n',
    type: "js",
    name: "isDef",
    intro: "检查一个值是否为非undefined。\n注: 非「undefined」类型",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isUndefined(value) {\n    return typeof value === "undefined";\n}\nfunction isNull(value) {\n    return getType(value) === "Null";\n}\nfunction isString(value) {\n    return typeof value === "string";\n}\nfunction isObject(value) {\n    return getType(value) === "Object";\n}\nfunction isEmptyString(value) {\n    return isString(value) && value.length === 0;\n}\nfunction isEmptyObject(value) {\n    return isObject(value) && !isNull(value) && Object.keys(value).length === 0;\n}\nfunction isEmptyArray(value) {\n    return Array.isArray(value) && value.length === 0;\n}\n/**\n * 检查一个值是否为空。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is undefined | null | [] | ""} 如果值为空，则返回 true，否则返回 false。\n */\nfunction isEmpty(value) {\n    return (isUndefined(value) ||\n        isNull(value) ||\n        isEmptyArray(value) ||\n        isEmptyObject(value) ||\n        isEmptyString(value));\n}\n',
    type: "js",
    name: "isEmpty",
    intro: "检查一个值是否为空。",
  },
  {
    code: "/**\n * 检查一个值是否为空数组。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is any[]} 如果值为空数组，则返回 true，否则返回 false。\n */\nfunction isEmptyArray(value) {\n    return Array.isArray(value) && value.length === 0;\n}\n",
    type: "js",
    name: "isEmptyArray",
    intro: "检查一个值是否为空数组。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isNull(value) {\n    return getType(value) === "Null";\n}\nfunction isObject(value) {\n    return getType(value) === "Object";\n}\n/**\n * 检查一个值是否为空对象。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is object} 如果值为空对象，则返回 true，否则返回 false。\n */\nfunction isEmptyObject(value) {\n    return isObject(value) && !isNull(value) && Object.keys(value).length === 0;\n}\n',
    type: "js",
    name: "isEmptyObject",
    intro: "检查一个值是否为空对象。",
  },
  {
    code: 'function isString(value) {\n    return typeof value === "string";\n}\n/**\n * 检查一个值是否为空字符串。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is ""} 如果值为空字符串，则返回 true，否则返回 false。\n */\nfunction isEmptyString(value) {\n    return isString(value) && value.length === 0;\n}\n',
    type: "js",
    name: "isEmptyString",
    intro: "检查一个值是否为空字符串。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Error 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is Error} 如果值为 Error 类型，则返回 true，否则返回 false。\n */\nfunction isError(value) {\n    return getType(value) === "Error";\n}\n',
    type: "js",
    name: "isError",
    intro: "检查一个值是否为 Error 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Function 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is Function} 如果值为 Function 类型，则返回 true，否则返回 false。\n */\nfunction isFunction(value) {\n    return getType(value) === "Function";\n}\n',
    type: "js",
    name: "isFunction",
    intro: "检查一个值是否为 Function 类型。",
  },
  {
    code: "/**\n * 检查一个值是否为非空数组。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is any[]} 如果值为非空数组，则返回 true，否则返回 false。\n */\nfunction isHasArray(value) {\n    return Array.isArray(value) && value.length > 0;\n}\n",
    type: "js",
    name: "isHasArray",
    intro: "检查一个值是否为非空数组。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isObject(value) {\n    return getType(value) === "Object";\n}\n/**\n * 检查一个值是否为非空对象。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is object} 如果值有最少一个可枚举属性，则返回 true，否则返回 false。\n */\nfunction isHasObject(value) {\n    return isObject(value) && Object.keys(value).length > 0;\n}\n',
    type: "js",
    name: "isHasObject",
    intro: "检查一个值是否为非空对象。",
  },
  {
    code: 'function isString(value) {\n    return typeof value === "string";\n}\n/**\n * 检查一个值是否为非空字符串。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is string} 如果值为非空字符串，则返回 true，否则返回 false。\n */\nfunction isHasString(value) {\n    return isString(value) && value.length > 0;\n}\n',
    type: "js",
    name: "isHasString",
    intro: "检查一个值是否为非空字符串。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Map 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is Map<any, any>} 如果值为 Map 类型，则返回 true，否则返回 false。\n */\nfunction isMap(value) {\n    return getType(value) === "Map";\n}\n',
    type: "js",
    name: "isMap",
    intro: "检查一个值是否为 Map 类型。",
  },
  {
    code: "// #endregion -- end\n// #region ====================== is公共方法 ======================\nfunction isNullOrUndefined(value) {\n    return value === undefined || value === null;\n}\n/**\n * 检查一个值是否为 `undefined` 或 `null`。\n *\n * @param {T} value - 要检查的值。\n * @returns {value is NonNullable<T>} 如果值为 `undefined` 或 `null`，则返回 `true`，否则返回 `false`。\n */\nfunction isNonNullable(value) {\n    return !isNullOrUndefined(value);\n}\n",
    type: "js",
    name: "isNonNullable",
    intro: "检查一个值是否为 `undefined` 或 `null`。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Null 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is null} 如果值为 Null 类型，则返回 true，否则返回 false。\n */\nfunction isNull(value) {\n    return getType(value) === "Null";\n}\n',
    type: "js",
    name: "isNull",
    intro: "检查一个值是否为 Null 类型。",
  },
  {
    code: "// #endregion -- end\n// #region ====================== is公共方法 ======================\n/**\n * 检查一个值是否为 `undefined` 或 `null`。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is undefined | null} 如果值为 `undefined` 或 `null`，则返回 `true`，否则返回 `false`。\n */\nfunction isNullOrUndefined(value) {\n    return value === undefined || value === null;\n}\n",
    type: "js",
    name: "isNullOrUndefined",
    intro: "检查一个值是否为 `undefined` 或 `null`。",
  },
  {
    code: '/**\n * 检查一个值是否为 Number 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is number} 如果值为 Number 类型，则返回 true，否则返回 false。\n */\nfunction isNumber(value) {\n    return typeof value === "number";\n}\n',
    type: "js",
    name: "isNumber",
    intro: "检查一个值是否为 Number 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Object 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is object} 如果值为 Object 类型，则返回 true，否则返回 false。\n */\nfunction isObject(value) {\n    return getType(value) === "Object";\n}\n',
    type: "js",
    name: "isObject",
    intro: "检查一个值是否为 Object 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Promise 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is Promise<any>} 如果值为 Promise 类型，则返回 true，否则返回 false。\n */\nfunction isPromise(value) {\n    return getType(value) === "Promise";\n}\n',
    type: "js",
    name: "isPromise",
    intro: "检查一个值是否为 Promise 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 RegExp 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is RegExp} 如果值为 RegExp 类型，则返回 true，否则返回 false。\n */\nfunction isRegExp(value) {\n    return getType(value) === "RegExp";\n}\n',
    type: "js",
    name: "isRegExp",
    intro: "检查一个值是否为 RegExp 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Set 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is Set<any>} 如果值为 Set 类型，则返回 true，否则返回 false。\n */\nfunction isSet(value) {\n    return getType(value) === "Set";\n}\n',
    type: "js",
    name: "isSet",
    intro: "检查一个值是否为 Set 类型。",
  },
  {
    code: '/**\n * 检查一个值是否为 String 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is string} 如果值为 String 类型，则返回 true，否则返回 false。\n */\nfunction isString(value) {\n    return typeof value === "string";\n}\n',
    type: "js",
    name: "isString",
    intro: "检查一个值是否为 String 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Symbol 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is symbol} 如果值为 Symbol 类型，则返回 true，否则返回 false。\n */\nfunction isSymbol(value) {\n    return getType(value) === "Symbol";\n}\n',
    type: "js",
    name: "isSymbol",
    intro: "检查一个值是否为 Symbol 类型。",
  },
  {
    code: "/**\n * 检查指定目标是否在选项中（选项可以是单个对象或对象数组）。\n *\n * @param {T} target - 目标项。\n * @param {(T | T[])[]} options - 选项，可以是单个对象或对象数组。\n * @returns {boolean} 若目标项在选项中，则返回 true；否则返回 false。\n */\nfunction isTargetInOptions(target, ...options) {\n    return options.some((option) => {\n        if (Array.isArray(option)) {\n            return option.some((item) => item === target);\n        }\n        return option === target;\n    });\n}\n",
    type: "js",
    name: "isTargetInOptions",
    intro: "检查指定目标是否在选项中（选项可以是单个对象或对象数组）。",
  },
  {
    code: '/**\n * 检查一个值是否为 Undefined 类型。\n *\n * @param {unknown} value - 要检查的值。\n * @returns {value is undefined} 如果值为 Undefined 类型，则返回 true，否则返回 false。\n */\nfunction isUndefined(value) {\n    return typeof value === "undefined";\n}\n',
    type: "js",
    name: "isUndefined",
    intro: "检查一个值是否为 Undefined 类型。",
  },
  {
    code: "/**\n * 检测给定的值(数字)是否在指定范围内。\n *\n * @param {number} value - 要检测的值。\n * @param {[number, number]} range - 范围，包含最小值和最大值。\n * @returns {boolean} 如果值在范围内，则返回 true，否则返回 false。\n */\nfunction isValueInRange(value, range) {\n    const [min, max] = range;\n    return value >= min && value <= max;\n}\n",
    type: "js",
    name: "isValueInRange",
    intro: "检测给定的值(数字)是否在指定范围内。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\n/**\n * 检查一个值是否为 Window 类型。\n *\n * @param {any} value - 要检查的值。\n * @returns {boolean} 如果值为 Window 类型，则返回 true，否则返回 false。\n */\nfunction isWindow(value) {\n    return typeof window !== "undefined" && getType(value) === "Window";\n}\n',
    type: "js",
    name: "isWindow",
    intro: "检查一个值是否为 Window 类型。",
  },
  {
    code: '/**\n * 将数字转换为中文数字。\n *\n * @param {string | number} value - 要转换的数字。\n * @returns {string} 转换后的中文数字。\n */\nfunction numberToChinese(value) {\n    const numberValue = typeof value === "number" ? value.toString() : value;\n    const chineseDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];\n    const chineseUnits = ["", "十", "百", "千", "万", "亿"];\n    const numArray = Array.from(numberValue).reverse();\n    const chineseArray = numArray.map((num, index) => {\n        const digit = parseInt(num);\n        const digitChinese = chineseDigits[digit];\n        if (digit === 0) {\n            // 如果当前数字为零，则不处理\n            return "";\n        }\n        const unit = index % 4;\n        const unitChinese = chineseUnits[unit];\n        const isUnitFirst = index === 0 || (index > 0 && digit !== 1 && unit === 0);\n        return isUnitFirst ? digitChinese + unitChinese : digitChinese;\n    });\n    return chineseArray.reverse().join("");\n}\n',
    type: "js",
    name: "numberToChinese",
    intro: "将数字转换为中文数字。",
  },
  {
    code: "// #endregion -- end\n/**\n * 从对象中排除指定的属性，返回一个新的对象。\n *\n * @type {<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>}\n * @param {T} obj - 要处理的对象。\n * @param {K[]} keys - 要排除的属性键名数组。\n * @returns {Omit<T, K>} 排除指定属性后的新对象。\n * @template T - 对象类型。\n * @template K - 要排除的属性键名类型。\n */\nfunction omit(obj, keys) {\n    const clone = { ...obj };\n    keys.forEach((key) => delete clone[key]);\n    return clone;\n}\n",
    type: "js",
    name: "omit",
    intro: "从对象中排除指定的属性，返回一个新的对象。",
  },
  {
    code: "/**\n * 确保传入的方法只能被执行一次\n *\n * @param {(...args: any) => any} func - 要执行的方法。\n * @returns {(...args: any) => any} 返回一个新的方法，该方法只会执行一次\n */\nfunction once(fn) {\n    // 利用闭包判断函数是否执行过\n    let called = false;\n    return function () {\n        if (!called) {\n            called = true;\n            return fn.apply(this, [...arguments]);\n        }\n    };\n}\n",
    type: "js",
    name: "once",
    intro: "确保传入的方法只能被执行一次",
  },
  {
    code: "/**\n * 从对象中选取指定的属性并返回新的对象。\n *\n * @type {<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>}\n * @param {T} obj - 要选取属性的对象。\n * @param {K[]} keys - 要选取的属性键名数组。\n * @returns {Pick<T, K>} 选取指定属性后的新对象。\n * @template T - 对象类型。\n * @template K - 要选取的属性键名类型。\n */\nfunction pick(obj, keys) {\n    const pickedObject = {};\n    keys.forEach((key) => {\n        if (obj.hasOwnProperty(key)) {\n            pickedObject[key] = obj[key];\n        }\n    });\n    return pickedObject;\n}\n",
    type: "js",
    name: "pick",
    intro: "从对象中选取指定的属性并返回新的对象。",
  },
  {
    code: "/**\n * 将蛇形变量名称转换为小驼峰命名。\n *\n * @param {string} snakeCase - 要转换的蛇形变量名称。\n * @returns {string} 转换后的小驼峰命名。\n */\nfunction snakeToCamel(snakeCase) {\n    return snakeCase.replace(/_([a-z])/g, function (_, char) {\n        return char.toUpperCase();\n    });\n}\n",
    type: "js",
    name: "snakeToCamel",
    intro: "将蛇形变量名称转换为小驼峰命名。",
  },
  {
    code: "/**\n * 将值或值数组转换为数组。\n *\n * @type {<T>(value: T | T[]) => T[]}\n * @param {T | T[]} value - 要转换的值或值数组。\n * @returns {T[]} 转换后的数组。\n * @example\n * const result = toArray(\"value\"); // ['value']\n * const resultArray = toArray([\"value1\", \"value2\"]); // ['value1', 'value2']\n */\nfunction toArray(value) {\n    let list;\n    if (Array.isArray(value)) {\n        list = value;\n    }\n    else {\n        list = [value];\n    }\n    return list;\n}\n",
    type: "js",
    name: "toArray",
    intro: "将值或值数组转换为数组。",
  },
  {
    code: 'function hasClass(el, cls) {\n    if (!el || !cls)\n        return false;\n    if (cls.indexOf(" ") !== -1)\n        throw new Error("className should not contain space.");\n    if (el.classList) {\n        return el.classList.contains(cls);\n    }\n    return ` ${el.className} `.indexOf(` ${cls} `) > -1;\n}\n/**\n * 向元素添加一个或多个类名。\n * @param {Element} el - 要添加类名的元素\n * @param {string} cls - 要添加的类名，可以是多个类名以空格分隔\n */\nfunction addClass(el, cls) {\n    if (!el)\n        return;\n    let curClass = el.className;\n    const classes = (cls || "").split(" ");\n    for (let i = 0, j = classes.length; i < j; i++) {\n        const clsName = classes[i];\n        if (!clsName)\n            continue;\n        if (el.classList) {\n            el.classList.add(clsName);\n        }\n        else if (!hasClass(el, clsName)) {\n            curClass += ` ${clsName}`;\n        }\n    }\n    if (!el.classList) {\n        el.className = curClass;\n    }\n}\n',
    type: "js",
    name: "addClass",
    intro: "向元素添加一个或多个类名。",
  },
  {
    code: '// #endregion -- end\nconst NOOP = () => { };\nconst isServer = typeof window === "undefined";\nfunction on(element, event, handler, options) {\n    if (element && event && handler) {\n        element.addEventListener(event, handler, options);\n        return () => {\n            element.removeEventListener(event, handler, options);\n        };\n    }\n    return NOOP;\n}\nconst off = (() => {\n    if (!isServer && Boolean(document.removeEventListener)) {\n        return (element, event, handler, options) => {\n            if (element && event) {\n                element.removeEventListener(event, handler, options);\n            }\n        };\n    }\n    return (element, event, handler) => {\n        if (element && event) {\n            element.detachEvent(`on${event}`, handler);\n        }\n    };\n})();\n/**\n * 创建一个用于管理事件监听器的工具函数\n * @param elm - 要添加事件监听器的元素引用\n * @returns 返回一个包含添加和清除事件监听器功能的对象\n */\nfunction attachListeners(elm) {\n    const offs = [];\n    return {\n        add(type, listener) {\n            if (!type)\n                return;\n            on(elm, type, listener);\n            offs.push(() => {\n                off(elm, type, listener);\n            });\n        },\n        clean() {\n            offs.forEach((handler) => handler?.());\n            offs.length = 0;\n        }\n    };\n}\n',
    type: "js",
    name: "attachListeners",
    intro: "创建一个用于管理事件监听器的工具函数",
  },
  {
    code: 'function toArray(value) {\n    let list;\n    if (Array.isArray(value)) {\n        list = value;\n    }\n    else {\n        list = [value];\n    }\n    return list;\n}\n// #endregion -- end\nconst NOOP = () => { };\nfunction on(element, event, handler, options) {\n    if (element && event && handler) {\n        element.addEventListener(event, handler, options);\n        return () => {\n            element.removeEventListener(event, handler, options);\n        };\n    }\n    return NOOP;\n}\nfunction containerDom(parent, child) {\n    if (parent && child) {\n        let pNode = child;\n        while (pNode) {\n            if (parent === pNode) {\n                return true;\n            }\n            pNode = pNode.parentNode;\n        }\n    }\n    return false;\n}\n/**\n * 监听点击事件，当点击元素在指定元素之外时执行回调函数。\n * @param {Element | Iterable<any> | ArrayLike<any>} els - 指定的元素或元素集合\n * @param {() => void} cb - 点击元素在指定元素之外时执行的回调函数\n * @returns {() => void} 一个函数，用于销毁监听事件。\n */\nfunction clickOut(els, cb) {\n    return on(document, "click", (event) => {\n        const _els = toArray(els);\n        const isFlag = _els.every((item) => !containerDom(item, event.target));\n        return isFlag && cb && cb();\n    });\n}\n',
    type: "js",
    name: "clickOut",
    intro: "监听点击事件，当点击元素在指定元素之外时执行回调函数。",
  },
  {
    code: 'function toArray(value) {\n    let list;\n    if (Array.isArray(value)) {\n        list = value;\n    }\n    else {\n        list = [value];\n    }\n    return list;\n}\n// #endregion -- end\nconst NOOP = () => { };\nfunction on(element, event, handler, options) {\n    if (element && event && handler) {\n        element.addEventListener(event, handler, options);\n        return () => {\n            element.removeEventListener(event, handler, options);\n        };\n    }\n    return NOOP;\n}\nfunction containerDom(parent, child) {\n    if (parent && child) {\n        let pNode = child;\n        while (pNode) {\n            if (parent === pNode) {\n                return true;\n            }\n            pNode = pNode.parentNode;\n        }\n    }\n    return false;\n}\nfunction clickOutInWebComponent({ els, cb, root, }) {\n    // let doc, root;\n    on(root, "click", (event) => {\n        const _els = toArray(els).filter(Boolean);\n        const protect = _els.some((item) => containerDom(item?.() ?? item, event.target));\n        return !protect && cb();\n    });\n    if (root !== document) {\n        on(document, "click", (e) => {\n            if (!(e.target instanceof HTMLElement))\n                return;\n            const clickRoot = e.target.shadowRoot;\n            if (clickRoot !== root) {\n                cb();\n            }\n        });\n    }\n    return () => { };\n}\n',
    type: "js",
    name: "clickOutInWebComponent",
  },
  {
    code: "/**\n * 检查父元素是否包含子元素。\n * @param {Node} parent - 父元素\n * @param {any} child - 子元素\n * @returns {boolean} 如果父元素包含子元素则返回true，否则返回false\n */\nfunction containerDom(parent, child) {\n    if (parent && child) {\n        let pNode = child;\n        while (pNode) {\n            if (parent === pNode) {\n                return true;\n            }\n            pNode = pNode.parentNode;\n        }\n    }\n    return false;\n}\n",
    type: "js",
    name: "containerDom",
    intro: "检查父元素是否包含子元素。",
  },
  {
    code: "import Clipboard from 'clipboard';\nfunction copyText(text) {\n    const div = document.createElement(\"div\");\n    const clip = new Clipboard(div, {\n        text() {\n            return text;\n        }\n    });\n    div.click();\n    clip.destroy();\n    div.remove();\n}\n",
    type: "js",
    name: "copyText",
  },
  {
    code: '/**\n * 下载文件。\n *\n * @param {Blob | string} src - 要下载的资源（可以是字符串或 Blob 对象）\n * @param {string} [fileName=""] - 要保存的文件名。\n */\nfunction downloadFile(src, fileName = "") {\n    let url;\n    if (typeof src === "string") {\n        url = src;\n    }\n    else {\n        url = URL.createObjectURL(src);\n    }\n    const downloadLink = document.createElement("a");\n    downloadLink.href = url;\n    downloadLink.download = fileName;\n    downloadLink.click();\n    downloadLink.remove();\n    URL.revokeObjectURL(url);\n}\n',
    type: "js",
    name: "downloadFile",
    intro: "下载文件。",
  },
  {
    code: 'function downloadFileByUrl(url, fileName = "") {\n    const downloadLink = document.createElement("a");\n    downloadLink.href = url;\n    downloadLink.download = fileName;\n    downloadLink.click();\n    downloadLink.remove();\n}\n/**\n * 下载一个 Blob 对象作为指定文件名的文件。\n *\n * @param {Blob} blob - 要下载的 Blob 对象。\n * @param {string} [fileName=""] - 要保存的文件名。\n */\nfunction downloadFileByBlob(blob, fileName = "") {\n    const url = URL.createObjectURL(blob);\n    downloadFileByUrl(url, fileName);\n    URL.revokeObjectURL(url);\n}\n',
    type: "js",
    name: "downloadFileByBlob",
    intro: "下载一个 Blob 对象作为指定文件名的文件。",
  },
  {
    code: '/**\n * 下载一个 Blob 对象作为指定文件名的文件。\n *\n * @param {string} url - 要下载的文件链接\n * @param {string} [fileName=""] - 要保存的文件名。\n */\nfunction downloadFileByUrl(url, fileName = "") {\n    const downloadLink = document.createElement("a");\n    downloadLink.href = url;\n    downloadLink.download = fileName;\n    downloadLink.click();\n    downloadLink.remove();\n}\n',
    type: "js",
    name: "downloadFileByUrl",
    intro: "下载一个 Blob 对象作为指定文件名的文件。",
  },
  {
    code: "/**\n * @export\n * @param {number} current 当前时间\n * @param {number} start 开始值\n * @param {number} end 结束值\n * @param {number} duration 持续时间\n * @returns\n */\nconst easeInOutCubic = (current, start, end, duration) => {\n    const change = (end - start) / 2;\n    let time = current / (duration / 2);\n    if (time < 1) {\n        return change * time * time * time + start;\n    }\n    time -= 2;\n    // eslint-disable-next-line no-return-assign\n    return change * (time * time * time + 2) + start;\n};\n",
    type: "js",
    name: "easeInOutCubic",
  },
  {
    code: "/**\n * 检查元素是否在视口内。\n * @see {@link http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport}\n * @param {HTMLElement} elm - 要检查的元素\n * @param {HTMLElement} [parent] - 可选的父级元素\n * @returns {boolean} 如果元素在视口内则返回true，否则返回false\n */\nfunction elementInViewport(elm, parent) {\n    const rect = elm.getBoundingClientRect();\n    if (parent) {\n        const parentRect = parent.getBoundingClientRect();\n        return (rect.top >= parentRect.top &&\n            rect.left >= parentRect.left &&\n            rect.bottom <= parentRect.bottom &&\n            rect.right <= parentRect.right);\n    }\n    return (rect.top >= 0 &&\n        rect.left >= 0 &&\n        rect.bottom + 80 <= window.innerHeight &&\n        rect.right <= window.innerWidth);\n}\n",
    type: "js",
    name: "elementInViewport",
    intro: "检查元素是否在视口内。",
  },
  {
    code: 'function getElement(node) {\n    const attachNode = node instanceof Function ? node() : node;\n    if (!attachNode) {\n        return undefined;\n    }\n    if (typeof attachNode === "string") {\n        return document.querySelector(attachNode);\n    }\n    if (attachNode instanceof Element) {\n        return attachNode;\n    }\n    return undefined;\n}\n/**\n * 获取要附加到的节点元素。\n * @param {T} node - 可以是一个字符串选择器、一个 HTMLElement、或返回 HTMLElement 的函数。\n * @returns {HTMLElement | Element } 返回找到的 HTMLElement 或 Element，找不到则返回 undefined。\n */\nconst getAttach = function (node) {\n    return getElement(node) ?? document.body;\n};\n',
    type: "js",
    name: "getAttach",
    intro: "获取要附加到的节点元素。",
  },
  {
    code: '/**\n * 获取指定节点对应的 HTMLElement 或 Element。\n *\n * @param {T} node - 可以是一个字符串选择器、一个 HTMLElement、或返回 HTMLElement 的函数。\n * @returns {HTMLElement | Element | undefined} 返回找到的 HTMLElement 或 Element，找不到则返回 undefined。\n */\nfunction getElement(node) {\n    const attachNode = node instanceof Function ? node() : node;\n    if (!attachNode) {\n        return undefined;\n    }\n    if (typeof attachNode === "string") {\n        return document.querySelector(attachNode);\n    }\n    if (attachNode instanceof Element) {\n        return attachNode;\n    }\n    return undefined;\n}\n',
    type: "js",
    name: "getElement",
    intro: "获取指定节点对应的 HTMLElement 或 Element。",
  },
  {
    code: '/**\n * 获取元素的指定CSS属性值。\n * @param {HTMLElement} element - 要获取属性值的元素\n * @param {string} propName - CSS属性名\n * @returns {string} 返回指定CSS属性的值（小写形式）\n */\nfunction getElmCssPropValue(element, propName) {\n    let propValue = "";\n    if (document.defaultView && document.defaultView.getComputedStyle) {\n        propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);\n    }\n    if (propValue && propValue.toLowerCase) {\n        return propValue.toLowerCase();\n    }\n    return propValue;\n}\n',
    type: "js",
    name: "getElmCssPropValue",
    intro: "获取元素的指定CSS属性值。",
  },
  {
    code: '/**\n * 获取给定图片链接的宽度和高度。\n *\n * @param {string} imageUrl - 图片链接。\n * @returns {Promise<{ width: number; height: number }>} 返回一个 Promise，解析为包含宽度和高度的对象 { width, height }。\n */\nfunction getImageSize(imageUrl) {\n    return new Promise((resolve, reject) => {\n        const image = new Image();\n        image.onload = () => {\n            resolve({ width: image.width, height: image.height });\n        };\n        image.onerror = () => {\n            reject(new Error("Failed to load image."));\n        };\n        image.src = imageUrl;\n    });\n}\n',
    type: "js",
    name: "getImageSize",
    intro: "获取给定图片链接的宽度和高度。",
  },
  {
    code: '/**\n * 获取给定内容插入到指定 DOM 节点后，该节点在父容器中占据的行数。\n *\n * @param {HTMLElement} parent - 父容器 DOM 节点。\n * @param {string | HTMLElement} content - 要插入的内容。\n * @param {HTMLElement | null} [insertBefore=null] - 要插入在哪个 DOM 节点之前，默认为 null，表示插入到末尾。\n * @returns {number} 插入内容后节点在父容器中占据的行数。\n */\nfunction getLinesCountAfterInsertion(parent, content, insertBefore = null) {\n    let clone = document.createElement("div");\n    if (typeof content === "string") {\n        clone.innerHTML = content;\n    }\n    else if (content instanceof HTMLElement) {\n        clone = content;\n    }\n    clone.style.cssText = "visibility: hidden;";\n    parent.insertBefore(clone, insertBefore);\n    const lineHeight = parseFloat(getComputedStyle(clone).lineHeight);\n    const clientHeight = clone.clientHeight;\n    parent.removeChild(clone);\n    return Math.ceil(clientHeight / lineHeight);\n}\n',
    type: "js",
    name: "getLinesCountAfterInsertion",
    intro: "获取给定内容插入到指定 DOM 节点后，该节点在父容器中占据的行数。",
  },
  {
    code: 'const isServer = typeof window === "undefined";\nfunction isWindow(obj) {\n    return obj && obj === obj.window;\n}\n/**\n * 获取指定滚动目标的滚动距离。\n * @param {ScrollTarget} target - 滚动目标\n * @param {boolean} [isLeft] - 是否获取水平方向的滚动距离，默认为垂直方向\n * @returns {number} 返回滚动距离\n */\nfunction getScroll(target, isLeft) {\n    // node环境或者target为空\n    if (isServer || !target) {\n        return 0;\n    }\n    const method = isLeft ? "scrollLeft" : "scrollTop";\n    let result = 0;\n    if (isWindow(target)) {\n        result = target[isLeft ? "pageXOffset" : "pageYOffset"];\n    }\n    else if (target instanceof Document) {\n        result = target.documentElement[method];\n    }\n    else if (target) {\n        result = target[method];\n    }\n    return result;\n}\n',
    type: "js",
    name: "getScroll",
    intro: "获取指定滚动目标的滚动距离。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isString(value) {\n    return typeof value === "string";\n}\nfunction isFunction(value) {\n    return getType(value) === "Function";\n}\n/**\n * 获取滚动容器元素。\n * @param {ScrollContainer} [container="body"] - 滚动容器元素，可以是选择器字符串、函数或元素对象，默认为"body"\n * @returns {ScrollContainerElement} 返回滚动容器元素\n */\nconst getScrollContainer = (container = "body") => {\n    if (isString(container)) {\n        return document.querySelector(container);\n    }\n    if (isFunction(container)) {\n        return container();\n    }\n    return container;\n};\n',
    type: "js",
    name: "getScrollContainer",
    intro: "获取滚动容器元素。",
  },
  {
    code: '/**\n * 获取浏览器滚动条的宽度。\n * @description 新建一个带有滚动条的 div 元素，通过该元素的 offsetWidth 和 clientWidth 的差值即可获得\n * @returns {number} 返回浏览器滚动条的宽度\n */\nfunction getScrollbarWidth() {\n    const scrollDiv = document.createElement("div");\n    scrollDiv.style.cssText =\n        "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;";\n    document.body.appendChild(scrollDiv);\n    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;\n    document.body.removeChild(scrollDiv);\n    return scrollbarWidth;\n}\n',
    type: "js",
    name: "getScrollbarWidth",
    intro: "获取浏览器滚动条的宽度。",
  },
  {
    code: "/**\n * 获取当前视图滑动的距离\n * @returns {{ scrollTop: number; scrollLeft: number }} 返回窗口的滚动位置信息\n */\nfunction getWindowScroll() {\n    const { body } = document;\n    const docElm = document.documentElement;\n    const scrollTop = window.pageYOffset || docElm.scrollTop || body.scrollTop;\n    const scrollLeft = window.pageXOffset || docElm.scrollLeft || body.scrollLeft;\n    return { scrollTop, scrollLeft };\n}\n",
    type: "js",
    name: "getWindowScroll",
    intro: "获取当前视图滑动的距离",
  },
  {
    code: "/**\n * 获取窗口的尺寸。\n * @returns {{ width: number; height: number }} 返回窗口的宽度和高度\n */\nfunction getWindowSize() {\n    if (window.innerWidth !== undefined) {\n        return { width: window.innerWidth, height: window.innerHeight };\n    }\n    const doc = document.documentElement;\n    return { width: doc.clientWidth, height: doc.clientHeight };\n}\n",
    type: "js",
    name: "getWindowSize",
    intro: "获取窗口的尺寸。",
  },
  {
    code: '/**\n * 检查元素是否包含指定的类名。\n * @param {Element} el - 要检查的元素\n * @param {string} cls - 要检查的类名\n * @returns {any} 如果元素包含指定类名则返回true，否则返回false\n */\nfunction hasClass(el, cls) {\n    if (!el || !cls)\n        return false;\n    if (cls.indexOf(" ") !== -1)\n        throw new Error("className should not contain space.");\n    if (el.classList) {\n        return el.classList.contains(cls);\n    }\n    return ` ${el.className} `.indexOf(` ${cls} `) > -1;\n}\n',
    type: "js",
    name: "hasClass",
    intro: "检查元素是否包含指定的类名。",
  },
  {
    code: 'function getElmCssPropValue(element, propName) {\n    let propValue = "";\n    if (document.defaultView && document.defaultView.getComputedStyle) {\n        propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);\n    }\n    if (propValue && propValue.toLowerCase) {\n        return propValue.toLowerCase();\n    }\n    return propValue;\n}\n/**\n * 判断元素是否处在 position fixed 中\n * @param {HTMLElement} element - 要检查的元素\n * @returns {boolean} 如果元素具有固定定位则返回true，否则返回false\n */\nfunction isFixed(element) {\n    const p = element.parentNode;\n    if (!p || p.nodeName === "HTML") {\n        return false;\n    }\n    if (getElmCssPropValue(element, "position") === "fixed") {\n        return true;\n    }\n    return isFixed(p);\n}\n',
    type: "js",
    name: "isFixed",
    intro: "判断元素是否处在 position fixed 中",
  },
  {
    code: '/**\n * Thanks to https://spothero.com/static/main/uniform/docs-js/module-DOMUtils.html\n */\nconst isServer = typeof window === "undefined";\n',
    type: "js",
    name: "isServer",
    intro: "Thanks to https://spothero.com/static/main/uniform/docs-js/module-DOMUtils.html",
  },
  {
    code: "/**\n * @file\n * 缓动函数\n * 参考自: https://github.com/bameyrick/js-easing-functions/blob/master/src/index.ts\n */\nconst linear = (current, start, end, duration) => {\n    const change = end - start;\n    const offset = (change * current) / duration;\n    return offset + start;\n};\n",
    type: "js",
    name: "linear",
  },
  {
    code: 'function toArray(value) {\n    let list;\n    if (Array.isArray(value)) {\n        list = value;\n    }\n    else {\n        list = [value];\n    }\n    return list;\n}\n/**\n * 监听鼠标点击事件，如果点击事件不包含指定的元素，则触发回调函数，并返回一个销毁监听事件的方法。\n *\n * @param {string | Element | undefined | (string | Element | undefined)[]} target - 要监听的目标元素或元素数组。\n * @param {() => void} callback - 鼠标点击事件不包含目标元素时触发的回调函数。\n * @returns {() => void} 一个函数，用于销毁监听事件。\n */\nfunction listenClickOutside(target, callback) {\n    function getEls(target) {\n        if (typeof target === "string") {\n            return [...document.querySelectorAll(target)].filter(Boolean);\n        }\n        else if (target instanceof Element) {\n            return toArray(target);\n        }\n        else if (Array.isArray(target)) {\n            return target.map((i) => getEls(i)).flat();\n        }\n        return [];\n    }\n    const handleClickOutside = (event) => {\n        const els = getEls(target).filter((el) => el instanceof Element);\n        const isClickOutside = els.every((target) => !target.contains(event.target));\n        if (isClickOutside) {\n            callback();\n        }\n    };\n    document.addEventListener("click", handleClickOutside);\n    return () => {\n        document.removeEventListener("click", handleClickOutside);\n    };\n}\n',
    type: "js",
    name: "listenClickOutside",
    intro:
      "监听鼠标点击事件，如果点击事件不包含指定的元素，则触发回调函数，并返回一个销毁监听事件的方法。",
  },
  {
    code: 'function toArray(value) {\n    let list;\n    if (Array.isArray(value)) {\n        list = value;\n    }\n    else {\n        list = [value];\n    }\n    return list;\n}\n// #region ====================== 类型检查方法 ======================\nfunction getType(value) {\n    return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isObject(value) {\n    return getType(value) === "Object";\n}\nfunction isHasObject(value) {\n    return isObject(value) && Object.keys(value).length > 0;\n}\n/**\n * 动态加载一组 JavaScript 文件。\n *\n * @param {string | string[]} files - 要加载的 JavaScript 文件数组。\n * @param {Pick<Partial<HTMLScriptElement>, "type" | "async">} [config] - 配置选项，可选。\n * @returns {Promise<void[]>} 返回一个 Promise，在所有文件加载完成后解析。\n */\nfunction loadJS(files, config) {\n    // 获取head标签\n    const head = document.getElementsByTagName("head")[0];\n    files = toArray(files);\n    // 使用 Promise.all 并行加载所有文件\n    return Promise.all(files.map((file) => {\n        return new Promise((resolve, reject) => {\n            // 创建script标签并添加到head\n            const scriptElement = document.createElement("script");\n            scriptElement.type = "text/javascript";\n            scriptElement.async = true;\n            scriptElement.src = file;\n            // 添加自定义属性\n            if (isHasObject(config)) {\n                Object.entries(config).forEach(([key, val]) => {\n                    scriptElement.setAttribute(key, String(val));\n                });\n            }\n            // 监听load事件，如果加载完成则resolve\n            scriptElement.addEventListener("load", () => resolve(), false);\n            // 监听error事件，如果加载失败则reject\n            scriptElement.addEventListener("error", () => reject(new Error(`Failed to load script: ${file}`)), false);\n            head.appendChild(scriptElement);\n        });\n    }));\n}\n',
    type: "js",
    name: "loadJS",
    intro: "动态加载一组 JavaScript 文件。",
  },
  {
    code: "/**\n * 监听DOM节点大小变化\n * @param {Element} targetNode - 要监听的DOM节点\n * @param {SizeChangeCallback} callback - 节点大小变化时的回调函数\n * @returns {() => void} 返回一个取消监听的方法\n */\nfunction observeNodeSizeChange(targetNode, callback) {\n    // 创建一个ResizeObserver实例并将回调函数传入\n    const resizeObserver = new ResizeObserver(([entry]) => {\n        callback(entry.contentRect, entry);\n    });\n    // 开始观察目标节点的大小变化\n    resizeObserver.observe(targetNode);\n    // 返回一个取消观察的方法\n    return () => {\n        resizeObserver.unobserve(targetNode);\n        resizeObserver.disconnect();\n    };\n}\n",
    type: "js",
    name: "observeNodeSizeChange",
    intro: "监听DOM节点大小变化",
  },
  {
    code: 'const isServer = typeof window === "undefined";\n/**\n * 动态返回一个事件解绑函数，根据运行环境选择使用removeEventListener或detachEvent。\n * @param {Node} element - 要解绑事件的节点\n * @param {string} event - 事件类型\n * @param {EventListenerOrEventListenerObject} handler - 事件处理函数\n * @param {boolean | AddEventListenerOptions} [options] - 可选的事件参数\n * @returns {any} 返回一个函数，用于解绑指定事件从指定节点\n * @alpha\n */\nconst off = (() => {\n    if (!isServer && Boolean(document.removeEventListener)) {\n        return (element, event, handler, options) => {\n            if (element && event) {\n                element.removeEventListener(event, handler, options);\n            }\n        };\n    }\n    return (element, event, handler) => {\n        if (element && event) {\n            element.detachEvent(`on${event}`, handler);\n        }\n    };\n})();\n',
    type: "js",
    name: "off",
    intro: "动态返回一个事件解绑函数，根据运行环境选择使用removeEventListener或detachEvent。",
  },
  {
    code: "// #endregion -- end\nconst NOOP = () => { };\n/**\n * 给指定元素添加事件监听器，并返回一个函数用于移除监听器。\n *\n * @type {<E extends Node, K extends keyof EEventMap<E>>(\n *   element: E,\n *   event: K,\n *   handler: EEventHandler<E, K>,\n *   options?: boolean | AddEventListenerOptions\n * ) => typeof NOOP}\n * @param {E} element - 要添加事件监听器的元素。\n * @param {K} event - 要监听的事件类型。\n * @param {EEventHandler<E, K>} handler - 事件处理函数。\n * @param {boolean | AddEventListenerOptions} [options] - 可选的事件参数。\n * @returns {typeof NOOP} 一个函数，用于移除事件监听器。\n */\nfunction on(element, event, handler, options) {\n    if (element && event && handler) {\n        element.addEventListener(event, handler, options);\n        return () => {\n            element.removeEventListener(event, handler, options);\n        };\n    }\n    return NOOP;\n}\n",
    type: "js",
    name: "on",
    intro: "给指定元素添加事件监听器，并返回一个函数用于移除监听器。",
  },
  {
    code: '// #endregion -- end\nconst NOOP = () => { };\nconst isServer = typeof window === "undefined";\nfunction on(element, event, handler, options) {\n    if (element && event && handler) {\n        element.addEventListener(event, handler, options);\n        return () => {\n            element.removeEventListener(event, handler, options);\n        };\n    }\n    return NOOP;\n}\n/**\n * 为指定节点的指定事件绑定一个只执行一次的事件处理函数。\n * @type {<E extends Node, K extends keyof EEventMap<E>>(\n *   element: E,\n *   event: K,\n *   handler: EEventHandler<E, K>,\n *   options?: boolean | AddEventListenerOptions\n * ) => typeof NOOP}\n * @param {E} element - 要添加事件监听器的元素。\n * @param {K} event - 要监听的事件类型。\n * @param {EEventHandler<E, K>} handler - 事件处理函数。\n * @param {boolean | AddEventListenerOptions} [options] - 可选的事件参数。\n * @returns {typeof NOOP} 一个函数，用于移除事件监听器。\n */\nfunction once(element, event, handler, options) {\n    const callback = function (e) {\n        handler.call(this, e);\n        off(element, event, callback, options);\n    };\n    on(element, event, callback, options);\n    return () => {\n        off(element, event, callback, options);\n    };\n}\nconst off = (() => {\n    if (!isServer && Boolean(document.removeEventListener)) {\n        return (element, event, handler, options) => {\n            if (element && event) {\n                element.removeEventListener(event, handler, options);\n            }\n        };\n    }\n    return (element, event, handler) => {\n        if (element && event) {\n            element.detachEvent(`on${event}`, handler);\n        }\n    };\n})();\n',
    type: "js",
    name: "once - 1",
    intro: "为指定节点的指定事件绑定一个只执行一次的事件处理函数。",
  },
  {
    code: '// #endregion -- end\nconst trim = (str) => (str || "").replace(/^[\\s\\uFEFF]+|[\\s\\uFEFF]+$/g, "");\nfunction hasClass(el, cls) {\n    if (!el || !cls)\n        return false;\n    if (cls.indexOf(" ") !== -1)\n        throw new Error("className should not contain space.");\n    if (el.classList) {\n        return el.classList.contains(cls);\n    }\n    return ` ${el.className} `.indexOf(` ${cls} `) > -1;\n}\n/**\n * 从元素中移除一个或多个类名。\n * @param {Element} el - 要移除类名的元素\n * @param {string} cls - 要移除的类名，可以是多个类名以空格分隔\n */\nfunction removeClass(el, cls) {\n    if (!el || !cls)\n        return;\n    const classes = cls.split(" ");\n    let curClass = ` ${el.className} `;\n    for (let i = 0, j = classes.length; i < j; i++) {\n        const clsName = classes[i];\n        if (!clsName)\n            continue;\n        if (el.classList) {\n            el.classList.remove(clsName);\n        }\n        else if (hasClass(el, clsName)) {\n            curClass = curClass.replace(` ${clsName} `, " ");\n        }\n    }\n    if (!el.classList) {\n        el.className = trim(curClass);\n    }\n}\n',
    type: "js",
    name: "removeClass",
    intro: "从元素中移除一个或多个类名。",
  },
  {
    code: '/**\n * 模拟提交表单操作。\n * @param {HTMLFormElement} target - 要提交的表单元素\n */\nconst requestSubmit = (target) => {\n    if (!(target instanceof HTMLFormElement)) {\n        throw new Error("target must be HTMLFormElement");\n    }\n    const submitter = document.createElement("input");\n    submitter.type = "submit";\n    submitter.hidden = true;\n    target.appendChild(submitter);\n    submitter.click();\n    target.removeChild(submitter);\n};\n',
    type: "js",
    name: "requestSubmit",
    intro: "模拟提交表单操作。",
  },
  {
    code: 'const isServer = typeof window === "undefined";\n/**\n * 将选定的元素滚动到父元素的可视区域内。\n * @param {HTMLElement} parentEle - 父元素\n * @param {HTMLElement} selected - 要滚动到可视区域内的选定元素\n */\nconst scrollSelectedIntoView = (parentEle, selected) => {\n    // 服务端不处理\n    if (isServer)\n        return;\n    // selected不存在或selected父元素不为parentEle则不处理\n    if (!selected || selected.offsetParent !== parentEle) {\n        parentEle.scrollTop = 0;\n        return;\n    }\n    const selectedTop = selected.offsetTop;\n    const selectedBottom = selectedTop + selected.offsetHeight;\n    const parentScrollTop = parentEle.scrollTop;\n    const parentViewBottom = parentScrollTop + parentEle.clientHeight;\n    if (selectedTop < parentScrollTop) {\n        // selected元素滚动过了，则将其向下滚动到可视范围顶部\n        parentEle.scrollTop = selectedTop;\n    }\n    else if (selectedBottom > parentViewBottom) {\n        // selected元素未滚动到，则将其向上滚动到可视范围底部\n        parentEle.scrollTop = selectedBottom - parentEle.clientHeight;\n    }\n};\n',
    type: "js",
    name: "scrollSelectedIntoView",
    intro: "将选定的元素滚动到父元素的可视区域内。",
  },
  {
    code: 'import raf from \'raf\';\nconst easeInOutCubic = (current, start, end, duration) => {\n    const change = (end - start) / 2;\n    let time = current / (duration / 2);\n    if (time < 1) {\n        return change * time * time * time + start;\n    }\n    time -= 2;\n    // eslint-disable-next-line no-return-assign\n    return change * (time * time * time + 2) + start;\n};\nconst isServer = typeof window === "undefined";\nfunction isWindow(obj) {\n    return obj && obj === obj.window;\n}\nfunction getScroll(target, isLeft) {\n    // node环境或者target为空\n    if (isServer || !target) {\n        return 0;\n    }\n    const method = isLeft ? "scrollLeft" : "scrollTop";\n    let result = 0;\n    if (isWindow(target)) {\n        result = target[isLeft ? "pageXOffset" : "pageYOffset"];\n    }\n    else if (target instanceof Document) {\n        result = target.documentElement[method];\n    }\n    else if (target) {\n        result = target[method];\n    }\n    return result;\n}\n/**\n * 滚动到指定位置的异步函数。\n * @param {number} target - 目标滚动位置\n * @param {ScrollTopOptions} opt - 滚动选项，包括容器、持续时间和缓动函数\n * @returns {Promise<ScrollToResult>} 返回一个Promise，表示滚动操作的结果\n */\nfunction scrollTo(target, opt) {\n    const { container = window, duration = 450, easing = easeInOutCubic } = opt;\n    const scrollTop = getScroll(container);\n    const startTime = Date.now();\n    return new Promise((res) => {\n        const fnc = () => {\n            const timestamp = Date.now();\n            const time = timestamp - startTime;\n            const nextScrollTop = easing(Math.min(time, duration), scrollTop, target, duration);\n            if (isWindow(container)) {\n                container.scrollTo(window.pageXOffset, nextScrollTop);\n            }\n            else if (container instanceof Document || container.constructor.name === "HTMLDocument") {\n                container.documentElement.scrollTop = nextScrollTop;\n            }\n            else {\n                container.scrollTop = nextScrollTop;\n            }\n            if (time < duration) {\n                raf(fnc);\n            }\n            else {\n                // 由于上面步骤设置了scrollTop, 滚动事件可能未触发完毕\n                // 此时应该在下一帧再执行res\n                raf(res);\n            }\n        };\n        raf(fnc);\n    });\n}\n',
    type: "js",
    name: "scrollTo",
    intro: "滚动到指定位置的异步函数。",
  },
  {
    code: "/**\r\n * 获取两个数组的交集，通过指定字段属性进行判断。\r\n *\r\n * @type  {<T, K extends keyof T>(arr1: T[], arr2: T[], key: K) => T[]}\r\n * @param {T[]} arr1 - 第一个数组。「主数组,当返回的内容从主数组中获取」\r\n * @param {T[]} arr2 - 第二个数组。\r\n * @param {K extends keyof T} [key] - 可选的字段属性，用于判断交集。\r\n * @returns {T[]} 交集的数组。\r\n */\r\nexport function getArrayIntersection<T, K extends keyof T = keyof T>(\r\n  arr1: T[],\r\n  arr2: T[],\r\n  key?: K\r\n): T[] {\r\n  if (key) {\r\n    const set = new Set(arr2.map((item) => item[key]));\r\n    return arr1.filter((item) => set.has(item[key]));\r\n  }\r\n  return arr1.filter((item) => arr2.includes(item));\r\n}",
    type: "ts",
    name: "getArrayIntersection",
    intro: "获取两个数组的交集，通过指定字段属性进行判断。",
  },
  {
    code: "\r\n\r\n/**\r\n * 确保给定数字在指定范围内。\r\n *\r\n * @param {number} numberToClamp - 要限制的数字。\r\n * @param {[number, number]} range - 范围，表示为 [min, max] 数组。\r\n * @returns {number} 在指定范围内的值。\r\n */\r\nexport function clampNumberWithinRange(numberToClamp: number, range: [number, number]): number {\r\n  const [min, max] = range;\r\n  return Math.max(min, Math.min(numberToClamp, max));\r\n}",
    type: "ts",
    name: "clampNumberWithinRange",
    intro: "确保给定数字在指定范围内。",
  },
  {
    code: "\r\n\r\n/**\r\n * 将值或值数组转换为数组。\r\n *\r\n * @type {<T>(value: T | T[]) => T[]}\r\n * @param {T | T[]} value - 要转换的值或值数组。\r\n * @returns {T[]} 转换后的数组。\r\n * @example\r\n * const result = toArray(\"value\"); // ['value']\r\n * const resultArray = toArray([\"value1\", \"value2\"]); // ['value1', 'value2']\r\n */\r\nexport function toArray<T>(value: T | T[]): T[] {\r\n  let list: T[];\r\n\r\n  if (Array.isArray(value)) {\r\n    list = value;\r\n  } else {\r\n    list = [value];\r\n  }\r\n\r\n  return list;\r\n}",
    type: "ts",
    name: "toArray",
    intro: "将值或值数组转换为数组。",
  },
  {
    code: "\r\n\r\ntype OnlyObject = {\r\n  [key: string]: any;\r\n} & {\r\n  [key: string]: unknown;\r\n};\r\n\r\n/**\r\n * 根据指定属性值进行过滤列表。\r\n *\r\n * @template T - 列表中元素的类型。\r\n * @template R - 属性的键名。\r\n * @template U - 当T为对象类型时，U为R的类型；否则为undefined。\r\n * @param {T[]} list - 要过滤的列表。\r\n * @param {T extends OnlyObject\r\n *   ? {\r\n *       property: R;\r\n *       includes?: unknown[];\r\n *       excludes?: unknown[];\r\n *     }\r\n *   : Partial<{\r\n *       property: undefined;\r\n *       includes: unknown[];\r\n *       excludes: unknown[];\r\n *     }>} opts - 过滤选项，包括要过滤的属性名、包含的值数组和排除的值数组。\r\n * @returns {T[]} 过滤后的列表。\r\n * @type {<\r\n *   T,\r\n *   R extends keyof T,\r\n *   U = T extends OnlyObject ? R : undefined\r\n * >(\r\n *   list: T[],\r\n *   opts: T extends OnlyObject\r\n *     ? {\r\n *         property: R;\r\n *         includes?: unknown[];\r\n *         excludes?: unknown[];\r\n *       }\r\n *     : Partial<{\r\n *         property: undefined;\r\n *         includes: unknown[];\r\n *         excludes: unknown[];\r\n *       }>\r\n * ) => T[]}\r\n */\r\nexport function filterList<T, R extends keyof T, U = T extends OnlyObject ? R : undefined>(\r\n  list: T[],\r\n  opts: T extends OnlyObject\r\n    ? {\r\n        property: R;\r\n        includes?: unknown[];\r\n        excludes?: unknown[];\r\n      }\r\n    : Partial<{\r\n        property: undefined;\r\n        includes: unknown[];\r\n        excludes: unknown[];\r\n      }>\r\n): T[] {\r\n  const { property, includes = [], excludes = [] } = opts;\r\n\r\n  return list.filter((item) => {\r\n    const val = property ? item[property] : item;\r\n    if (includes?.length && excludes?.length) {\r\n      return includes.includes(val) && !excludes.includes(val);\r\n    } else if (includes?.length) {\r\n      return includes.includes(val);\r\n    } else if (excludes?.length) {\r\n      return !excludes.includes(val);\r\n    }\r\n    return true;\r\n  });\r\n}",
    type: "ts",
    name: "filterList",
    intro: "根据指定属性值进行过滤列表。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为非undefined。\r\n * 注: 非「undefined」类型\r\n *\r\n * @param {T | undefined} value - 要检查的值。\r\n * @returns {value is T} 如果值不为 Undefined 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isDef<T extends unknown>(value: T | undefined): value is T {\r\n  return typeof value !== "undefined";\r\n}',
    type: "ts",
    name: "isDef",
    intro: "检查一个值是否为非undefined。\r\n注: 非「undefined」类型",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 Undefined 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is undefined} 如果值为 Undefined 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isUndefined(value: unknown): value is undefined {\r\n  return typeof value === "undefined";\r\n}',
    type: "ts",
    name: "isUndefined",
    intro: "检查一个值是否为 Undefined 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\r\n\r\n/**\r\n * 获取值的类型字符串。\r\n *\r\n * @param {unknown} value - 要获取类型的值。\r\n * @returns {string} 值的类型字符串。\r\n */\r\nfunction getType(value: unknown): string {\r\n  return Object.prototype.toString.call(value).slice(8, -1);\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Null 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is null} 如果值为 Null 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isNull(value: unknown): value is null {\r\n  return getType(value) === "Null";\r\n}',
    type: "ts",
    name: "isNull",
    intro: "检查一个值是否为 Null 类型。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 boolean 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is boolean} 如果值为 boolean 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isBoolean(value: unknown): value is boolean {\r\n  return typeof value === "boolean";\r\n}',
    type: "ts",
    name: "isBoolean",
    intro: "检查一个值是否为 boolean 类型。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 Number 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is number} 如果值为 Number 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isNumber(value: unknown): value is number {\r\n  return typeof value === "number";\r\n}',
    type: "ts",
    name: "isNumber",
    intro: "检查一个值是否为 Number 类型。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 String 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is string} 如果值为 String 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isString(value: unknown): value is string {\r\n  return typeof value === "string";\r\n}',
    type: "ts",
    name: "isString",
    intro: "检查一个值是否为 String 类型。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 BigInt 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is BigInt} 如果值为 BigInt 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isBigInt(value: unknown): value is BigInt {\r\n  return typeof value === "bigint";\r\n}',
    type: "ts",
    name: "isBigInt",
    intro: "检查一个值是否为 BigInt 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\r\n\r\n/**\r\n * 获取值的类型字符串。\r\n *\r\n * @param {unknown} value - 要获取类型的值。\r\n * @returns {string} 值的类型字符串。\r\n */\r\nfunction getType(value: unknown): string {\r\n  return Object.prototype.toString.call(value).slice(8, -1);\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Symbol 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is symbol} 如果值为 Symbol 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isSymbol(value: unknown): value is symbol {\r\n  return getType(value) === "Symbol";\r\n}',
    type: "ts",
    name: "isSymbol",
    intro: "检查一个值是否为 Symbol 类型。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 Object 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is object} 如果值为 Object 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isObject(value: unknown): value is object {\r\n  return getType(value) === "Object";\r\n}',
    type: "ts",
    name: "isObject",
    intro: "检查一个值是否为 Object 类型。",
  },
  {
    code: "isArray(arg:any):arg is any[];isArray(arg:any):arg is any[];",
    type: "ts",
    name: "isArray",
    intro: "检查一个值是否为 Array 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\r\n\r\n/**\r\n * 获取值的类型字符串。\r\n *\r\n * @param {unknown} value - 要获取类型的值。\r\n * @returns {string} 值的类型字符串。\r\n */\r\nfunction getType(value: unknown): string {\r\n  return Object.prototype.toString.call(value).slice(8, -1);\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Function 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is Function} 如果值为 Function 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isFunction(value: unknown): value is Function {\r\n  return getType(value) === "Function";\r\n}',
    type: "ts",
    name: "isFunction",
    intro: "检查一个值是否为 Function 类型。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 Blob 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is Blob} 如果值为 Blob 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isBlob(value: unknown): value is Blob {\r\n  return getType(value) === "Blob";\r\n}',
    type: "ts",
    name: "isBlob",
    intro: "检查一个值是否为 Blob 类型。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 Date 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is Date} 如果值为 Date 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isDate(value: unknown): value is Date {\r\n  return getType(value) === "Date";\r\n}',
    type: "ts",
    name: "isDate",
    intro: "检查一个值是否为 Date 类型。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 RegExp 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is RegExp} 如果值为 RegExp 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isRegExp(value: unknown): value is RegExp {\r\n  return getType(value) === "RegExp";\r\n}',
    type: "ts",
    name: "isRegExp",
    intro: "检查一个值是否为 RegExp 类型。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 Error 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is Error} 如果值为 Error 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isError(value: unknown): value is Error {\r\n  return getType(value) === "Error";\r\n}',
    type: "ts",
    name: "isError",
    intro: "检查一个值是否为 Error 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\r\n\r\n/**\r\n * 获取值的类型字符串。\r\n *\r\n * @param {unknown} value - 要获取类型的值。\r\n * @returns {string} 值的类型字符串。\r\n */\r\nfunction getType(value: unknown): string {\r\n  return Object.prototype.toString.call(value).slice(8, -1);\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Map 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is Map<any, any>} 如果值为 Map 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isMap(value: unknown): value is Map<any, any> {\r\n  return getType(value) === "Map";\r\n}',
    type: "ts",
    name: "isMap",
    intro: "检查一个值是否为 Map 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\r\n\r\n/**\r\n * 获取值的类型字符串。\r\n *\r\n * @param {unknown} value - 要获取类型的值。\r\n * @returns {string} 值的类型字符串。\r\n */\r\nfunction getType(value: unknown): string {\r\n  return Object.prototype.toString.call(value).slice(8, -1);\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Set 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is Set<any>} 如果值为 Set 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isSet(value: unknown): value is Set<any> {\r\n  return getType(value) === "Set";\r\n}',
    type: "ts",
    name: "isSet",
    intro: "检查一个值是否为 Set 类型。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\r\n\r\n/**\r\n * 获取值的类型字符串。\r\n *\r\n * @param {unknown} value - 要获取类型的值。\r\n * @returns {string} 值的类型字符串。\r\n */\r\nfunction getType(value: unknown): string {\r\n  return Object.prototype.toString.call(value).slice(8, -1);\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Promise 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is Promise<any>} 如果值为 Promise 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isPromise(value: unknown): value is Promise<any> {\r\n  return getType(value) === "Promise";\r\n}',
    type: "ts",
    name: "isPromise",
    intro: "检查一个值是否为 Promise 类型。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 Window 类型。\r\n *\r\n * @param {any} value - 要检查的值。\r\n * @returns {boolean} 如果值为 Window 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isWindow(value: any): boolean {\r\n  return typeof window !== "undefined" && getType(value) === "Window";\r\n}',
    type: "ts",
    name: "isWindow",
    intro: "检查一个值是否为 Window 类型。",
  },
  {
    code: "\r\n\r\n// #endregion -- end\r\n\r\n// #region ====================== is公共方法 ======================\r\n\r\n/**\r\n * 检查一个值是否为 `undefined` 或 `null`。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is undefined | null} 如果值为 `undefined` 或 `null`，则返回 `true`，否则返回 `false`。\r\n */\r\nexport function isNullOrUndefined(value: unknown): value is undefined | null {\r\n  return value === undefined || value === null;\r\n}",
    type: "ts",
    name: "isNullOrUndefined",
    intro: "检查一个值是否为 `undefined` 或 `null`。",
  },
  {
    code: "\r\n\r\n// #endregion -- end\r\n\r\n// #region ====================== is公共方法 ======================\r\n\r\n/**\r\n * 检查一个值是否为 `undefined` 或 `null`。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is undefined | null} 如果值为 `undefined` 或 `null`，则返回 `true`，否则返回 `false`。\r\n */\r\nexport function isNullOrUndefined(value: unknown): value is undefined | null {\r\n  return value === undefined || value === null;\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 `undefined` 或 `null`。\r\n *\r\n * @param {T} value - 要检查的值。\r\n * @returns {value is NonNullable<T>} 如果值为 `undefined` 或 `null`，则返回 `true`，否则返回 `false`。\r\n */\r\nexport function isNonNullable<T extends unknown>(value: T): value is NonNullable<T> {\r\n  return !isNullOrUndefined(value);\r\n}",
    type: "ts",
    name: "isNonNullable",
    intro: "检查一个值是否为 `undefined` 或 `null`。",
  },
  {
    code: '\r\n\r\n/**\r\n * 检查一个值是否为 String 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is string} 如果值为 String 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isString(value: unknown): value is string {\r\n  return typeof value === "string";\r\n}\r\n\r\n/**\r\n * 检查一个值是否为空字符串。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is ""} 如果值为空字符串，则返回 true，否则返回 false。\r\n */\r\nexport function isEmptyString(value: unknown): value is "" {\r\n  return isString(value) && value.length === 0;\r\n}',
    type: "ts",
    name: "isEmptyString",
    intro: "检查一个值是否为空字符串。",
  },
  {
    code: "\r\n\r\n/**\r\n * 检查一个值是否为非空字符串。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is string} 如果值为非空字符串，则返回 true，否则返回 false。\r\n */\r\nexport function isHasString(value: unknown): value is string {\r\n  return isString(value) && value.length > 0;\r\n}",
    type: "ts",
    name: "isHasString",
    intro: "检查一个值是否为非空字符串。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\r\n\r\n/**\r\n * 获取值的类型字符串。\r\n *\r\n * @param {unknown} value - 要获取类型的值。\r\n * @returns {string} 值的类型字符串。\r\n */\r\nfunction getType(value: unknown): string {\r\n  return Object.prototype.toString.call(value).slice(8, -1);\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Object 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is object} 如果值为 Object 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isObject(value: unknown): value is object {\r\n  return getType(value) === "Object";\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Null 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is null} 如果值为 Null 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isNull(value: unknown): value is null {\r\n  return getType(value) === "Null";\r\n}\r\n\r\n/**\r\n * 检查一个值是否为空对象。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is object} 如果值为空对象，则返回 true，否则返回 false。\r\n */\r\nexport function isEmptyObject(value: unknown): value is object {\r\n  return isObject(value) && !isNull(value) && Object.keys(value).length === 0;\r\n}',
    type: "ts",
    name: "isEmptyObject",
    intro: "检查一个值是否为空对象。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\r\n\r\n/**\r\n * 获取值的类型字符串。\r\n *\r\n * @param {unknown} value - 要获取类型的值。\r\n * @returns {string} 值的类型字符串。\r\n */\r\nfunction getType(value: unknown): string {\r\n  return Object.prototype.toString.call(value).slice(8, -1);\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Object 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is object} 如果值为 Object 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isObject(value: unknown): value is object {\r\n  return getType(value) === "Object";\r\n}\r\n\r\n/**\r\n * 检查一个值是否为非空对象。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is object} 如果值有最少一个可枚举属性，则返回 true，否则返回 false。\r\n */\r\nexport function isHasObject(value: unknown): value is object {\r\n  return isObject(value) && Object.keys(value).length > 0;\r\n}',
    type: "ts",
    name: "isHasObject",
    intro: "检查一个值是否为非空对象。",
  },
  {
    code: "\r\n\r\n/**\r\n * 检查一个值是否为空数组。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is any[]} 如果值为空数组，则返回 true，否则返回 false。\r\n */\r\nexport function isEmptyArray(value: unknown): value is any[] {\r\n  return Array.isArray(value) && value.length === 0;\r\n}",
    type: "ts",
    name: "isEmptyArray",
    intro: "检查一个值是否为空数组。",
  },
  {
    code: '// #region ====================== 类型检查方法 ======================\r\n\r\n/**\r\n * 获取值的类型字符串。\r\n *\r\n * @param {unknown} value - 要获取类型的值。\r\n * @returns {string} 值的类型字符串。\r\n */\r\nfunction getType(value: unknown): string {\r\n  return Object.prototype.toString.call(value).slice(8, -1);\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Object 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is object} 如果值为 Object 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isObject(value: unknown): value is object {\r\n  return getType(value) === "Object";\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 String 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is string} 如果值为 String 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isString(value: unknown): value is string {\r\n  return typeof value === "string";\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Undefined 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is undefined} 如果值为 Undefined 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isUndefined(value: unknown): value is undefined {\r\n  return typeof value === "undefined";\r\n}\r\n\r\n/**\r\n * 检查一个值是否为 Null 类型。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is null} 如果值为 Null 类型，则返回 true，否则返回 false。\r\n */\r\nexport function isNull(value: unknown): value is null {\r\n  return getType(value) === "Null";\r\n}\r\n\r\n/**\r\n * 检查一个值是否为空数组。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is any[]} 如果值为空数组，则返回 true，否则返回 false。\r\n */\r\nexport function isEmptyArray(value: unknown): value is any[] {\r\n  return Array.isArray(value) && value.length === 0;\r\n}\r\n\r\n/**\r\n * 检查一个值是否为空对象。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is object} 如果值为空对象，则返回 true，否则返回 false。\r\n */\r\nexport function isEmptyObject(value: unknown): value is object {\r\n  return isObject(value) && !isNull(value) && Object.keys(value).length === 0;\r\n}\r\n\r\n/**\r\n * 检查一个值是否为空字符串。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is ""} 如果值为空字符串，则返回 true，否则返回 false。\r\n */\r\nexport function isEmptyString(value: unknown): value is "" {\r\n  return isString(value) && value.length === 0;\r\n}\r\n\r\n/**\r\n * 检查一个值是否为空。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is undefined | null | [] | ""} 如果值为空，则返回 true，否则返回 false。\r\n */\r\nexport function isEmpty(value: unknown): value is undefined | null | [] | "" {\r\n  return (\r\n    isUndefined(value) ||\r\n    isNull(value) ||\r\n    isEmptyArray(value) ||\r\n    isEmptyObject(value) ||\r\n    isEmptyString(value)\r\n  );\r\n}',
    type: "ts",
    name: "isEmpty",
    intro: "检查一个值是否为空。",
  },
  {
    code: "\r\n\r\n/**\r\n * 检查一个值是否为非空数组。\r\n *\r\n * @param {unknown} value - 要检查的值。\r\n * @returns {value is any[]} 如果值为非空数组，则返回 true，否则返回 false。\r\n */\r\nexport function isHasArray(value: unknown): value is any[] {\r\n  return Array.isArray(value) && value.length > 0;\r\n}",
    type: "ts",
    name: "isHasArray",
    intro: "检查一个值是否为非空数组。",
  },
  {
    code: "\r\n\r\n/**\r\n * 检查指定目标是否在选项中（选项可以是单个对象或对象数组）。\r\n *\r\n * @param {T} target - 目标项。\r\n * @param {(T | T[])[]} options - 选项，可以是单个对象或对象数组。\r\n * @returns {boolean} 若目标项在选项中，则返回 true；否则返回 false。\r\n */\r\nexport function isTargetInOptions<T>(target: T, ...options: (T | T[])[]): boolean {\r\n  return options.some((option) => {\r\n    if (Array.isArray(option)) {\r\n      return option.some((item) => item === target);\r\n    }\r\n    return option === target;\r\n  });\r\n}",
    type: "ts",
    name: "isTargetInOptions",
    intro: "检查指定目标是否在选项中（选项可以是单个对象或对象数组）。",
  },
  {
    code: "\r\n\r\n/**\r\n * 检测给定的值(数字)是否在指定范围内。\r\n *\r\n * @param {number} value - 要检测的值。\r\n * @param {[number, number]} range - 范围，包含最小值和最大值。\r\n * @returns {boolean} 如果值在范围内，则返回 true，否则返回 false。\r\n */\r\nexport function isValueInRange(value: number, range: [number, number]): boolean {\r\n  const [min, max] = range;\r\n  return value >= min && value <= max;\r\n}",
    type: "ts",
    name: "isValueInRange",
    intro: "检测给定的值(数字)是否在指定范围内。",
  },
  {
    code: "/**\r\n * 从对象中排除指定的属性，返回一个新的对象。\r\n *\r\n * @type {<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>}\r\n * @param {T} obj - 要处理的对象。\r\n * @param {K[]} keys - 要排除的属性键名数组。\r\n * @returns {Omit<T, K>} 排除指定属性后的新对象。\r\n * @template T - 对象类型。\r\n * @template K - 要排除的属性键名类型。\r\n */\r\nexport function omit<T extends Record<string, any>, K extends keyof T>(\r\n  obj: T,\r\n  keys: K[]\r\n): Omit<T, K> {\r\n  const clone = { ...obj };\r\n  keys.forEach((key) => delete clone[key]);\r\n  return clone;\r\n}",
    type: "ts",
    name: "omit",
    intro: "从对象中排除指定的属性，返回一个新的对象。",
  },
  {
    code: "\r\n\r\n/**\r\n * 从对象中选取指定的属性并返回新的对象。\r\n *\r\n * @type {<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>}\r\n * @param {T} obj - 要选取属性的对象。\r\n * @param {K[]} keys - 要选取的属性键名数组。\r\n * @returns {Pick<T, K>} 选取指定属性后的新对象。\r\n * @template T - 对象类型。\r\n * @template K - 要选取的属性键名类型。\r\n */\r\nexport function pick<T extends Record<string, any>, K extends keyof T>(\r\n  obj: T,\r\n  keys: K[]\r\n): Pick<T, K> {\r\n  const pickedObject: Partial<Pick<T, K>> = {};\r\n\r\n  keys.forEach((key) => {\r\n    if (obj.hasOwnProperty(key)) {\r\n      pickedObject[key] = obj[key];\r\n    }\r\n  });\r\n\r\n  return pickedObject as Pick<T, K>;\r\n}",
    type: "ts",
    name: "pick",
    intro: "从对象中选取指定的属性并返回新的对象。",
  },
  {
    code: '\r\n\r\n/**\r\n * 生成指定长度的随机字符串。\r\n *\r\n * @param {number} length - 随机字符串的长度。默认值为 8。\r\n * @returns {string} 生成的随机字符串。\r\n * @example\r\n * ```ts\r\n * createRandomString(8) // => "aBcDeFgH"\r\n */\r\nexport function createRandomString(length: number = 8): string {\r\n  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";\r\n  let randomString = "";\r\n\r\n  for (let i = 0; i < length; i++) {\r\n    const randomIndex = Math.floor(Math.random() * characters.length);\r\n    randomString += characters[randomIndex];\r\n  }\r\n\r\n  return randomString;\r\n}',
    type: "ts",
    name: "createRandomString",
    intro: "生成指定长度的随机字符串。",
  },
  {
    code: "\r\n\r\n/**\r\n * 从文件路径中提取文件名。\r\n *\r\n * @param {string} path - 包含文件名的路径。\r\n * @returns {string} 提取出的文件名。\r\n */\r\nexport function getBasename(path: string): string {\r\n  const match = path.match(/\\/([^\\/]+)$/);\r\n  return match ? match[1] : path;\r\n}",
    type: "ts",
    name: "getBasename",
    intro: "从文件路径中提取文件名。",
  },
  {
    code: '\r\n\r\n/**\r\n * 从文件路径中提取文件名。\r\n *\r\n * @param {string} path - 包含文件名的路径。\r\n * @returns {string} 提取出的文件名。\r\n */\r\nexport function getBasename(path: string): string {\r\n  const match = path.match(/\\/([^\\/]+)$/);\r\n  return match ? match[1] : path;\r\n}\r\n\r\n/**\r\n * 获取文件名（不包含扩展名）。\r\n *\r\n * @param {string} fileName - 文件名。\r\n * @returns {string | ""} 提取的文件名。\r\n */\r\nexport function getFileName<T>(fileName: string): string | "" {\r\n  const name = getBasename(fileName);\r\n  const lastDotIndex = name.lastIndexOf(".");\r\n  if (lastDotIndex === -1) {\r\n    return name;\r\n  }\r\n  return name.slice(0, lastDotIndex);\r\n}',
    type: "ts",
    name: "getFileName",
    intro: "获取文件名（不包含扩展名）。",
  },
  {
    code: '\r\n\r\n/**\r\n * 格式化价格，添加千位分隔符并保留指定的小数位数。\r\n *\r\n * @param {string | number} value - 要格式化的价格。\r\n * @param {number} decimalPlaces - 可选的小数位数，默认为不处理小数位数。\r\n * @returns {string} 格式化后的价格。\r\n */\r\nexport function formatPrice(value: string | number, decimalPlaces: number = -1): string {\r\n  const numberValue = typeof value === "number" ? value : parseFloat(value);\r\n  if (isNaN(numberValue)) {\r\n    return value.toString();\r\n  }\r\n\r\n  const options = {\r\n    minimumFractionDigits: decimalPlaces >= 0 ? decimalPlaces : 0,\r\n    maximumFractionDigits: decimalPlaces >= 0 ? decimalPlaces : 2,\r\n  };\r\n\r\n  return numberValue.toLocaleString(undefined, options);\r\n}',
    type: "ts",
    name: "formatPrice",
    intro: "格式化价格，添加千位分隔符并保留指定的小数位数。",
  },
  {
    code: '\r\n\r\n/**\r\n * 将数字转换为中文数字。\r\n *\r\n * @param {string | number} value - 要转换的数字。\r\n * @returns {string} 转换后的中文数字。\r\n */\r\nexport function numberToChinese(value: string | number): string {\r\n  const numberValue = typeof value === "number" ? value.toString() : value;\r\n  const chineseDigits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];\r\n  const chineseUnits = ["", "十", "百", "千", "万", "亿"];\r\n\r\n  const numArray = Array.from(numberValue).reverse();\r\n  const chineseArray = numArray.map((num, index) => {\r\n    const digit = parseInt(num);\r\n    const digitChinese = chineseDigits[digit];\r\n\r\n    if (digit === 0) {\r\n      // 如果当前数字为零，则不处理\r\n      return "";\r\n    }\r\n\r\n    const unit = index % 4;\r\n    const unitChinese = chineseUnits[unit];\r\n    const isUnitFirst = index === 0 || (index > 0 && digit !== 1 && unit === 0);\r\n\r\n    return isUnitFirst ? digitChinese + unitChinese : digitChinese;\r\n  });\r\n\r\n  return chineseArray.reverse().join("");\r\n}',
    type: "ts",
    name: "numberToChinese",
    intro: "将数字转换为中文数字。",
  },
  {
    code: "\r\n\r\n/**\r\n * 将小驼峰命名转换为蛇形变量名称。\r\n *\r\n * @param {string} camelCase - 要转换的小驼峰命名字符串。\r\n * @returns {string} 转换后的蛇形变量名称。\r\n *\r\n * @example\r\n * ```js\r\n * camelToSnake('fooBar') // => 'foo_bar'\r\n * camelToSnake('fooBarBaz') // => 'foo_bar_baz'\r\n * camelToSnake('foo') // => 'foo'\r\n * ```\r\n */\r\nexport function camelToSnake(camelCase: string): string {\r\n  return camelCase.replace(/[A-Z]/g, function (match) {\r\n    return `_${match.toLowerCase()}`;\r\n  });\r\n}",
    type: "ts",
    name: "camelToSnake",
    intro: "将小驼峰命名转换为蛇形变量名称。",
  },
  {
    code: "\r\n\r\n/**\r\n * 将蛇形变量名称转换为小驼峰命名。\r\n *\r\n * @param {string} snakeCase - 要转换的蛇形变量名称。\r\n * @returns {string} 转换后的小驼峰命名。\r\n */\r\nexport function snakeToCamel(snakeCase: string): string {\r\n  return snakeCase.replace(/_([a-z])/g, function (_, char) {\r\n    return char.toUpperCase();\r\n  });\r\n}",
    type: "ts",
    name: "snakeToCamel",
    intro: "将蛇形变量名称转换为小驼峰命名。",
  },
  {
    code: '\r\n\r\n/**\r\n * 格式化数字，如果超过指定值则显示为指定值+。\r\n *\r\n * @param {string | number} value - 要格式化的数字。\r\n * @param {number} threshold - 阈值，超过该值则显示为该值+。默认值为 99。\r\n * @returns {string} 格式化后的字符串。\r\n */\r\nexport function formatNumber(value: string | number, threshold = 99): string {\r\n  const num = Number(value);\r\n\r\n  if (isNaN(num)) {\r\n    return "";\r\n  }\r\n\r\n  if (num > threshold) {\r\n    return `${threshold}+`;\r\n  }\r\n\r\n  return String(num);\r\n}',
    type: "ts",
    name: "formatNumber",
    intro: "格式化数字，如果超过指定值则显示为指定值+。",
  },
  {
    code: " isString isEmptyString\r\n\r\n/**\r\n * 将单词的首字母转为大写并返回，如果无法转为大写则返回原单词。\r\n *\r\n * @type {<T>(word: T) => T}\r\n * @param {T} word - 要处理的单词。\r\n * @returns {T} 首字母大写后的单词，如果无法转为大写或参数未提供则返回原单词。\r\n */\r\nexport function capitalize<T>(word: T): T {\r\n  if (isString(word) && !isEmptyString(word)) {\r\n    const firstChar = word.charAt(0).toUpperCase();\r\n    return (firstChar + word.slice(1)) as T;\r\n  }\r\n\r\n  return word;\r\n}",
    type: "ts",
    name: "capitalize",
    intro: "将单词的首字母转为大写并返回，如果无法转为大写则返回原单词。",
  },
  {
    code: "\n\n/**\n * 确保传入的方法只能被执行一次\n *\n * @param {(...args: any) => any} func - 要执行的方法。\n * @returns {(...args: any) => any} 返回一个新的方法，该方法只会执行一次\n */\nexport function once(fn: (...args: any) => any) {\n  // 利用闭包判断函数是否执行过\n  let called = false;\n  return function (this: unknown) {\n    if (!called) {\n      called = true;\n      return fn.apply(this, [...arguments]);\n    }\n  };\n}",
    type: "ts",
    name: "once",
    intro: "确保传入的方法只能被执行一次",
  },
  {
    code: "\n\ntype UnpackPromise<T> = T extends Promise<infer U> ? U : T;\n\n/**\n * 通用错误捕获函数，用于执行可能会抛出异常的函数，并捕获异常信息。\n *\n * @type {<F extends (...args: any) => any, R = UnpackPromise<ReturnType<F>>>(\n *   this: unknown,\n *   fn: F\n * ) => Promise<[0, R, null] | [1, null, unknown]>}\n * @param {F} fn - 可能会抛出异常的函数。\n * @returns {Promise<[0, R, null] | [1, null, unknown]>} 返回一个元组，包含错误标识、函数执行结果或 null 、异常信息或 null。\n */\nexport async function catchError<F extends (...args: any) => any, R = UnpackPromise<ReturnType<F>>>(\n  this: unknown,\n  fn: F\n): Promise<[0, R, null] | [1, null, unknown]> {\n  let data: R | null;\n  let err: 0 | 1;\n  let errMsg: unknown | null;\n\n  try {\n    data = await fn.apply(this, [...arguments]);\n    err = 0;\n    errMsg = null;\n    return [err, data as R, errMsg as null];\n  } catch (error) {\n    data = null;\n    err = 1;\n    errMsg = error;\n    return [err, data, errMsg];\n  }\n}",
    type: "ts",
    name: "catchError",
    intro: "通用错误捕获函数，用于执行可能会抛出异常的函数，并捕获异常信息。",
  },
  {
    code: '\n\ninterface TargetData<T> {\n  target: T;\n  parent: T | undefined;\n  layerIndexList: number[];\n  layerNodeList: T[];\n}/*======================================  findNodeByDFS -- start  ======================================*/\n\ninterface NodeProps<T extends Record<string, any>> {\n  arr: T[];\n  compareAttr: string;\n  nextLevelAttr: string;\n  value: unknown;\n  layerNodeList?: T[];\n  layerIndexList?: number[];\n}\n\nfunction findNode<T extends Record<string, any>>({\n  arr,\n  compareAttr,\n  nextLevelAttr,\n  value,\n  layerNodeList = [],\n  layerIndexList = [],\n}: NodeProps<T>): TargetData<T> | undefined {\n  for (let i = 0; i < arr.length; i++) {\n    const data = arr[i];\n\n    if (data[compareAttr] === value) {\n      const [parent] = layerNodeList.slice(-1);\n      return {\n        target: data,\n        layerIndexList: [...layerIndexList, i],\n        layerNodeList: [...layerNodeList, data],\n        parent,\n      };\n    }\n\n    const nextLevelList = data[nextLevelAttr];\n    if (Array.isArray(nextLevelList) && nextLevelList.length) {\n      const result = findNode({\n        arr: nextLevelList,\n        compareAttr,\n        nextLevelAttr,\n        value,\n        layerNodeList: [...layerNodeList, data],\n        layerIndexList: [...layerIndexList, i],\n      });\n      if (result) {\n        return result;\n      }\n    }\n  }\n\n  return undefined;\n}\n\n/**\n * 使用深度优先搜索算法递归查找指定属性值的节点，并返回匹配节点的数据、父级数据列表和层级关系。\n *\n * @type {<T extends Record<string, any>>(arr: T[], compareAttr: string, nextLevelAttr: string, value: unknown) => TargetData<T> | undefined}\n * @param {T[]} arr - 要进行搜索的数组。\n * @param {string} compareAttr - 需要查找的属性名。\n * @param {string} nextLevelAttr - 子级循环字段\n * @param {unknown} value - 需要查找的属性值。\n * @returns {TargetData<T> | undefined} 匹配节点的数据、父级数据列表和层级关系。\n */\nexport function findNodeByDFS<T extends Record<string, any>>(\n  arr: NodeProps<T>["arr"],\n  compareAttr: NodeProps<T>["compareAttr"],\n  nextLevelAttr: NodeProps<T>["nextLevelAttr"],\n  value: NodeProps<T>["value"]\n) {\n  return findNode<T>({ arr, compareAttr, nextLevelAttr, value });\n}',
    type: "ts",
    name: "findNodeByDFS",
    intro:
      "使用深度优先搜索算法递归查找指定属性值的节点，并返回匹配节点的数据、父级数据列表和层级关系。",
  },
  {
    code: "\n\n/*---------------------------------------  findNodeByDFS -- end  ---------------------------------------*/\n\n/**\n * 打平嵌套的树形结构数组，并为每个节点添加 level 和 parentId 字段。\n *\n * @type {<\n *   T extends { level?: never; parentId?: never; [key: string]: any; },\n *   P extends keyof T,\n *   ID extends keyof T,\n *   R = T & { level: number; parentId: T[ID] }\n * >(\n *   arr: T[],\n *   childrenProperty: P,\n *   idAttr: ID,\n *   includeParent?: boolean\n * ) => R[]}\n * @param {T[]} arr - 嵌套的树形结构数组。\n * @param {P} childrenProperty - 子节点属性的键名。\n * @param {ID} idAttr - 节点 ID 属性的键名。\n * @param {boolean} [includeParent=true] - 是否包含父节点，默认为 true。\n * @returns {R[]} 打平后的数组。\n */\nexport function flattenTreeArray<\n  T extends {\n    level?: never;\n    parentId?: never;\n    [key: string]: any;\n  },\n  P extends keyof T,\n  ID extends keyof T,\n  R = T & { level: number; parentId: T[ID] }\n>(arr: T[], childrenProperty: P, idAttr: ID, includeParent: boolean = true): R[] {\n  function flattenRecursive(nodes: T[], level: number, parentId: T[ID] | undefined): R[] {\n    return nodes.reduce((prev: R[], node: T) => {\n      const children: T[P] = node[childrenProperty];\n      const id: T[ID] = node[idAttr];\n      const flattenedNode: R = Object.assign(node, { level, parentId });\n\n      let childrenArray: R[] = [flattenedNode];\n      if (Array.isArray(children)) {\n        childrenArray = flattenRecursive(children, level + 1, id).concat(\n          includeParent ? flattenedNode : []\n        );\n      }\n\n      return prev.concat(childrenArray);\n    }, []);\n  }\n\n  return flattenRecursive(arr, 0, undefined);\n}",
    type: "ts",
    name: "flattenTreeArray",
    intro: "打平嵌套的树形结构数组，并为每个节点添加 level 和 parentId 字段。",
  },
  {
    code: " NOOP\n\n// #region ====================== 已重构的方法 ======================\n\n// 辅助类型，根据传入的节点类型 E 获取对应的事件类型映射\ntype EEventMap<E extends Node> = E extends HTMLElement\n  ? HTMLElementEventMap\n  : E extends Document\n  ? DocumentEventMap\n  : E extends Window\n  ? WindowEventMap\n  : GlobalEventHandlersEventMap;\n\n// 辅助类型，根据传入的节点类型 E 获取对应的事件处理函数类型\ntype EEventHandler<E extends Node, K extends keyof EEventMap<E>> = (\n  this: E,\n  ev: EEventMap<E>[K]\n) => any; NOOP\n\n/**\n * 给指定元素添加事件监听器，并返回一个函数用于移除监听器。\n *\n * @type {<E extends Node, K extends keyof EEventMap<E>>(\n *   element: E,\n *   event: K,\n *   handler: EEventHandler<E, K>,\n *   options?: boolean | AddEventListenerOptions\n * ) => typeof NOOP}\n * @param {E} element - 要添加事件监听器的元素。\n * @param {K} event - 要监听的事件类型。\n * @param {EEventHandler<E, K>} handler - 事件处理函数。\n * @param {boolean | AddEventListenerOptions} [options] - 可选的事件参数。\n * @returns {typeof NOOP} 一个函数，用于移除事件监听器。\n */\nexport function on<E extends Node, K extends keyof EEventMap<E>>(\n  element: E,\n  event: K,\n  handler: EEventHandler<E, K>,\n  options?: boolean | AddEventListenerOptions\n): typeof NOOP {\n  if (element && event && handler) {\n    element.addEventListener(\n      event as string,\n      handler as EventListenerOrEventListenerObject,\n      options\n    );\n    return () => {\n      element.removeEventListener(\n        event as string,\n        handler as EventListenerOrEventListenerObject,\n        options\n      );\n    };\n  }\n  return NOOP;\n}",
    type: "ts",
    name: "on",
    intro: "给指定元素添加事件监听器，并返回一个函数用于移除监听器。",
  },
  {
    code: ' NOOP off = ((): any => {\n  if (!isServer && Boolean(document.removeEventListener)) {\n    return (\n      element: Node,\n      event: string,\n      handler: EventListenerOrEventListenerObject,\n      options?: boolean | AddEventListenerOptions\n    ): any => {\n      if (element && event) {\n        element.removeEventListener(event, handler, options);\n      }\n    };\n  }\n  return (element: Node, event: string, handler: EventListenerOrEventListenerObject): any => {\n    if (element && event) {\n      (element as any).detachEvent(`on${event}`, handler);\n    }\n  };\n})() isServer = typeof window === "undefined"\n\n// #region ====================== 已重构的方法 ======================\n\n// 辅助类型，根据传入的节点类型 E 获取对应的事件类型映射\ntype EEventMap<E extends Node> = E extends HTMLElement\n  ? HTMLElementEventMap\n  : E extends Document\n  ? DocumentEventMap\n  : E extends Window\n  ? WindowEventMap\n  : GlobalEventHandlersEventMap;\n\n// 辅助类型，根据传入的节点类型 E 获取对应的事件处理函数类型\ntype EEventHandler<E extends Node, K extends keyof EEventMap<E>> = (\n  this: E,\n  ev: EEventMap<E>[K]\n) => any; NOOP off = ((): any => {\n  if (!isServer && Boolean(document.removeEventListener)) {\n    return (\n      element: Node,\n      event: string,\n      handler: EventListenerOrEventListenerObject,\n      options?: boolean | AddEventListenerOptions\n    ): any => {\n      if (element && event) {\n        element.removeEventListener(event, handler, options);\n      }\n    };\n  }\n  return (element: Node, event: string, handler: EventListenerOrEventListenerObject): any => {\n    if (element && event) {\n      (element as any).detachEvent(`on${event}`, handler);\n    }\n  };\n})()\n\n/**\n * 给指定元素添加事件监听器，并返回一个函数用于移除监听器。\n *\n * @type {<E extends Node, K extends keyof EEventMap<E>>(\n *   element: E,\n *   event: K,\n *   handler: EEventHandler<E, K>,\n *   options?: boolean | AddEventListenerOptions\n * ) => typeof NOOP}\n * @param {E} element - 要添加事件监听器的元素。\n * @param {K} event - 要监听的事件类型。\n * @param {EEventHandler<E, K>} handler - 事件处理函数。\n * @param {boolean | AddEventListenerOptions} [options] - 可选的事件参数。\n * @returns {typeof NOOP} 一个函数，用于移除事件监听器。\n */\nexport function on<E extends Node, K extends keyof EEventMap<E>>(\n  element: E,\n  event: K,\n  handler: EEventHandler<E, K>,\n  options?: boolean | AddEventListenerOptions\n): typeof NOOP {\n  if (element && event && handler) {\n    element.addEventListener(\n      event as string,\n      handler as EventListenerOrEventListenerObject,\n      options\n    );\n    return () => {\n      element.removeEventListener(\n        event as string,\n        handler as EventListenerOrEventListenerObject,\n        options\n      );\n    };\n  }\n  return NOOP;\n}\n\n/**\n * 为指定节点的指定事件绑定一个只执行一次的事件处理函数。\n * @type {<E extends Node, K extends keyof EEventMap<E>>(\n *   element: E,\n *   event: K,\n *   handler: EEventHandler<E, K>,\n *   options?: boolean | AddEventListenerOptions\n * ) => typeof NOOP}\n * @param {E} element - 要添加事件监听器的元素。\n * @param {K} event - 要监听的事件类型。\n * @param {EEventHandler<E, K>} handler - 事件处理函数。\n * @param {boolean | AddEventListenerOptions} [options] - 可选的事件参数。\n * @returns {typeof NOOP} 一个函数，用于移除事件监听器。\n */\nexport function once<E extends Node, K extends keyof EEventMap<E>>(\n  element: E,\n  event: K,\n  handler: EEventHandler<E, K>,\n  options?: boolean | AddEventListenerOptions\n): typeof NOOP {\n  const callback: EEventHandler<E, K> = function (e) {\n    handler.call(this, e);\n    off(element, event, callback, options);\n  };\n\n  on(element, event, callback, options);\n\n  return () => {\n    off(element, event, callback, options);\n  };\n}',
    type: "ts",
    name: "once - 1",
    intro: "为指定节点的指定事件绑定一个只执行一次的事件处理函数。",
  },
  {
    code: '\n\n/**\n * 获取指定节点对应的 HTMLElement 或 Element。\n *\n * @param {T} node - 可以是一个字符串选择器、一个 HTMLElement、或返回 HTMLElement 的函数。\n * @returns {HTMLElement | Element | undefined} 返回找到的 HTMLElement 或 Element，找不到则返回 undefined。\n */\nexport function getElement(\n  node: Element | HTMLElement | Function | string\n): HTMLElement | Element | undefined {\n  const attachNode = node instanceof Function ? node() : node;\n  if (!attachNode) {\n    return undefined;\n  }\n  if (typeof attachNode === "string") {\n    return document.querySelector(attachNode)!;\n  }\n  if (attachNode instanceof Element) {\n    return attachNode;\n  }\n  return undefined;\n}',
    type: "ts",
    name: "getElement",
    intro: "获取指定节点对应的 HTMLElement 或 Element。",
  },
  {
    code: '\n    /**\n     * Adds all arguments passed, except those already present.\n     *\n     * Throws a "SyntaxError" DOMException if one of the arguments is the empty string.\n     *\n     * Throws an "InvalidCharacterError" DOMException if one of the arguments contains any ASCII whitespace.\n     *\n     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/add)\n     */\n    add(...tokens: string[]): void; NOOP off = ((): any => {\n  if (!isServer && Boolean(document.removeEventListener)) {\n    return (\n      element: Node,\n      event: string,\n      handler: EventListenerOrEventListenerObject,\n      options?: boolean | AddEventListenerOptions\n    ): any => {\n      if (element && event) {\n        element.removeEventListener(event, handler, options);\n      }\n    };\n  }\n  return (element: Node, event: string, handler: EventListenerOrEventListenerObject): any => {\n    if (element && event) {\n      (element as any).detachEvent(`on${event}`, handler);\n    }\n  };\n})() isServer = typeof window === "undefined"\n    clean() {\n      offs.forEach((handler) => handler?.());\n      offs.length = 0;\n    }\n    /**\n     * Adds all arguments passed, except those already present.\n     *\n     * Throws a "SyntaxError" DOMException if one of the arguments is the empty string.\n     *\n     * Throws an "InvalidCharacterError" DOMException if one of the arguments contains any ASCII whitespace.\n     *\n     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/add)\n     */\n    add(...tokens: string[]): void;\n\n// #region ====================== 已重构的方法 ======================\n\n// 辅助类型，根据传入的节点类型 E 获取对应的事件类型映射\ntype EEventMap<E extends Node> = E extends HTMLElement\n  ? HTMLElementEventMap\n  : E extends Document\n  ? DocumentEventMap\n  : E extends Window\n  ? WindowEventMap\n  : GlobalEventHandlersEventMap;\n\n// 辅助类型，根据传入的节点类型 E 获取对应的事件处理函数类型\ntype EEventHandler<E extends Node, K extends keyof EEventMap<E>> = (\n  this: E,\n  ev: EEventMap<E>[K]\n) => any; NOOP off = ((): any => {\n  if (!isServer && Boolean(document.removeEventListener)) {\n    return (\n      element: Node,\n      event: string,\n      handler: EventListenerOrEventListenerObject,\n      options?: boolean | AddEventListenerOptions\n    ): any => {\n      if (element && event) {\n        element.removeEventListener(event, handler, options);\n      }\n    };\n  }\n  return (element: Node, event: string, handler: EventListenerOrEventListenerObject): any => {\n    if (element && event) {\n      (element as any).detachEvent(`on${event}`, handler);\n    }\n  };\n})() isServer = typeof window === "undefined"\n    clean() {\n      offs.forEach((handler) => handler?.());\n      offs.length = 0;\n    }\n    /**\n     * Adds all arguments passed, except those already present.\n     *\n     * Throws a "SyntaxError" DOMException if one of the arguments is the empty string.\n     *\n     * Throws an "InvalidCharacterError" DOMException if one of the arguments contains any ASCII whitespace.\n     *\n     * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/add)\n     */\n    add(...tokens: string[]): void;\n\n/**\n * 给指定元素添加事件监听器，并返回一个函数用于移除监听器。\n *\n * @type {<E extends Node, K extends keyof EEventMap<E>>(\n *   element: E,\n *   event: K,\n *   handler: EEventHandler<E, K>,\n *   options?: boolean | AddEventListenerOptions\n * ) => typeof NOOP}\n * @param {E} element - 要添加事件监听器的元素。\n * @param {K} event - 要监听的事件类型。\n * @param {EEventHandler<E, K>} handler - 事件处理函数。\n * @param {boolean | AddEventListenerOptions} [options] - 可选的事件参数。\n * @returns {typeof NOOP} 一个函数，用于移除事件监听器。\n */\nexport function on<E extends Node, K extends keyof EEventMap<E>>(\n  element: E,\n  event: K,\n  handler: EEventHandler<E, K>,\n  options?: boolean | AddEventListenerOptions\n): typeof NOOP {\n  if (element && event && handler) {\n    element.addEventListener(\n      event as string,\n      handler as EventListenerOrEventListenerObject,\n      options\n    );\n    return () => {\n      element.removeEventListener(\n        event as string,\n        handler as EventListenerOrEventListenerObject,\n        options\n      );\n    };\n  }\n  return NOOP;\n} off = ((): any => {\n  if (!isServer && Boolean(document.removeEventListener)) {\n    return (\n      element: Node,\n      event: string,\n      handler: EventListenerOrEventListenerObject,\n      options?: boolean | AddEventListenerOptions\n    ): any => {\n      if (element && event) {\n        element.removeEventListener(event, handler, options);\n      }\n    };\n  }\n  return (element: Node, event: string, handler: EventListenerOrEventListenerObject): any => {\n    if (element && event) {\n      (element as any).detachEvent(`on${event}`, handler);\n    }\n  };\n})()\n    clean() {\n      offs.forEach((handler) => handler?.());\n      offs.length = 0;\n    }\n\n/**\n * 创建一个用于管理事件监听器的工具函数\n * @param elm - 要添加事件监听器的元素引用\n * @returns 返回一个包含添加和清除事件监听器功能的对象\n */\nexport function attachListeners(elm: Element) {\n  const offs: Array<() => void> = [];\n  return {\n    add<K extends keyof GlobalEventHandlersEventMap>(\n      type: K,\n      listener: (ev: GlobalEventHandlersEventMap[K]) => void\n    ) {\n      if (!type) return;\n      on(elm, type, listener);\n      offs.push(() => {\n        off(elm, type, listener);\n      });\n    },\n    clean() {\n      offs.forEach((handler) => handler?.());\n      offs.length = 0;\n    },\n  };\n}',
    type: "ts",
    name: "attachListeners",
    intro: "创建一个用于管理事件监听器的工具函数",
  },
  {
    code: '\n\n/**\n * 检查元素是否包含指定的类名。\n * @param {Element} el - 要检查的元素\n * @param {string} cls - 要检查的类名\n * @returns {any} 如果元素包含指定类名则返回true，否则返回false\n */\nexport function hasClass(el: Element, cls: string): any {\n  if (!el || !cls) return false;\n  if (cls.indexOf(" ") !== -1) throw new Error("className should not contain space.");\n  if (el.classList) {\n    return el.classList.contains(cls);\n  }\n  return ` ${el.className} `.indexOf(` ${cls} `) > -1;\n}',
    type: "ts",
    name: "hasClass",
    intro: "检查元素是否包含指定的类名。",
  },
  {
    code: '\n\n/**\n * 检查元素是否包含指定的类名。\n * @param {Element} el - 要检查的元素\n * @param {string} cls - 要检查的类名\n * @returns {any} 如果元素包含指定类名则返回true，否则返回false\n */\nexport function hasClass(el: Element, cls: string): any {\n  if (!el || !cls) return false;\n  if (cls.indexOf(" ") !== -1) throw new Error("className should not contain space.");\n  if (el.classList) {\n    return el.classList.contains(cls);\n  }\n  return ` ${el.className} `.indexOf(` ${cls} `) > -1;\n}\n\n/**\n * 向元素添加一个或多个类名。\n * @param {Element} el - 要添加类名的元素\n * @param {string} cls - 要添加的类名，可以是多个类名以空格分隔\n */\nexport function addClass(el: Element, cls: string): any {\n  if (!el) return;\n  let curClass = el.className;\n  const classes = (cls || "").split(" ");\n\n  for (let i = 0, j = classes.length; i < j; i++) {\n    const clsName = classes[i];\n    if (!clsName) continue;\n\n    if (el.classList) {\n      el.classList.add(clsName);\n    } else if (!hasClass(el, clsName)) {\n      curClass += ` ${clsName}`;\n    }\n  }\n  if (!el.classList) {\n    el.className = curClass;\n  }\n}',
    type: "ts",
    name: "addClass",
    intro: "向元素添加一个或多个类名。",
  },
  {
    code: ' trim = (str: string): string => (str || "").replace(/^[\\s\\uFEFF]+|[\\s\\uFEFF]+$/g, "")\n\n/**\n * 检查元素是否包含指定的类名。\n * @param {Element} el - 要检查的元素\n * @param {string} cls - 要检查的类名\n * @returns {any} 如果元素包含指定类名则返回true，否则返回false\n */\nexport function hasClass(el: Element, cls: string): any {\n  if (!el || !cls) return false;\n  if (cls.indexOf(" ") !== -1) throw new Error("className should not contain space.");\n  if (el.classList) {\n    return el.classList.contains(cls);\n  }\n  return ` ${el.className} `.indexOf(` ${cls} `) > -1;\n} trim = (str: string): string => (str || "").replace(/^[\\s\\uFEFF]+|[\\s\\uFEFF]+$/g, "")\n\n/**\n * 从元素中移除一个或多个类名。\n * @param {Element} el - 要移除类名的元素\n * @param {string} cls - 要移除的类名，可以是多个类名以空格分隔\n */\nexport function removeClass(el: Element, cls: string): any {\n  if (!el || !cls) return;\n  const classes = cls.split(" ");\n  let curClass = ` ${el.className} `;\n\n  for (let i = 0, j = classes.length; i < j; i++) {\n    const clsName = classes[i];\n    if (!clsName) continue;\n\n    if (el.classList) {\n      el.classList.remove(clsName);\n    } else if (hasClass(el, clsName)) {\n      curClass = curClass.replace(` ${clsName} `, " ");\n    }\n  }\n  if (!el.classList) {\n    el.className = trim(curClass);\n  }\n}',
    type: "ts",
    name: "removeClass",
    intro: "从元素中移除一个或多个类名。",
  },
  {
    code: ' isServer = typeof window === "undefined"\n\ntype ScrollTarget = HTMLElement | Window | Document; isServer = typeof window === "undefined"\n\n/**\n * 检查对象是否为window对象。\n * @param {any} obj - 要检查的对象\n * @returns {boolean} 如果对象是window对象则返回true，否则返回false\n */\nfunction isWindow(obj: any) {\n  return obj && obj === obj.window;\n}\n\n/**\n * 获取指定滚动目标的滚动距离。\n * @param {ScrollTarget} target - 滚动目标\n * @param {boolean} [isLeft] - 是否获取水平方向的滚动距离，默认为垂直方向\n * @returns {number} 返回滚动距离\n */\nexport function getScroll(target: ScrollTarget, isLeft?: boolean): number {\n  // node环境或者target为空\n  if (isServer || !target) {\n    return 0;\n  }\n  const method = isLeft ? "scrollLeft" : "scrollTop";\n  let result = 0;\n  if (isWindow(target)) {\n    result = (target as Window)[isLeft ? "pageXOffset" : "pageYOffset"];\n  } else if (target instanceof Document) {\n    result = target.documentElement[method];\n  } else if (target) {\n    result = (target as HTMLElement)[method];\n  }\n  return result;\n}',
    type: "ts",
    name: "getScroll",
    intro: "获取指定滚动目标的滚动距离。",
  },
  {
    code: "\n    scrollTo(x: number, y: number): void;",
    type: "ts",
    name: "scrollTo",
    intro: "滚动到指定位置的异步函数。",
  },
  {
    code: "\n\n/**\n * 检查父元素是否包含子元素。\n * @param {Node} parent - 父元素\n * @param {any} child - 子元素\n * @returns {boolean} 如果父元素包含子元素则返回true，否则返回false\n */\nexport function containerDom(parent: Node, child: any): boolean {\n  if (parent && child) {\n    let pNode = child;\n    while (pNode) {\n      if (parent === pNode) {\n        return true;\n      }\n      pNode = pNode.parentNode;\n    }\n  }\n  return false;\n}",
    type: "ts",
    name: "containerDom",
    intro: "检查父元素是否包含子元素。",
  },
  {
    code: ' NOOP toArray\n\n// #region ====================== 已重构的方法 ======================\n\n// 辅助类型，根据传入的节点类型 E 获取对应的事件类型映射\ntype EEventMap<E extends Node> = E extends HTMLElement\n  ? HTMLElementEventMap\n  : E extends Document\n  ? DocumentEventMap\n  : E extends Window\n  ? WindowEventMap\n  : GlobalEventHandlersEventMap;\n\n// 辅助类型，根据传入的节点类型 E 获取对应的事件处理函数类型\ntype EEventHandler<E extends Node, K extends keyof EEventMap<E>> = (\n  this: E,\n  ev: EEventMap<E>[K]\n) => any; NOOP toArray\n\n/**\n * 给指定元素添加事件监听器，并返回一个函数用于移除监听器。\n *\n * @type {<E extends Node, K extends keyof EEventMap<E>>(\n *   element: E,\n *   event: K,\n *   handler: EEventHandler<E, K>,\n *   options?: boolean | AddEventListenerOptions\n * ) => typeof NOOP}\n * @param {E} element - 要添加事件监听器的元素。\n * @param {K} event - 要监听的事件类型。\n * @param {EEventHandler<E, K>} handler - 事件处理函数。\n * @param {boolean | AddEventListenerOptions} [options] - 可选的事件参数。\n * @returns {typeof NOOP} 一个函数，用于移除事件监听器。\n */\nexport function on<E extends Node, K extends keyof EEventMap<E>>(\n  element: E,\n  event: K,\n  handler: EEventHandler<E, K>,\n  options?: boolean | AddEventListenerOptions\n): typeof NOOP {\n  if (element && event && handler) {\n    element.addEventListener(\n      event as string,\n      handler as EventListenerOrEventListenerObject,\n      options\n    );\n    return () => {\n      element.removeEventListener(\n        event as string,\n        handler as EventListenerOrEventListenerObject,\n        options\n      );\n    };\n  }\n  return NOOP;\n} toArray\n\n/**\n * 检查父元素是否包含子元素。\n * @param {Node} parent - 父元素\n * @param {any} child - 子元素\n * @returns {boolean} 如果父元素包含子元素则返回true，否则返回false\n */\nexport function containerDom(parent: Node, child: any): boolean {\n  if (parent && child) {\n    let pNode = child;\n    while (pNode) {\n      if (parent === pNode) {\n        return true;\n      }\n      pNode = pNode.parentNode;\n    }\n  }\n  return false;\n}\n\n/**\n * 监听点击事件，当点击元素在指定元素之外时执行回调函数。\n * @param {Element | Iterable<any> | ArrayLike<any>} els - 指定的元素或元素集合\n * @param {() => void} cb - 点击元素在指定元素之外时执行的回调函数\n * @returns {() => void} 一个函数，用于销毁监听事件。\n */\n\nexport function clickOut(els: Element | Element[], cb: () => void) {\n  return on(document, "click", (event) => {\n    const _els = toArray(els);\n    const isFlag = _els.every((item) => !containerDom(item, event.target));\n    return isFlag && cb && cb();\n  });\n}',
    type: "ts",
    name: "clickOut",
    intro: "监听点击事件，当点击元素在指定元素之外时执行回调函数。",
  },
  {
    code: ' NOOP toArray NOOP\n\n// #region ====================== 已重构的方法 ======================\n\n// 辅助类型，根据传入的节点类型 E 获取对应的事件类型映射\ntype EEventMap<E extends Node> = E extends HTMLElement\n  ? HTMLElementEventMap\n  : E extends Document\n  ? DocumentEventMap\n  : E extends Window\n  ? WindowEventMap\n  : GlobalEventHandlersEventMap;\n\n// 辅助类型，根据传入的节点类型 E 获取对应的事件处理函数类型\ntype EEventHandler<E extends Node, K extends keyof EEventMap<E>> = (\n  this: E,\n  ev: EEventMap<E>[K]\n) => any; toArray NOOP\n\n/**\n * 给指定元素添加事件监听器，并返回一个函数用于移除监听器。\n *\n * @type {<E extends Node, K extends keyof EEventMap<E>>(\n *   element: E,\n *   event: K,\n *   handler: EEventHandler<E, K>,\n *   options?: boolean | AddEventListenerOptions\n * ) => typeof NOOP}\n * @param {E} element - 要添加事件监听器的元素。\n * @param {K} event - 要监听的事件类型。\n * @param {EEventHandler<E, K>} handler - 事件处理函数。\n * @param {boolean | AddEventListenerOptions} [options] - 可选的事件参数。\n * @returns {typeof NOOP} 一个函数，用于移除事件监听器。\n */\nexport function on<E extends Node, K extends keyof EEventMap<E>>(\n  element: E,\n  event: K,\n  handler: EEventHandler<E, K>,\n  options?: boolean | AddEventListenerOptions\n): typeof NOOP {\n  if (element && event && handler) {\n    element.addEventListener(\n      event as string,\n      handler as EventListenerOrEventListenerObject,\n      options\n    );\n    return () => {\n      element.removeEventListener(\n        event as string,\n        handler as EventListenerOrEventListenerObject,\n        options\n      );\n    };\n  }\n  return NOOP;\n} toArray\n\n/**\n * 检查父元素是否包含子元素。\n * @param {Node} parent - 父元素\n * @param {any} child - 子元素\n * @returns {boolean} 如果父元素包含子元素则返回true，否则返回false\n */\nexport function containerDom(parent: Node, child: any): boolean {\n  if (parent && child) {\n    let pNode = child;\n    while (pNode) {\n      if (parent === pNode) {\n        return true;\n      }\n      pNode = pNode.parentNode;\n    }\n  }\n  return false;\n}\n\nexport function clickOutInWebComponent({\n  els,\n  cb,\n  root,\n}: {\n  els: Element | Iterable<any> | ArrayLike<any> | Function;\n  cb: () => void;\n  root: Node;\n  [key: string]: any;\n}): typeof NOOP {\n  // let doc, root;\n  on(root, "click", (event) => {\n    const _els = toArray(els).filter(Boolean);\n    const protect = _els.some((item) => containerDom(item?.() ?? item, event.target));\n    return !protect && cb();\n  });\n\n  if (root !== document) {\n    on(document, "click", (e) => {\n      if (!(e.target instanceof HTMLElement)) return;\n\n      const clickRoot = e.target.shadowRoot;\n      if (clickRoot !== root) {\n        cb();\n      }\n    });\n  }\n\n  return () => {};\n}',
    type: "ts",
    name: "clickOutInWebComponent",
  },
  {
    code: "\n\n/**\n * 检查元素是否在视口内。\n * @see {@link http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport}\n * @param {HTMLElement} elm - 要检查的元素\n * @param {HTMLElement} [parent] - 可选的父级元素\n * @returns {boolean} 如果元素在视口内则返回true，否则返回false\n */\nexport function elementInViewport(elm: HTMLElement, parent?: HTMLElement): boolean {\n  const rect = elm.getBoundingClientRect();\n  if (parent) {\n    const parentRect = parent.getBoundingClientRect();\n    return (\n      rect.top >= parentRect.top &&\n      rect.left >= parentRect.left &&\n      rect.bottom <= parentRect.bottom &&\n      rect.right <= parentRect.right\n    );\n  }\n  return (\n    rect.top >= 0 &&\n    rect.left >= 0 &&\n    rect.bottom + 80 <= window.innerHeight &&\n    rect.right <= window.innerWidth\n  );\n}",
    type: "ts",
    name: "elementInViewport",
    intro: "检查元素是否在视口内。",
  },
  {
    code: '\n\n/**\n * 获取元素的指定CSS属性值。\n * @param {HTMLElement} element - 要获取属性值的元素\n * @param {string} propName - CSS属性名\n * @returns {string} 返回指定CSS属性的值（小写形式）\n */\nexport function getElmCssPropValue(element: HTMLElement, propName: string): string {\n  let propValue = "";\n\n  if (document.defaultView && document.defaultView.getComputedStyle) {\n    propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);\n  }\n\n  if (propValue && propValue.toLowerCase) {\n    return propValue.toLowerCase();\n  }\n\n  return propValue;\n}',
    type: "ts",
    name: "getElmCssPropValue",
    intro: "获取元素的指定CSS属性值。",
  },
  {
    code: '\n\n/**\n * 获取元素的指定CSS属性值。\n * @param {HTMLElement} element - 要获取属性值的元素\n * @param {string} propName - CSS属性名\n * @returns {string} 返回指定CSS属性的值（小写形式）\n */\nexport function getElmCssPropValue(element: HTMLElement, propName: string): string {\n  let propValue = "";\n\n  if (document.defaultView && document.defaultView.getComputedStyle) {\n    propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);\n  }\n\n  if (propValue && propValue.toLowerCase) {\n    return propValue.toLowerCase();\n  }\n\n  return propValue;\n}\n\n/**\n * 判断元素是否处在 position fixed 中\n * @param {HTMLElement} element - 要检查的元素\n * @returns {boolean} 如果元素具有固定定位则返回true，否则返回false\n */\nexport function isFixed(element: HTMLElement): boolean {\n  const p = element.parentNode as HTMLElement;\n\n  if (!p || p.nodeName === "HTML") {\n    return false;\n  }\n\n  if (getElmCssPropValue(element, "position") === "fixed") {\n    return true;\n  }\n\n  return isFixed(p);\n}',
    type: "ts",
    name: "isFixed",
    intro: "判断元素是否处在 position fixed 中",
  },
  {
    code: "\n\n/**\n * 获取当前视图滑动的距离\n * @returns {{ scrollTop: number; scrollLeft: number }} 返回窗口的滚动位置信息\n */\nexport function getWindowScroll(): { scrollTop: number; scrollLeft: number } {\n  const { body } = document;\n  const docElm = document.documentElement;\n  const scrollTop = window.pageYOffset || docElm.scrollTop || body.scrollTop;\n  const scrollLeft = window.pageXOffset || docElm.scrollLeft || body.scrollLeft;\n\n  return { scrollTop, scrollLeft };\n}",
    type: "ts",
    name: "getWindowScroll",
    intro: "获取当前视图滑动的距离",
  },
  {
    code: "\n\n/**\n * 获取窗口的尺寸。\n * @returns {{ width: number; height: number }} 返回窗口的宽度和高度\n */\nexport function getWindowSize(): { width: number; height: number } {\n  if (window.innerWidth !== undefined) {\n    return { width: window.innerWidth, height: window.innerHeight };\n  }\n  const doc = document.documentElement;\n  return { width: doc.clientWidth, height: doc.clientHeight };\n}",
    type: "ts",
    name: "getWindowSize",
    intro: "获取窗口的尺寸。",
  },
  {
    code: '\n\n/**\n * 获取浏览器滚动条的宽度。\n * @description 新建一个带有滚动条的 div 元素，通过该元素的 offsetWidth 和 clientWidth 的差值即可获得\n * @returns {number} 返回浏览器滚动条的宽度\n */\nexport function getScrollbarWidth() {\n  const scrollDiv = document.createElement("div");\n  scrollDiv.style.cssText =\n    "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;";\n  document.body.appendChild(scrollDiv);\n  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;\n  document.body.removeChild(scrollDiv);\n  return scrollbarWidth;\n}',
    type: "ts",
    name: "getScrollbarWidth",
    intro: "获取浏览器滚动条的宽度。",
  },
  {
    code: " NOOP\n\n/**\n * 监听DOM节点大小变化\n * @param {Element} targetNode - 要监听的DOM节点\n * @param {SizeChangeCallback} callback - 节点大小变化时的回调函数\n * @returns {() => void} 返回一个取消监听的方法\n */\nexport function observeNodeSizeChange(\n  targetNode: Element,\n  callback: (rect: DOMRectReadOnly, entry: ResizeObserverEntry) => unknown\n): typeof NOOP {\n  // 创建一个ResizeObserver实例并将回调函数传入\n  const resizeObserver = new ResizeObserver(([entry]) => {\n    callback(entry.contentRect, entry);\n  });\n\n  // 开始观察目标节点的大小变化\n  resizeObserver.observe(targetNode);\n\n  // 返回一个取消观察的方法\n  return () => {\n    resizeObserver.unobserve(targetNode);\n    resizeObserver.disconnect();\n  };\n}",
    type: "ts",
    name: "observeNodeSizeChange",
    intro: "监听DOM节点大小变化",
  },
  {
    code: '\n\nexport function copyText(text: string) {\n  const div = document.createElement("div");\n  const clip = new Clipboard(div, {\n    text() {\n      return text;\n    },\n  });\n  div.click();\n  clip.destroy();\n  div.remove();\n}',
    type: "ts",
    name: "copyText",
  },
  {
    code: "/**\n * @file\n * 缓动函数\n * 参考自: https://github.com/bameyrick/js-easing-functions/blob/master/src/index.ts\n */\n\nexport interface EasingFunction {\n  (current: number, start: number, end: number, duration: number): number;\n}",
    type: "ts",
    name: "EasingFunction",
  },
  {
    code: '\r\n\r\n/**\r\n * 获取给定内容插入到指定 DOM 节点后，该节点在父容器中占据的行数。\r\n *\r\n * @param {HTMLElement} parent - 父容器 DOM 节点。\r\n * @param {string | HTMLElement} content - 要插入的内容。\r\n * @param {HTMLElement | null} [insertBefore=null] - 要插入在哪个 DOM 节点之前，默认为 null，表示插入到末尾。\r\n * @returns {number} 插入内容后节点在父容器中占据的行数。\r\n */\r\nexport function getLinesCountAfterInsertion<C = string | HTMLElement>(\r\n  parent: HTMLElement,\r\n  content: C,\r\n  insertBefore: HTMLElement | null = null\r\n): number {\r\n  let clone: string | HTMLElement = document.createElement("div");\r\n  if (typeof content === "string") {\r\n    clone.innerHTML = content;\r\n  } else if (content instanceof HTMLElement) {\r\n    clone = content;\r\n  }\r\n  clone.style.cssText = "visibility: hidden;";\r\n\r\n  parent.insertBefore(clone, insertBefore);\r\n  const lineHeight = parseFloat(getComputedStyle(clone).lineHeight);\r\n  const clientHeight = clone.clientHeight;\r\n  parent.removeChild(clone);\r\n\r\n  return Math.ceil(clientHeight / lineHeight);\r\n}',
    type: "ts",
    name: "getLinesCountAfterInsertion",
    intro: "获取给定内容插入到指定 DOM 节点后，该节点在父容器中占据的行数。",
  },
  {
    code: '\r\n\r\n/**\r\n * 获取给定图片链接的宽度和高度。\r\n *\r\n * @param {string} imageUrl - 图片链接。\r\n * @returns {Promise<{ width: number; height: number }>} 返回一个 Promise，解析为包含宽度和高度的对象 { width, height }。\r\n */\r\nexport function getImageSize(imageUrl: string): Promise<{ width: number; height: number }> {\r\n  return new Promise((resolve, reject) => {\r\n    const image = new Image();\r\n    image.onload = () => {\r\n      resolve({ width: image.width, height: image.height });\r\n    };\r\n    image.onerror = () => {\r\n      reject(new Error("Failed to load image."));\r\n    };\r\n    image.src = imageUrl;\r\n  });\r\n}',
    type: "ts",
    name: "getImageSize",
    intro: "获取给定图片链接的宽度和高度。",
  },
  {
    code: ' toArray\r\n\r\n/**\r\n * 监听鼠标点击事件，如果点击事件不包含指定的元素，则触发回调函数，并返回一个销毁监听事件的方法。\r\n *\r\n * @param {string | Element | undefined | (string | Element | undefined)[]} target - 要监听的目标元素或元素数组。\r\n * @param {() => void} callback - 鼠标点击事件不包含目标元素时触发的回调函数。\r\n * @returns {() => void} 一个函数，用于销毁监听事件。\r\n */\r\nexport function listenClickOutside<T extends string | Element | undefined>(\r\n  target: T | T[],\r\n  callback: () => void\r\n): () => void {\r\n  function getEls(target: any): Element[] {\r\n    if (typeof target === "string") {\r\n      return [...document.querySelectorAll(target)].filter(Boolean);\r\n    } else if (target instanceof Element) {\r\n      return toArray(target);\r\n    } else if (Array.isArray(target)) {\r\n      return target.map((i) => getEls(i)).flat();\r\n    }\r\n\r\n    return [];\r\n  }\r\n\r\n  const handleClickOutside = (event: MouseEvent) => {\r\n    const els = getEls(target).filter((el) => el instanceof Element);\r\n    const isClickOutside = els.every((target) => !target.contains(event.target as Node));\r\n    if (isClickOutside) {\r\n      callback();\r\n    }\r\n  };\r\n\r\n  document.addEventListener("click", handleClickOutside);\r\n\r\n  return () => {\r\n    document.removeEventListener("click", handleClickOutside);\r\n  };\r\n}',
    type: "ts",
    name: "listenClickOutside",
    intro:
      "监听鼠标点击事件，如果点击事件不包含指定的元素，则触发回调函数，并返回一个销毁监听事件的方法。",
  },
  {
    code: '\r\n\r\n/**\r\n * 下载一个 Blob 对象作为指定文件名的文件。\r\n *\r\n * @param {string} url - 要下载的文件链接\r\n * @param {string} [fileName=""] - 要保存的文件名。\r\n */\r\nexport function downloadFileByUrl(url: string, fileName: string = ""): void {\r\n  const downloadLink = document.createElement("a");\r\n  downloadLink.href = url;\r\n  downloadLink.download = fileName;\r\n  downloadLink.click();\r\n  downloadLink.remove();\r\n}',
    type: "ts",
    name: "downloadFileByUrl",
    intro: "下载一个 Blob 对象作为指定文件名的文件。",
  },
  {
    code: '\r\n\r\n/**\r\n * 下载一个 Blob 对象作为指定文件名的文件。\r\n *\r\n * @param {string} url - 要下载的文件链接\r\n * @param {string} [fileName=""] - 要保存的文件名。\r\n */\r\nexport function downloadFileByUrl(url: string, fileName: string = ""): void {\r\n  const downloadLink = document.createElement("a");\r\n  downloadLink.href = url;\r\n  downloadLink.download = fileName;\r\n  downloadLink.click();\r\n  downloadLink.remove();\r\n}\r\n\r\n/**\r\n * 下载一个 Blob 对象作为指定文件名的文件。\r\n *\r\n * @param {Blob} blob - 要下载的 Blob 对象。\r\n * @param {string} [fileName=""] - 要保存的文件名。\r\n */\r\nexport function downloadFileByBlob(blob: Blob, fileName: string = ""): void {\r\n  const url = URL.createObjectURL(blob);\r\n  downloadFileByUrl(url, fileName);\r\n  URL.revokeObjectURL(url);\r\n}',
    type: "ts",
    name: "downloadFileByBlob",
    intro: "下载一个 Blob 对象作为指定文件名的文件。",
  },
  {
    code: '\r\n\r\n/**\r\n * 下载文件。\r\n *\r\n * @param {Blob | string} src - 要下载的资源（可以是字符串或 Blob 对象）\r\n * @param {string} [fileName=""] - 要保存的文件名。\r\n */\r\nexport function downloadFile(src: Blob | string, fileName: string = ""): void {\r\n  let url;\r\n  if (typeof src === "string") {\r\n    url = src;\r\n  } else {\r\n    url = URL.createObjectURL(src);\r\n  }\r\n\r\n  const downloadLink = document.createElement("a");\r\n  downloadLink.href = url;\r\n  downloadLink.download = fileName;\r\n  downloadLink.click();\r\n  downloadLink.remove();\r\n\r\n  URL.revokeObjectURL(url);\r\n}',
    type: "ts",
    name: "downloadFile",
    intro: "下载文件。",
  },
  {
    code: ' toArray isHasObject\r\n\r\n/**\r\n * 动态加载一组 JavaScript 文件。\r\n *\r\n * @param {string | string[]} files - 要加载的 JavaScript 文件数组。\r\n * @param {Pick<Partial<HTMLScriptElement>, "type" | "async">} [config] - 配置选项，可选。\r\n * @returns {Promise<void[]>} 返回一个 Promise，在所有文件加载完成后解析。\r\n */\r\nexport function loadJS(\r\n  files: string | string[],\r\n  config?: Pick<Partial<HTMLScriptElement>, "type" | "async">\r\n): Promise<void[]> {\r\n  // 获取head标签\r\n  const head = document.getElementsByTagName("head")[0];\r\n\r\n  files = toArray(files);\r\n\r\n  // 使用 Promise.all 并行加载所有文件\r\n  return Promise.all(\r\n    files.map((file) => {\r\n      return new Promise<void>((resolve, reject) => {\r\n        // 创建script标签并添加到head\r\n        const scriptElement = document.createElement("script");\r\n        scriptElement.type = "text/javascript";\r\n        scriptElement.async = true;\r\n        scriptElement.src = file;\r\n\r\n        // 添加自定义属性\r\n        if (isHasObject(config)) {\r\n          Object.entries(config).forEach(([key, val]) => {\r\n            scriptElement.setAttribute(key, String(val));\r\n          });\r\n        }\r\n\r\n        // 监听load事件，如果加载完成则resolve\r\n        scriptElement.addEventListener("load", () => resolve(), false);\r\n\r\n        // 监听error事件，如果加载失败则reject\r\n        scriptElement.addEventListener(\r\n          "error",\r\n          () => reject(new Error(`Failed to load script: ${file}`)),\r\n          false\r\n        );\r\n\r\n        head.appendChild(scriptElement);\r\n      });\r\n    })\r\n  );\r\n}',
    type: "ts",
    name: "loadJS",
    intro: "动态加载一组 JavaScript 文件。",
  },
];
// codeList -- end
