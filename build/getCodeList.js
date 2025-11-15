import axios from "axios";

// 从 npm API 获取已发布的 utilslib 包列表
async function getPublishedPackages() {
  try {
    // 使用 npm 搜索 API 获取 @utilslib 的所有包
    const response = await axios.get("https://registry.npmjs.org/-/v1/search?text=@utilslib");
    const packages = response.data.objects
      .map((obj) => obj.package.name)
      .filter((name) => name.startsWith("@utilslib/"))
      .map((name) => name.replace("@utilslib/", ""));
    console.log(`从 npm 获取到 ${packages.length} 个包:`, packages);
    return packages;
  } catch (error) {
    console.error("获取包列表失败:", error.message);
    return [];
  }
}

// 从 unpkg.com 获取指定包的代码片段
async function getSnippetsFromUnpkg(packageName, type) {
  try {
    const url = `https://unpkg.com/@utilslib/${packageName}/lib/${type}Snippets.json`;
    const response = await axios.get(url);
    const snippets = response.data;

    // 过滤掉空的代码片段
    if (Array.isArray(snippets)) {
      return snippets.filter((snippet) => snippet && snippet.code && snippet.code.trim() !== "");
    }
    return [];
  } catch (error) {
    // 如果某个包的文件不存在，忽略错误
    if (error.response && error.response.status === 404) {
      return [];
    }
    console.warn(`获取 ${packageName} 的 ${type} 代码片段失败:`, error.message);
    return [];
  }
}

export default async function main() {
  try {
    const packages = await getPublishedPackages();
    console.log(`发现 ${packages.length} 个已发布的包:`, packages);

    const allJsSnippets = [];
    const allTsSnippets = [];

    // 并发获取所有包的代码片段
    const promises = packages.map(async (packageName) => {
      const [jsSnippets, tsSnippets] = await Promise.all([
        getSnippetsFromUnpkg(packageName, "js"),
        getSnippetsFromUnpkg(packageName, "ts"),
      ]);

      return {
        packageName,
        jsSnippets: jsSnippets || [],
        tsSnippets: tsSnippets || [],
      };
    });

    const results = await Promise.all(promises);

    // 合并所有代码片段
    results.forEach(({ packageName, jsSnippets, tsSnippets }) => {
      if (jsSnippets.length > 0) {
        allJsSnippets.push(...jsSnippets);
        console.log(`从 ${packageName} 获取了 ${jsSnippets.length} 个 JS 代码片段`);
      }
      if (tsSnippets.length > 0) {
        allTsSnippets.push(...tsSnippets);
        console.log(`从 ${packageName} 获取了 ${tsSnippets.length} 个 TS 代码片段`);
      }
    });

    console.log(`总共获取了 ${allJsSnippets.length} 个 JS 代码片段，${allTsSnippets.length} 个 TS 代码片段`);

    return {
      js: allJsSnippets,
      ts: allTsSnippets,
    };
  } catch (error) {
    console.error("获取代码片段时发生错误:", error);
    return {
      js: [],
      ts: [],
    };
  }
}
