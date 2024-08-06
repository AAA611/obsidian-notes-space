## 什么是 babel 预设？

[Babel 预设](https://www.babeljs.cn/docs/presets)是一组 Babel 插件或 `options` 配置的可共享模块。其实就是一个针对于特定场景的可共享的 babel 配置。

## 如何创建自己的预设？

[如何创建自己的 Babel 预设](https://www.babeljs.cn/docs/presets#%E5%88%9B%E5%BB%BA%E9%A2%84%E8%AE%BE)

下面是一个示例：

```js
module.exports = function () {
  presets: [
    require("babel-preset-es2015"),
    require("babel-preset-react")
  ],
  plugins: [
    require("babel-plugin-transform-flow-strip-types")
  ]
};
```