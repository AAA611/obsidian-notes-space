## 介绍

[SplitChunks](https://www.webpackjs.com/plugins/split-chunks-plugin/) 时 `webpack` 中的一个内置插件，用于更精准的代码分割。

`splitChunks` 默认配置如下：

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

## 重要配置解析

### chunks

`chunks` 表明将选择哪些 `chunk` 进行优化。有效值有三个，分别是：`all | initial | async`。默认是 `async`。

- all 对所有 `chunk` 进行优化，包括多入口的 `chunk` 和动态导入模块的 `chunk`。
- **async** 只对动态导入模块的 `chunk` 进行优化。
- **initial** ：TODO

### minSize

分割 `chunk` 的最小提交要求，如果将要被分割的 `chunk` 在压缩前体积不大于 `minSize`，则不会进行分包

### cacheGroup

`cacheGroups` 有两个默认缓存策略，也就是 `chunks` 为 `all` 和 `initail` 时的默认配置：

```js
cacheGroups: {
  defaultVendors: {
    test: /[\\/]node_modules[\\/]/,
    priority: -10,
    reuseExistingChunk: true,
  },
  default: {
    minChunks: 2,
    priority: -20,
    reuseExistingChunk: true,
  },
},
```

`defaultVendors` 会将源代码中所有引入 `node_modules` 的文件打包成为一个大的 `chunk`。 `default` 则是对于多入口引入的相同模块超过两次后，进行拆包操作，需要注意的是，我们通常操作的单页面应用，默认只有一个入口文件。

## TODO

1、更深如地了解 SplitChunk 插件
2、配置了两个入口，都引入了 react，但是打包后 react 没有被分包，这是为什么？但是将 minSize 减小了之后 react

## 参考

[谈一谈 Webpack 中的 SplitChunks](https://juejin.cn/post/6992887038093557796)