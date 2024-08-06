
### `watch` vs. `watchEffect`[​](https://cn.vuejs.org/guide/essentials/watchers.html#watch-vs-watcheffect)

`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

- `watch` **只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西**。另外，仅在数据源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，<mark style="background: #BBFABBA6;">我们能更加精确地控制回调函数的触发时机</mark>。
    
- `watchEffect`，**则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性**。这更方便，而且代码往往更简洁，但有时其响应性<mark style="background: #BBFABBA6;">依赖关系会不那么明确</mark>。

## 参考

[侦听器 | Vue.js](https://cn.vuejs.org/guide/essentials/watchers.html#callback-flush-timing)