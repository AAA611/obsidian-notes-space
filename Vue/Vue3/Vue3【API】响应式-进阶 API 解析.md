
## shadowRef

`ref ()` 的浅层作用形式

**详细信息**

和 `ref()` 不同，浅层 ref 的内部值将会**原样存储和暴露**，并且不会被深层递归地转为响应式。只有对 `.value` 的访问是响应式的。

`shallowRef()` 常常用于对大型数据结构的性能优化或是与外部的状态管理系统集成。

**示例**

```js
const state = shallowRef({ count: 1 })

// 不会触发更改
state.value.count = 2

// 会触发更改
state.value = { count: 2 }
```

**shadowRef 代码实现**

![[image-20240806144730681.png]]

与 `ref` 不同的是 `shadowRef` 在使用 `createRef` 创建的时候第二个参数 `shadow:boolean` 传的是 `true`。

我们再来看 `RefImpl` 类中的实现：

![[image-20240806145007781.png]]

可以看到，如果 shadow 为 true，就不会调用 toReactive 将其变为深层次的响应式的值。

**也就是说，浅层 ref 的内部值会原样存储和暴露**。

### 应用场景

- 减少大型不可变数据的响应性开销 [性能优化 | Vue.js](https://cn.vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures)
- 与外部状态系统集成 [深入响应式系统 | Vue.js](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html#integration-with-external-state-systems)

## triggerRef

强制触发依赖于一个[浅层 ref](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) 的副作用，这通常在对浅引用的内部值进行深度变更后使用。

**示例**

```js
const shallow = shallowRef({
  greet: 'Hello, world'
})

// 触发该副作用第一次应该会打印 "Hello, world"
watchEffect(() => {
  console.log(shallow.value.greet)
})

// 这次变更不应触发副作用，因为这个 ref 是浅层的
shallow.value.greet = 'Hello, universe'

// 打印 "Hello, universe"
triggerRef(shallow)
```

这可以用于当不希望将整个大的对象变为深层次的响应式对象（这有利于减少性能的开销）。但是，在极少情况下，我们可能希望改变某个深层的属性时触发副作用，这个时候就可以使用 `triggerRef`。

这样以来我们在降低性能开销的同时，也解决了想要监听深层次属性的目的。


## customRef

创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式。

参考：[响应式 API：进阶 | Vue.js](https://cn.vuejs.org/api/reactivity-advanced.html#customref)

## shadowReactive

`reactive ()` 的浅层作用形式

## shadowReadonly

`readonly` 的浅层作用形式

## toRaw

根据一个 Vue 创建的代理返回其原始对象。

**详细信息**

`toRaw()` 可以返回由 [`reactive()`](https://cn.vuejs.org/api/reactivity-core.html#reactive)、[`readonly()`](https://cn.vuejs.org/api/reactivity-core.html#readonly)、[`shallowReactive()`](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive) 或者 [`shallowReadonly()`](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreadonly) 创建的代理对应的原始对象。

这是一个可以用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，<mark style="background: #FF5582A6;">请谨慎使用</mark>。

**示例**

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

## markRaw

标记一个对象不可被转为代理，返回对象本身。
