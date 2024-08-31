
## UMD 格式

umd 格式的代码既可以在浏览器环境中运行也可以在 node 环境中运行，产物是一个 IIFE 的格式。

umd 做到适配多环境的原理很简单，就是通过检测一些东西来判断当前环境，然后使用不同的模块化方案。

下面是一段代码

`__webpack_modules__` 对象：这个对象是 webpack 打包后产物一个非常重要的对象，是一个纯 JS 简单对象，里面保存着各个模块的地址到模块加载器的映射信息。

`__webpack_require__` 是一个方法，它用于加载和执行模块

`__webpack_module_cache__` 是一个对象，复杂缓存通过 `__webpack__require__` 加载的模块，后续再加载相同模块会直接从缓存中取。这样避免了一个模块被多次执行，也可以解决循环依赖问题。


```js
(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    // node 加载环境
    module.exports = factory()
  } else if (typeof define === 'function' && defined.amd) {
    // amd 加载环境
    define([], factory)
  } else {
    // 其他加载环境（ 一般是浏览器环境 ）
    const module = factory()
    for (const key in module) {
      if (typeof exports === 'object') {
        exports[key] = module[key]
      } else {
        root[key] = module[key]
      }
    }
  }
})(self, () => {

  // 模块路径 -> 模块加载器的映射信息
  const __webpack_modules__ = {
    './src/common.js': (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


      // 把导出信息定义到外部传进来的 __webpack_exports__ 对象上面
      __webpack_require__.d(__webpack_exports__, {
        add: () => add,
        sum: () => sum,
      })

      // 模块源码
      function add(a, b) {
        return a + b
      }

      function sum(a, b, c) {
        return a + b + c
      }
    }
  }

  // 已加载执行的模块会在这里缓存，后面再次加载改模块时直接从缓存中取
  const __webpack_module_cache__ = {}

  // __webpack_require__ 是一个重要的函数，它用来加载一个模块
  function __webpack_require__(moduleId) {
    const cacheModule = __webpack_module_cache__[moduleId]
    if (cacheModule !== undefined) {
      return cacheModule.exports
    }
    const module = __webpack_module_cache__[moduleId] = {
      exports: {}
    }

    __webpack_modules__[moduleId](module, module.exports, __webpack_require__)

    return module.exports
  }

  const __webpack_exports__ = {} // 这是 webpack 的最终导出模块

  // COMMON_MODULE 就是加载后的 './src/common.js' 模块对象
  const COMMON_MODULE = __webpack_require__('./src/common.js')

  const res = COMMON_MODULE.add(Math.random(), Math.random() + 1)

  console.log(res)

  return __webpack_exports__
})


```