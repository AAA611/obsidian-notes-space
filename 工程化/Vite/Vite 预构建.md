## 是什么？

当你首次启动 `vite` 时，Vite 在本地加载你的站点之前预构建了项目依赖。默认情况下，它是自动且透明地完成的。

## 为什么?
- 兼容性，vite 的开发服务器将所有代码视为原生 ES 模块。因此，Vite 必须先将以 CommonJS 或 UMD 形式提供的依赖项转换为 ES 模块。
- 性能，为了提高后续页面的加载性能，Vite将那些具有许多内部模块的 ESM 依赖项转换为单个模块。==（？Vite 是如何做的，应该是利用 esbuild 做的）==

## 怎么做的?


## 原理分析

Vite 启动开发服务器时，会自动进行依赖预构建优化

```js
// start deps optimizer after all container plugins are ready
if (isDepsOptimizerEnabled(config, false)) {
  await initDepsOptimizer(config, server)
}
```

注意：如果预构建已经执行过了，则不会重新执行，这依赖于 loadCachedDepOptimizationMetadata 方法会不会返回 cachedMetaData

![[Pasted image 20240714161110.png]]

![[Pasted image 20240714160909.png]]
### 依赖分析

要想预构建依赖，首先我们需要找到有哪些依赖需要预构建。主要分为两个地方：
- 配置文件中的配置选项
- Vite 自动扫描出的项目依赖

配置文件： 

Vite 自动扫描

```js
discover = discoverProjectDependencies(config)
const deps = await discover.result
discover = undefined
```

Vite 中通过 discoverProjectDependencies 方法来进行项目的依赖扫描，其原理是使用 esbuild 打包项目，再其中加入一个扫描插件，这样在 esbuild 打包的过程中就可以在插件中分析项目中的导入，然后根据相应的规则识别出哪些是需要预构建的依赖

通过这两个就可以知道需要预构建哪些依赖，接下来 Vite 将执行预构建。

### 执行预构建

Vite 通过 esbuild 以依赖列表作为入口点进行预构建打包，打包出的产物会被存放在 node_modules/. vite 文件夹下面。方便后面使用

这样浏览器在请求依赖项的时候，Vite 会首先查找这个模块有没有在内存中的缓存即 module. transformResult，如果没有，Vite 会从 .vite 中读取，然后返回，同时 module. transformREsult 也会被更新，后面再次请求该模块时，会先看内存中的缓存即 module. transformresult，没有缓存才会去 .vite 中读取


