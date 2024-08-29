
1. **代码结构**
	- Vue 3 比 Vue 2 的代码耦合度要低，一些模块可以被单独使用如 `@vue/reactivity` 模块。这跟 React 很像，因为 React 中的模块主要分为:
		- `react`：react 核心包。
		- `react-dom`：这个包负责将 React 组件渲染为浏览器 DOM。它包含了于浏览 DOM 交互的细节。
		- `react-reconcilder`：这个包含 react 的协调算法（diff 算法），用于处理组件的更新。
		- `react-native`：负责将 React 组件渲染为原生组件
2. **响应式系统的实现** [[Object.defineProperty 与 Proxy 的对比]]
	- **Vue 2**: 使用了基于对象的响应性系统。它通过 `Object.defineProperty` 进行数据绑定，监听数据的变化并更新视图。这种方式在处理大数据量或复杂嵌套数据时，可能会遇到性能瓶颈。
	- **Vue 3**: 引入了全新的基于代理（Proxy）的响应性系统。它通过 `Proxy` 处理数据的读写操作，这种方式在性能上有明显提升，同时解决了 Vue 2 中的一些响应性陷阱。
4. **语法和 API**
	- **Vue2:** 使用的是 Options API，通过 `data`, `methods`, `computed`, `watch` 等选项来组织代码。
	- **Vue3:** 引入了 Composition API，通过 `setup` 函数和 hooks 来组织代码，更加灵活和可组合。适用于复杂的应用和逻辑复用。
5. **Typescript 支持**
	- **Vue2** 对 TypeScript 的支持较为基础，需要借助 Vue Class Component 等第三方库来实现更好的 TypeScript 集成。
	- **Vue3** 在设计之初就考虑了 TypeScript 的支持，提供了更好的类型推断和类型安全，提升了开发体验。
6. **Fragment 和 Teleport**
	- Vue 2 不支持 fragment，组件只能有一个根元素
	- Vue 3 支持 fragment，允许组件有多个根元素。另外 Vue 3 引入了 Teleport 组件，可以将子组件渲染到指定的 DOM 节点，增强了布局和渲染的灵活性。
7. **代码体积（Treeshaking）**[[Tree-Shaking]]
	- Vue 2 中有许多 API 直接挂载在 Vue 构建函数上面，无论你有没有使用，他都会存在于最终的构建产物中，增加了代码体积。
	- Vue 3 中全局和内部 API 都经过了重构，并且考虑到了 `tree-shaking` 支持。
8. **扩展性**
	相比于 Vue 2，Vue 3 具有很强的扩展性，可以编写自定义渲染器，自定义 Ref 等等。

## Vue2 与 Vue3 的区别是什么？

Vue 3 包含了一些 Vue 2 中没有的新特性（ 比如 Teleport，Suspense 以及多根元素模板 ）。同时 Vue 3 也包含了一些与 Vue 2 非兼容性的变更。细节可以参考 [Vue 3 迁移指南](https://v3-migration.vuejs.org/zh/)

Vue 3 新增了组合式 API（ Vue 2.7 中也可用 ）

总的来说，Vue 3 提供了更新小的包体积、更好的性能、更好的可扩展性和更好的 TypeScript/IDE 支持。

> 参考：[常见问题 | Vue.js](https://cn.vuejs.org/about/faq.html)

## 为什么 Vue3 对于 TS 的支持更好？

**基于函数的设计**：

- 组合式 API 基于函数来组织逻辑，这与 TypeScript 中的类型注解和类型推断机制高度契合。在组合式 API 中，每个逻辑单元通常是一个函数，而 TypeScript 可以为这些函数的参数和返回值提供精确的类型推断。

## 为什么 Vue 3 有更好的性能

编译优化指的是编译器将模板编译为渲染函数的过程中，尽可能多地提取关键信息，并以此知道生成最优代码的过程。

编译优化的核心在于，区分动态节点与静态节点。Vue 3 会为动态节点打上补丁标志，即 patchFlag。同时 Vue 3 还提出了 Block 的概念，一个 Block 本质上也是一个虚拟节点，但与普通节点不同的是，多出一个 dynamicChildren 数组。该数组用于收集所有动态子代节点。

### 静态提升

假设有如下模板：

```html
<div>
	<p>static text</p>
 	<p>{{ title }}</p>
</div>
```

在没有静态提升的情况下，它对应的渲染函数是：

```js
function render() {
	return (openBlock(), createBlock('div', null, [
		createVNode('p', null, 'static text'),
  		createVNode('p', null, ctx.title, 1 /* TEXT */),
	]))
}
```

可以看到，在这段虚拟 DOM 的描述中有两个 `p` 标签，一个是纯静态的一个是动态的。当响应式数据发生变化后，整个渲染函数会重新执行，并产生新的虚拟 DOM 树。这个过程有一个明显的问题就是纯静态的 `p` 节点也会被重新创建一次。这是没有必要的。

所谓静态提升就是把静态节点放到渲染函数之外，如下：

```js
const host1 = createVNode('p', null, 'static text')

function render() {
	return (openBlock(), createBlock('div', null, [
		host1, // 静态节点的引用
  		createVNode('p', null, ctx.title, 1 /* TEXT */),
	]))
}
```

这样可以避免重新创建静态节点。
### 预字符串化

对于纯静态的节点，可以不使用 `createVNode` 函数来创建而是直接使用 `html` 字符串。

### 缓存内联函数

缓存内联事件函数可以避免不必要的更新。

> 其实类似于 React 中的 useCallback 的优化方式

### 区分静态节点与动态节点

实际上，模板的结构非常稳定，同过编译手段，可以分析出很多关键信息，例如哪些节点是静态的，哪些节点是动态的。结合这些关键信息，编译器可以直接生成原生 DOM 操作的代码。这样甚至可以抛弃掉虚拟 DOM，从而避免虚拟 DOM 带来的性能开销。但是，考虑到渲染函数的灵活性以及 Vue 2 的问题，Vue 3 最终还是选择保留虚拟 DOM。
## 参考

[propsData | Vue 3 迁移指南](https://v3-migration.vuejs.org/zh/breaking-changes/props-data.html)