
1. **代码结构**
	- Vue 3 比 Vue 2 的代码耦合度要低，一些模块可以被单独使用如 `@vue/reactivity` 模块。这跟 React 很像，因为 React 中的模块主要分为:
		- `react`：react 核心包。
		- `react-dom`：这个包负责将 React 组件渲染为浏览器 DOM。它包含了于浏览 DOM 交互的细节。
		- `react-reconcilder`：这个包含 react 的协调算法（diff 算法），用于处理组件的更新。
		- `react-native`：负责将 React 组件渲染为原生组件
2. **响应式系统的实现** [[Object.defineProperty 与 Proxy 的对比]]
	- **Vue 2**: 使用了基于对象的响应性系统。它通过 `Object.defineProperty` 进行数据绑定，监听数据的变化并更新视图。这种方式在处理大数据量或复杂嵌套数据时，可能会遇到性能瓶颈。
	- **Vue 3**: 引入了全新的基于代理（Proxy）的响应性系统。它通过 `Proxy` 处理数据的读写操作，这种方式在性能上有明显提升，同时解决了 Vue 2 中的一些响应性陷阱，比如无法检测数组的某些变更。
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

## 参考

[propsData | Vue 3 迁移指南](https://v3-migration.vuejs.org/zh/breaking-changes/props-data.html)
