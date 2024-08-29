
## React 更新流程

- **触发更新阶段**
	- 更新流程的开始通常由触发一个更新开始，在 react 中可以通过 setXXX 函数、改变 Context 方式触发一个更新流程
- **渲染阶段**（ render ）
	- 这个阶段的主要任务是根据 currentFiberTree（ 对应页面上的 UI ）和 JSX 对象构建一个新的 wipFiberTree（ 更新后的 Fiber 树 ）。在这个过程中 react 会尽量复用旧的 fiber 节点以达到提高性能的目的。
	- 渲染阶段结束后，我们会得到一个 wipFiberTree、被标记的 flags（ react 在 commit 阶段会根据这些 flags 进行响应的 DOM 操作来更新视图 ）
- **提交阶段**（ commit ）
	- 提交阶段会根据 render 阶段生成的 wipFiberTree 和 flags 进行响应的 DOM 操作
	- 切换 fiber 树
	- 执行相应的副作用
	- 执行一些清理操作，比如一个组件被销毁了，执行其 useEffect 的清理函数
