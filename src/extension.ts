import * as vscode from "vscode";

interface CodeInfoProps {
  type: "css" | "js";
  code: string;
  name: string;
}

export async function activate(context: vscode.ExtensionContext) {
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

  const optionsCommand = ["css", "js"].map((type) =>
    vscode.commands.registerCommand(
      `fe-integration.${type}.options`,
      async () => {
        const options = codeList
          .filter((item) => item.type === type)
          .map((item) => item.name);

        const selectedOption = await vscode.window.showQuickPick(options, {
          title: "生成代码",
          placeHolder: "Choose an option",
        });

        if (selectedOption) {
          vscode.commands.executeCommand(
            `fe-integration.${type}.${selectedOption}`
          );
        }
      }
    )
  );

  context.subscriptions.push(...optionsCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}

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
    "code": "/* 多行文本溢出隐藏 */\n.multi-line-overflow-ellipsis {\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  /* 设置显示行数 */\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n",
    "type": "css",
    "name": "multi-line-overflow-ellipsis"
  },
  {
    "code": "function camelToSnake(camelCase) {\n  return camelCase.replace(/[A-Z]/g, function (match) {\n    return `_${ match.toLowerCase() }`;\n  });\n}",
    "type": "js",
    "name": "camelToSnake"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isString(value) {\n  return getType(value) === 'String';\n}\nfunction isEmptyString(value) {\n  return isString(value) && value.length === 0;\n}\nfunction capitalize(word) {\n  if (isString(word) && !isEmptyString(word)) {\n    const firstChar = word.charAt(0).toUpperCase();\n    return firstChar + word.slice(1);\n  }\n  return word;\n}",
    "type": "js",
    "name": "capitalize"
  },
  {
    "code": "async function catchError(fn) {\n  let data;\n  let err = 1;\n  let errMsg = null;\n  try {\n    data = await fn.apply(this, arguments);\n  } catch (error) {\n    data = null;\n    err = 1;\n    errMsg = error;\n  }\n  return [\n    err,\n    data,\n    errMsg\n  ];\n}",
    "type": "js",
    "name": "catchError"
  },
  {
    "code": "function clampNumberWithinRange(numberToClamp, range) {\n  const [min, max] = range;\n  return Math.max(min, Math.min(numberToClamp, max));\n}",
    "type": "js",
    "name": "clampNumberWithinRange"
  },
  {
    "code": "function formatNumber(value, threshold = 99) {\n  const num = Number(value);\n  if (isNaN(num)) {\n    return '';\n  }\n  if (num > threshold) {\n    return `${ threshold }+`;\n  }\n  return String(num);\n}",
    "type": "js",
    "name": "formatNumber"
  },
  {
    "code": "function formatPrice(value, decimalPlaces = -1) {\n  const numberValue = typeof value === 'number' ? value : parseFloat(value);\n  if (isNaN(numberValue)) {\n    return value.toString();\n  }\n  const options = {\n    minimumFractionDigits: decimalPlaces >= 0 ? decimalPlaces : 0,\n    maximumFractionDigits: decimalPlaces >= 0 ? decimalPlaces : 2\n  };\n  return numberValue.toLocaleString(void 0, options);\n}",
    "type": "js",
    "name": "formatPrice"
  },
  {
    "code": "function generateRandomString(length = 8) {\n  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';\n  let randomString = '';\n  for (let i = 0; i < length; i++) {\n    const randomIndex = Math.floor(Math.random() * characters.length);\n    randomString += characters[randomIndex];\n  }\n  return randomString;\n}",
    "type": "js",
    "name": "generateRandomString"
  },
  {
    "code": "function getArrayIntersection(arr1, arr2, key) {\n  if (key) {\n    const set = new Set(arr1.map(item => item[key]));\n    return arr2.filter(item => set.has(item[key]));\n  }\n  return arr1.filter(item => arr2.includes(item));\n}",
    "type": "js",
    "name": "getArrayIntersection"
  },
  {
    "code": "function getBasename(path) {\n  const match = path.match(/\\/([^\\/]+)$/);\n  return match ? match[1] : path;\n}",
    "type": "js",
    "name": "getBasename"
  },
  {
    "code": "const getFileExtension = filename => {\n  return filename.slice(filename.lastIndexOf('.') + 1);\n};",
    "type": "js",
    "name": "getFileExtension"
  },
  {
    "code": "function getBasename(path) {\n  const match = path.match(/\\/([^\\/]+)$/);\n  return match ? match[1] : path;\n}\nfunction getFileName(fileName) {\n  const name = getBasename(fileName);\n  const lastDotIndex = name.lastIndexOf('.');\n  if (lastDotIndex === -1) {\n    return name;\n  }\n  return name.slice(0, lastDotIndex);\n}",
    "type": "js",
    "name": "getFileName"
  },
  {
    "code": "function isArray(value) {\n  return Array.isArray(value);\n}",
    "type": "js",
    "name": "isArray"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isBlob(value) {\n  return getType(value) === 'Blob';\n}",
    "type": "js",
    "name": "isBlob"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isBoolean(value) {\n  return getType(value) === 'Boolean';\n}",
    "type": "js",
    "name": "isBoolean"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isDate(value) {\n  return getType(value) === 'Date';\n}",
    "type": "js",
    "name": "isDate"
  },
  {
    "code": "function isDef(value) {\n  return typeof value !== 'undefined';\n}",
    "type": "js",
    "name": "isDef"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isUndefined(value) {\n  return getType(value) === 'Undefined';\n}\nfunction isNull(value) {\n  return getType(value) === 'Null';\n}\nfunction isString(value) {\n  return getType(value) === 'String';\n}\nfunction isObject(value) {\n  return getType(value) === 'Object';\n}\nfunction isEmptyString(value) {\n  return isString(value) && value.length === 0;\n}\nfunction isEmpty(value) {\n  return isUndefined(value) || isNull(value) || isEmptyArray(value) || isEmptyObject(value) || isEmptyString(value);\n}\nfunction isEmptyObject(value) {\n  return isObject(value) && !isNull(value) && Object.keys(value).length === 0;\n}\nfunction isEmptyArray(value) {\n  return Array.isArray(value) && value.length === 0;\n}",
    "type": "js",
    "name": "isEmpty"
  },
  {
    "code": "function isEmptyArray(value) {\n  return Array.isArray(value) && value.length === 0;\n}",
    "type": "js",
    "name": "isEmptyArray"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isNull(value) {\n  return getType(value) === 'Null';\n}\nfunction isObject(value) {\n  return getType(value) === 'Object';\n}\nfunction isEmptyObject(value) {\n  return isObject(value) && !isNull(value) && Object.keys(value).length === 0;\n}",
    "type": "js",
    "name": "isEmptyObject"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isString(value) {\n  return getType(value) === 'String';\n}\nfunction isEmptyString(value) {\n  return isString(value) && value.length === 0;\n}",
    "type": "js",
    "name": "isEmptyString"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isError(value) {\n  return getType(value) === 'Error';\n}",
    "type": "js",
    "name": "isError"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isFunction(value) {\n  return getType(value) === 'Function';\n}",
    "type": "js",
    "name": "isFunction"
  },
  {
    "code": "function isHasArray(value) {\n  return Array.isArray(value) && value.length > 0;\n}",
    "type": "js",
    "name": "isHasArray"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isObject(value) {\n  return getType(value) === 'Object';\n}\nfunction isHasObject(value) {\n  return isObject(value) && Object.keys(value).length > 0;\n}",
    "type": "js",
    "name": "isHasObject"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isString(value) {\n  return getType(value) === 'String';\n}\nfunction isHasString(value) {\n  return isString(value) && value.length > 0;\n}",
    "type": "js",
    "name": "isHasString"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isMap(value) {\n  return getType(value) === 'Map';\n}",
    "type": "js",
    "name": "isMap"
  },
  {
    "code": "function isNullOrUndefined(value) {\n  return value === void 0 || value === null;\n}\nfunction isNonNullable(value) {\n  return !isNullOrUndefined(value);\n}",
    "type": "js",
    "name": "isNonNullable"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isNull(value) {\n  return getType(value) === 'Null';\n}",
    "type": "js",
    "name": "isNull"
  },
  {
    "code": "function isNullOrUndefined(value) {\n  return value === void 0 || value === null;\n}",
    "type": "js",
    "name": "isNullOrUndefined"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isNumber(value) {\n  return getType(value) === 'Number';\n}",
    "type": "js",
    "name": "isNumber"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isObject(value) {\n  return getType(value) === 'Object';\n}",
    "type": "js",
    "name": "isObject"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isPromise(value) {\n  return getType(value) === 'Promise';\n}",
    "type": "js",
    "name": "isPromise"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isRegExp(value) {\n  return getType(value) === 'RegExp';\n}",
    "type": "js",
    "name": "isRegExp"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isSet(value) {\n  return getType(value) === 'Set';\n}",
    "type": "js",
    "name": "isSet"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isString(value) {\n  return getType(value) === 'String';\n}",
    "type": "js",
    "name": "isString"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isSymbol(value) {\n  return getType(value) === 'Symbol';\n}",
    "type": "js",
    "name": "isSymbol"
  },
  {
    "code": "function isTargetInOptions(target, ...options) {\n  return options.some(option => {\n    if (Array.isArray(option)) {\n      return option.some(item => item === target);\n    }\n    return option === target;\n  });\n}",
    "type": "js",
    "name": "isTargetInOptions"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isUndefined(value) {\n  return getType(value) === 'Undefined';\n}",
    "type": "js",
    "name": "isUndefined"
  },
  {
    "code": "function isValueInRange(value, range) {\n  const [min, max] = range;\n  return value >= min && value <= max;\n}",
    "type": "js",
    "name": "isValueInRange"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isWindow(value) {\n  return typeof window !== 'undefined' && getType(value) === 'Window';\n}",
    "type": "js",
    "name": "isWindow"
  },
  {
    "code": "function numberToChinese(value) {\n  const numberValue = typeof value === 'number' ? value.toString() : value;\n  const chineseDigits = [\n    '零',\n    '一',\n    '二',\n    '三',\n    '四',\n    '五',\n    '六',\n    '七',\n    '八',\n    '九'\n  ];\n  const chineseUnits = [\n    '',\n    '十',\n    '百',\n    '千',\n    '万',\n    '亿'\n  ];\n  const numArray = Array.from(numberValue).reverse();\n  const chineseArray = numArray.map((num, index) => {\n    const digit = parseInt(num);\n    const digitChinese = chineseDigits[digit];\n    if (digit === 0) {\n      return '';\n    }\n    const unit = index % 4;\n    const unitChinese = chineseUnits[unit];\n    const isUnitFirst = index === 0 || index > 0 && digit !== 1 && unit === 0;\n    return isUnitFirst ? digitChinese + unitChinese : digitChinese;\n  });\n  return chineseArray.reverse().join('');\n}",
    "type": "js",
    "name": "numberToChinese"
  },
  {
    "code": "function omit(obj, keys) {\n  const clone = { ...obj };\n  keys.forEach(key => delete clone[key]);\n  return clone;\n}",
    "type": "js",
    "name": "omit"
  },
  {
    "code": "function once(fn) {\n  let called = false;\n  return function () {\n    if (!called) {\n      called = true;\n      return fn.apply(this, arguments);\n    }\n  };\n}",
    "type": "js",
    "name": "once"
  },
  {
    "code": "function pick(obj, keys) {\n  const pickedObject = {};\n  keys.forEach(key => {\n    if (obj.hasOwnProperty(key)) {\n      pickedObject[key] = obj[key];\n    }\n  });\n  return pickedObject;\n}",
    "type": "js",
    "name": "pick"
  },
  {
    "code": "function snakeToCamel(snakeCase) {\n  return snakeCase.replace(/_([a-z])/g, function (_, char) {\n    return char.toUpperCase();\n  });\n}",
    "type": "js",
    "name": "snakeToCamel"
  },
  {
    "code": "function downloadFileByBlob(fileName, blob) {\n  const downloadLink = document.createElement('a');\n  downloadLink.href = URL.createObjectURL(blob);\n  downloadLink.download = fileName;\n  downloadLink.click();\n  URL.revokeObjectURL(downloadLink.href);\n}",
    "type": "js",
    "name": "downloadFileByBlob"
  },
  {
    "code": "function getImageSize(imageUrl) {\n  return new Promise((resolve, reject) => {\n    const image = new Image();\n    image.onload = () => {\n      resolve({\n        width: image.width,\n        height: image.height\n      });\n    };\n    image.onerror = () => {\n      reject(new Error('Failed to load image.'));\n    };\n    image.src = imageUrl;\n  });\n}",
    "type": "js",
    "name": "getImageSize"
  },
  {
    "code": "function getLinesCountAfterInsertion(parent, content, insertBefore = null) {\n  const clone = document.createElement('div');\n  clone.style.cssText = 'visibility: hidden;';\n  if (typeof content === 'string') {\n    clone.innerHTML = content;\n  } else if (content instanceof HTMLElement) {\n    clone.appendChild(content);\n  }\n  parent.insertBefore(clone, insertBefore);\n  const lineHeight = parseFloat(getComputedStyle(clone).lineHeight);\n  const clientHeight = clone.clientHeight;\n  parent.removeChild(clone);\n  return Math.ceil(clientHeight / lineHeight);\n}",
    "type": "js",
    "name": "getLinesCountAfterInsertion"
  },
  {
    "code": "function listenClickOutside(target, callback) {\n  const targets = Array.isArray(target) ? target : [target];\n  const handleClickOutside = event => {\n    const isClickOutside = targets.every(target2 => !target2.contains(event.target));\n    if (isClickOutside) {\n      callback();\n    }\n  };\n  document.addEventListener('click', handleClickOutside);\n  return () => {\n    document.removeEventListener('click', handleClickOutside);\n  };\n}",
    "type": "js",
    "name": "listenClickOutside"
  },
  {
    "code": "function getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1);\n}\nfunction isString(value) {\n  return getType(value) === 'String';\n}\nfunction isObject(value) {\n  return getType(value) === 'Object';\n}\nfunction isHasObject(value) {\n  return isObject(value) && Object.keys(value).length > 0;\n}\nfunction loadJS(files, config) {\n  const head = document.getElementsByTagName('head')[0];\n  if (isString(files))\n    files = [files];\n  return Promise.all(files.map(file => {\n    return new Promise((resolve, reject) => {\n      const scriptElement = document.createElement('script');\n      scriptElement.type = 'text/javascript';\n      scriptElement.async = true;\n      scriptElement.src = file;\n      if (isHasObject(config)) {\n        Object.entries(config).forEach(([key, val]) => {\n          scriptElement.setAttribute(key, val);\n        });\n      }\n      scriptElement.addEventListener('load', () => resolve(), false);\n      scriptElement.addEventListener('error', () => reject(new Error(`Failed to load script: ${ file }`)), false);\n      head.appendChild(scriptElement);\n    });\n  }));\n}",
    "type": "js",
    "name": "loadJS"
  }
]
// codeList -- end
