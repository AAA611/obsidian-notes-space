
## 问题描述

使用 webpack 将产物类型设置为 `module`，然后在别的地方使用产物，按理说 `module` 类型的产物可以被 `tree-shaking` 优化的，即那些未使用的代码应该在打包时被去除，但实际上并没有。

<mark style="background: #FF5582A6;">状态：待解决</mark>

## 过程
使用 webpack 将产物设置为 `module`：

```js
// webpack.config.js

{
  entry: "./src/index",
  output: {
    filename: "react-hooks.js",
    library: {
      type: "module",  // ⭐在这里将产物类型设置为 'module'
    },
    path: path.resolve(__dirname, "./dist"),
  },
  devtool:false,
  resolve: {
    extensions: [".ts", ".js"],
  },
  experiments: {
    outputModule: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
}
```