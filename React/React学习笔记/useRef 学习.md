
## 介绍

当你希望组件“记住”某些信息，但又不想让这些信息 [触发新的渲染](https://zh-hans.react.dev/learn/render-and-commit) 时，你可以使用 **ref** 。

## useRef 内部是如何运行的？

尽管 `useState` 和 `useRef` 都是由 React 提供的，原则上 `useRef` 可以在 `useState` **的基础上** 实现。你可以想象在 React 内部，`useRef` 是这样实现的：

```jsx
// React 内部
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

## ⭐何时使用 ref

通常，当你的组件需要“跳出” React 并与外部 API 通信时，你会用到 ref —— 通常是不会影响组件外观的浏览器 API。以下是这些罕见情况中的几个：

- 存储 [timeout ID](https://developer.mozilla.org/docs/Web/API/setTimeout)
- 存储和操作 [DOM 元素](https://developer.mozilla.org/docs/Web/API/Element)，我们将在 [下一页](https://zh-hans.react.dev/learn/manipulating-the-dom-with-refs) 中介绍
- <mark style="background: #BBFABBA6;">存储不需要被用来计算 JSX 的其他对象</mark>。

如果你的组件需要存储一些值，但不影响渲染逻辑，请选择 ref。

## ⭐ref 和 DOM

你可以将 ref 指向任何值。但是，<mark style="background: #BBFABBA6;">ref 最常见的用法是访问 DOM 元素</mark>。例如，如果你想以编程方式聚焦一个输入框，这种用法就会派上用场。当你将 ref 传递给 JSX 中的 `ref` 属性时，比如 `<div ref={myRef}>`，React 会将相应的 DOM 元素放入 `myRef.current` 中。当元素从 DOM 中删除时，React 会将 `myRef.current` 更新为 `null`。你可以在 [使用 ref 操作 DOM](https://zh-hans.react.dev/learn/manipulating-the-dom-with-refs) 中阅读更多相关信息。