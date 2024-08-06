
## 介绍

接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 `.value`。

**详细信息**

ref 对象是可更改的，也就是说你可以为 `.value` 赋予新的值。它也是响应式的，即所有对 `.value` 的操作都将被追踪，并且写操作会触发与之相关的副作用。

如果将一个对象赋值给 ref，那么这个对象将通过 [reactive()](https://cn.vuejs.org/api/reactivity-core.html#reactive) 转为具有深层次响应式的对象。这也意味着如果对象中包含了嵌套的 ref，它们将被深层地解包。

若要避免这种深层次的转换，请使用 [`shallowRef()`](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) 来替代。

**示例**

```js
const count = ref(0)
console.log(count.value) // 0

count.value = 1
console.log(count.value) // 1
```

## 实现原理

**ref 函数**

![[image-20240806111750355.png]]

可以看到主要是调用 createRef

**createRef 函数**

![[image-20240806111827383.png]]

可以看到 ref 其实是使用 RefIml 类创建的一个实例对象

**RefIml 类**

![[image-20240806112144463.png]]

RefIml 类实际上就是创建一个对象具有两个属性的对象：
- `_rawValue` 表示原始对象
- `_value` 通过 ref. value 实际访问的对象

如果是**浅层**监听则 `_value` 就是原始值
如果是**深层**监听则 `_value` 是 `toReactive(value)` 返回的响应式对象

**toReactive 函数**

![[image-20240806112611004.png]]

## 总结

ref 实际上就是一个简单包装的对象具有 value 属性。使用这种方式可以对原始值类型进行响应式包装。

如果传给 ref 的值是一个对象的话，则实际会调用 toReactive 返回一个响应式对象。
