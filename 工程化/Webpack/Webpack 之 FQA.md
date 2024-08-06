### 1 、 *__webpack_require__.p* 是什么？

是 Webpack 生成的代码中的一个全局变量，用于存储 `publicPath` 的值

### 2 、module VS chunk VS bundle

**module**：`module` 通常是一个标准的 JS 模块

**chunk**： `chunk` 是一个或多个 `module` 的集合，是一些模块的封装单元，。`chunk` 在构建完成就呈现为 `bundle`。通常从一个 `entry` 出发，其所关联依赖的所有 `module` 都属于一个 `chunk`

**bundle**：`bundle` 是打包后的最后产物 `Asset`，也就是打包后的文件资源

> 1、 chunk 是过程代码块，而 bundle 是结果代码块
> 2、 chunk 与 bundle 并不是一一对应的关系。

![[Pasted image 20240723100600.png]]

参考：[Webpack 理解 Chunk](https://juejin.cn/post/6844903889393680392)
### 3 、产生 chunk 的途径有哪些？

1、entry 入口（ entry 是一个对象时，对象的每一个属性对应一个 chunk，entry 是一个字符串或者是数组时不行 ）
2、异步加载代码块 ( import ('xxx') )
3、代码分割

### 4、如何执行动态导入的 chunk 名称？

可以使用 webpack 魔法注释来执行动态模块的 chunk 名称，代码如下：

```js
import(
  /* webpackChunkName: "app" */
  './app.jsx'
).then((App) => {
  ReactDOM.render(<App />, root);
});
```

参考：[webpack 中文文档 chunk](https://www.webpackjs.com/concepts/under-the-hood/#chunks)

### 5、webpack 时如何实现动态导入 import () 的？

webpack 内部会把 import () 函数编译成 webpack_require. e 函数，这个函数中使用 Promise + script 标签来模拟 import 动态加载的功能，利用 script 的 onerror 与 onload 事件。

### 6、__webpack_require__. f 是什么？

`__webpack_require__.f` 是 Webpack 内部的一个机制，用于处理 Webpack 运行时中的异步加载（如代码分割和动态导入）。具体来说，它涉及到的是 Webpack 的“分块加载功能”（chunk loading function）。

在 Webpack 打包后的代码中，`__webpack_require__` 是一个函数，用于加载模块。`__webpack_require__.f` 通常是一个对象，其中包含用于处理不同类型模块加载的函数。这些函数可以包括：

1. **jsonp**：用于处理 JSONP 请求的函数，通常用于加载额外的 JavaScript 文件（chunks）。
2. **promises**：用于处理模块加载的 Promise 对象，用于确保模块在加载完成后才能继续执行相关代码。
3. **wasm**：用于处理 WebAssembly 模块的加载。

具体的实现和功能取决于 Webpack 的配置和版本。在代码分割和异步加载的上下文中，`__webpack_require__.f` 是一个重要的机制，用于管理和协调不同模块的加载和执行。

这里是一个简化的示例，展示了 `__webpack_require__.f` 的基本用法：

javascript

复制代码

`// 定义 __webpack_require__.f 对象 __webpack_require__.f = {};  // 定义一个 jsonp 加载函数 __webpack_require__.f.j = function(chunkId, promises) {   // 创建 script 元素用于加载 chunk   var script = document.createElement('script');   script.src = __webpack_require__.p + "" + chunkId + ".bundle.js";    // 处理加载完成后的逻辑   script.onload = function() {     // 加载完成，解析 Promise     resolve();   };    // 处理加载错误的逻辑   script.onerror = function() {     // 加载失败，拒绝 Promise     reject();   };    // 将 script 元素添加到文档中   document.head.appendChild(script); };  // 在运行时使用 __webpack_require__.f 进行异步加载 __webpack_require__.e = function(chunkId) {   var promises = [];   __webpack_require__.f.j(chunkId, promises);   return Promise.all(promises); };`

在这个示例中，`__webpack_require__.f.j` 是一个用于 JSONP 加载的函数，当调用 `__webpack_require__.e` 进行异步加载时，会使用这个函数来加载指定的 chunk。实际的实现可能会更加复杂，涉及更多的错误处理和边界情况。

了解这些内部机制有助于深入理解 Webpack 的工作原理，特别是在需要自定义打包和加载行为时。
