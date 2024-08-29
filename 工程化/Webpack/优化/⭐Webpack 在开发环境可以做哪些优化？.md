
## 缓存方面

### 持久化缓存

#### webpack V4

webpack V4 中使用 `cache-loader` 启用持久化缓存

#### webpack V5

> 更多关于 cache 选项的配置参考：[Cache | webpack 中文文档](https://webpack.docschina.org/configuration/cache)

webpack V5 中可以直接在配置对象的顶层配置 `cache` 属性来开启持久化缓存。

开启之后 webpack 回缓存生成的 webpack 模块和 chunk，来改善构建速度。

`cache` 会在开发模式被设置成 `type:memory` 而在生产模式中被禁用。

`cache:true` 与 `cache:{ 'memory' }` 作用一致。

传入 `false` 回禁用缓存。

使用示例如下：

```js
module.exports = {
  //...
  cache: true,  // ⭐开启持久化缓存
};
```

### DLL 缓存

TODO
### 增量编译

增量编译指的是让 webpack 监听项目文件的变化来对更改的文件进行编译。

> ⭐在 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 和 [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) 里 Watch 模式默认开启。
## 多进程、多线程方面

### thread loader

thread loader 可以让配置在 thread loader 后面的 loader 都有 thread loader 来执行。

利用 thread loader，可以将非常消耗资源的 loader 分到一个子进程中执行。

在内部，thread loader 会创建一个 worker 池，每一个 worker 都是一个独立的 node. js 子进程。thread loader 会将它后面配置的 loader 都放到 worker 中执行来提高并发速度。

>⭐更多关于 thread loader 参考：[[thread-loader 原理简单剖析]]

### HappyPack Plugin

HappyPack 与 thread loader 的原理类似。但是 HappyPack 已经很久没维护了

## sourcemap 方面 1

sourcemap 的生成相当消耗资源，如果我们暂时不需要 sourcemap，配置 `devtool` 来暂时关掉它。

## 其他

### 最小化入口 chunk

请参考：[[optimization.runtimeChunk]]