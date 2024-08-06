## 是什么？

**tree shaking** 是一个术语，通常用于描述移除 JavaScript 上下文中的死代码。它依赖于 ES2015 模块语法的 [静态结构](http://exploringjs.com/es6/ch_modules.html#static-module-structure) 特性，例如 [`import`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import) 和 [`export`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)。这个术语和概念实际上是由 ES2015 模块捆绑器 [rollup](https://github.com/rollup/rollup) 普及起来的。
## webpack 中使用

### optimization.usedExports

useExports 选项用于告诉 webpack 去决定每个模块的导出内容是否被使用。

开启了 `useExports:true` 之后，未使用的导出会被加上 `/* unused harmony export sum */` 注释

`optimization.usedExports` 收集的信息会被其它优化手段或者代码生成使用

`usedExports` 依赖于 [terser](https://github.com/terser-js/terser) 检测语句中的副作用。terser 会使用 usedExports 收集的信息从而将没有使用的导出代码去除

> 想要看 useExports 选项的效果，必须把 mode 设置为 development，不然在生产环境默认的优化选项会对打包结果造成很大影响。

### sideEffects

有时候，只靠工具无法很好地识别一些模块是否具有副作用，此时就有必要提示 webpack 编译器那些代码是存粹的、无副作用的。

通过 package. json 中的 "sideEffects" 属性可以实现此目的。

```json
{
  "name": "your-project",
  "sideEffects": false
}
```

如果所有的代码都没有副作用，可以简单地将 sideEffects 属性设置为 false 以告诉 webpack 可以安全地移除未使用的导出内容。

如果某些代码确实存在一些副作用，可以将 `sideEffects` 指定为一个数组：

```json
{
  "name": "your-project",
  "sideEffects": ["./src/some-side-effectful-file.js"]
}
```

### 魔法注释

实际上，`usedExports` 依赖的 terser 就尝试去解决这些问题，但在许多情况下它仍然不确定函数的调用是否有副作用。但这并不意味着 terser 会由于无法解决这些问题而运作得不好。根本原因在于像 JavaScript 这类动态语言中很难可靠确定这一点。

但我们可以通过 `/*#__PURE__*/` 注释来帮助 terser。这个注释的作用是标记此语句没有副作用。这样一个简单的改变就能够 tree-shake 下面的代码了：

```javascript
var Button$1 = /*#__PURE__*/ withAppProvider()(Button);
```

这将允许删除这段代码。但是除此之外，引入的内容可能仍然存在副作用的问题，因此需要对其进入评估。

> sideEffects 属性与 `/*#__PURE__*/` 类似，但是作用于模块层面，而非代码语句的层面。`"sideEffects"` 属性的意思是：“如果没有使用被标记为无副作用的模块的直接导出，那么捆绑器会跳过对此模块的副作用评估”。

参考：[Tree Shaking | webpack 中文文档](https://webpack.docschina.org/guides/tree-shaking/#root)
## rollup 中使用

rollup 默认开启 Tree Shaking，对于 rollup 不能确定能否移除的代码，可以使用注释来告诉 rollup

```js
const A =/*#__PURE__*/ a() // 使用 /*#__PURE__*/ 标记一个函数的调用没有副作用，那么当这个函数的返回值没有(在被留下来的代码中，如果有在其他地方使用，但是使用的地方也被 tree Shaking 掉了则不算)使用的话，那么这个的调用就可以被安全地 Shaking 掉。
```
