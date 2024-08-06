## Babel 与 Webpack 结合

Babel 与 Webpack 通过 `babel/loader` 来进行集成。

在 Webpack 中，文件的转换是通过 loader 来进行转换的。假如我们的项目需要对代码进行语法降级，我们可以使用 `babel/loader` 来让 Webpack 对文件进行语法降级处理。具体做法如下：

1、安装 `babel-loader` 与 `@babel/preset-env`。`babel-loader` 负责在 Webpack 打包的过程中调用 babel 的处理能力。`@babel/preset-env` 是 babel 的一个预设，主要用于处理语法降级兼容旧浏览器问题。
```shell
npm install --save-dev babel-loader @babel/preset-env
```

2、添加 `.babelrc` 配置文件

`babel-loader` 调用 babel 能力处理文件，我们还需要增加一些 babel 配置让 babel 在转换文件的时候使用。

> `babel-loader` 在调用 babel 能力的时候，可以读取项目中的 babel 配置文件，这样我们可以更好地配置 babel。

`.babelrc ` 示例如下：

```js
// .babelrc
{
  "presets": ["@babel/preset-env"]
}
```

还可以直接在 package. json 中来配置 babel，babel 也可以读取到，如下：

```js
// package.json
{
  "babel": {
    "presets": ["@babel/preset-env"]
  }
}
```

3、配置 `webpack. config. js`

接下来需要将 `babel-loader` 添加到 `webpack. config. js` 中。

> 注意：`babel-loder` 也可以直接接受参数来配置 babel 转换。所以如果在配置 `babel-loader` 的时候传递了配置，则上面第二步可以省略。

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配所有 .js 文件
        exclude: /node_modules/, // 排除 node_modules 目录
        use: {
          loader: 'babel-loader', // 使用 babel-loader
          options: {
            presets: ['@babel/preset-env'] // 指定预设
          }
        }
      }
    ]
  }
};
```

## Babel 与 Rollup 结合

Rollup 与 Babel 的集成是通过 Rollup 插件 @rollup/plugin-babel 来实现的。

[Rollup 官网的描述](https://www.rollupjs.com/tools/#babel)

具体做法如下：

1、安装依赖

```shell
npm i -D @rollup/plugin-babel @rollup/plugin-node-resolve
```

2、添加 babel 配置

```shell
npm i -D @babel/core @babel/preset-env
```

新建配置文件 `.babelrc. json`

```js
//.babelrc.json
{  
"presets": ["@babel/env"]  
}
```

3、在 rollup. config. js 中配置插件

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
    input: 'src/main.js',
    output: {
        file: 'bundle.js',
        format: 'cjs'
    },
    plugins: [resolve(), babel({ babelHelpers: 'bundled' })]
};
```

## Babel 与 Jest 结合

[Jest](https://www.jestjs.cn/docs/getting-started#%E4%BD%BF%E7%94%A8-babel) 是一个优秀的 JavaScript 测试框架。Jest 会在项目里以原始的 JavaScript 执行，所以如果你用了一些 Node 环境不支持的语法 (比如 JSX, TypeScript, Vue 模板语法)，那就要把你的代码转译成原始的 JavaScript，这就跟你在构建浏览器前端代码时要做的转译工作一样。这时候我们就需要编译能力，那谁来呢？答案是 babel。

Jest 通过 `jest-babel` 来使用 babel 的能力。

使用方式参考 [Jest 代码转换](https://jestjs.io/zh-Hans/docs/code-transformation)

## Babel 与 Eslint 结合

参考：[@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)

