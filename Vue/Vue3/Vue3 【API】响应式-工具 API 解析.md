## unref

如果参数是 ref，则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val` 计算的一个语法糖。

## toRef

可以将值、refs 或 getters 规范化为 refs (3.3+)。

**示例**⭐

```js
// 按原样返回现有的 ref
toRef(existingRef)

// 创建一个只读的 ref，当访问 .value 时会调用此 getter 函数
toRef(() => props.foo)

// 从非函数的值中创建普通的 ref
// 等同于 ref(1)
toRef(1)
```

**toRef 函数实现**

![[image-20240806113718444.png]]

## toRefs

当从组合式函数中返回响应式对象时，`toRefs` 相当有用。使用它，消费者组件可以解构/展开返回的对象而不会失去响应性：

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // ...基于状态的操作逻辑

  // 在返回时都转为 ref
  return toRefs(state)
}

// 可以解构而不会失去响应性
const { foo, bar } = useFeatureX()
```

**toRefs 函数实现**

![[image-20240806114024896.png]]

## toValue

将值、refs 或 getters 规范化为值。这与 [unref()](https://cn.vuejs.org/api/reactivity-utilities.html#unref) 类似，不同的是此函数也会规范化 getter 函数。如果参数是一个 getter，它将会被调用并且返回它的返回值。

在组合式函数中规范化参数：

```ts
import type { MaybeRefOrGetter } from 'vue'

function useFeature(id: MaybeRefOrGetter<number>) {
  watch(() => toValue(id), id => {
    // 处理 id 变更
  })
}

// 这个组合式函数支持以下的任意形式：
useFeature(1)
useFeature(ref(1))
useFeature(() => 1)
```

> 更多关于使用 toValue 请参考 [组合式函数 | Vue.js](https://cn.vuejs.org/guide/reusability/composables.html)

**toValue 函数实现**

![[image-20240806114305744.png]]

<mark style="background: #BBFABBA6;">可以看到 toValue 的作用大致与 unref 类似，不同之处在于 toValue 可以处理函数</mark>