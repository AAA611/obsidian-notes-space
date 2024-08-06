## 介绍

`exports`包中的字段允许`package.json`声明在使用模块请求（如`import "package"`或 ）时应使用哪个模块`import "package/sub/path"`。它替换了返回字段的默认实现`main`。`index.js`的文件`"package"`和 的文件系统查找`"package/sub/path"`。
## 参考

[Package exports | webpack 中文文档](https://webpack.docschina.org/guides/package-exports/)