## 介绍

Dll（ Dynamic-link library ）动态链接库，是 Windows OS 中实现共享的一种方式。

Webpack 中 Dll 优化主要是为那些更改不频繁的代码生成单独的编译结果，生成之后，Webpack 可以在后续的编译过程中直接使用之前的编译结果而不是重新编译。

这增加了构建过程的复杂度，但是可以提升构建速度。

## 如何使用

在 Webpack 中使用动态链接库优化，有两个相关的插件：

- DllPlugin 插件：用于打包出一个个单独的动态链接库文件。
- DllReferencePlugin 插件：用于在主要配置文件中去引入 DllPlugin 插件打包好的动态链接库文件。

DllPlugin 插件打包出 .dll. js 文件与 .manifest. json 文件，分别是可重用的动态链接库文件与一个描述清单文件。

DllReferencePlugin 则根据上面的 .manifest. json 文件从 .dll. js 文件中引入可以复用的产物给 Webpack，这样 Webpack 就可以直接复用了。

### 1、打包动态链接库文件

动态链接库文件相关的文件需要由一份独立的构建输出，用于给主构建使用。新建一个 Webpack 配置文件 `webpack_dll.config.js` 专门用于构建它们，文件内容如下：

```js
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');

module.exports = {
  // JS 执行入口文件
  entry: {
    // 把 React 相关模块的放到一个单独的动态链接库
    react: ['react', 'react-dom'],
    // 把项目需要所有的 polyfill 放到一个单独的动态链接库
    polyfill: ['core-js/fn/object/assign', 'core-js/fn/promise', 'whatwg-fetch'],
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
    // 也就是 entry 中配置的 react 和 polyfill
    filename: '[name].dll.js',
    // 输出的文件都放到 dist 目录下
    path: path.resolve(__dirname, 'dist'),
    // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
    // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
    library: '_dll_[name]',
  },
  plugins: [
    // 接入 DllPlugin
    new DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 react.manifest.json 中就有 "name": "_dll_react"
      name: '_dll_[name]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, 'dist', '[name].manifest.json'),
    }),
  ],
};
```

### 2、使用动态链接库文件

构建出的动态链接库文件用于给其它地方使用，在这里也就是给执行入口使用。

用于输出 `main.js` 的主 Webpack 配置文件内容如下：

```js
const path = require('path');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

module.exports = {
  entry: {
    // 定义入口 Chunk
    main: './main.js'
  },
  output: {
    // 输出文件的名称
    filename: '[name].js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        // 项目源码使用了 ES6 和 JSX 语法，需要使用 babel-loader 转换
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: path.resolve(__dirname, 'node_modules'),
      },
    ]
  },
  plugins: [
    // 告诉 Webpack 使用了哪些动态链接库
    new DllReferencePlugin({
      // 描述 react 动态链接库的文件内容
      manifest: require('./dist/react.manifest.json'),
    }),
    new DllReferencePlugin({
      // 描述 polyfill 动态链接库的文件内容
      manifest: require('./dist/polyfill.manifest.json'),
    }),
  ],
  devtool: 'source-map'
};
```

### 执行构建

在修改好以上两个 Webpack 配置文件后，需要重新执行构建。 重新执行构建时要注意的是需要先把动态链接库相关的文件编译出来，因为主 Webpack 配置文件中定义的 DllReferencePlugin 依赖这些文件。

执行构建时流程如下：

1. 如果动态链接库相关的文件还没有编译出来，就需要先把它们编译出来。方法是执行 `webpack --config webpack_dll.config.js` 命令。
2. 在确保动态链接库存在时，才能正常的编译出入口执行文件。方法是执行 `webpack` 命令。这时你会发现构建速度有了非常大的提升。