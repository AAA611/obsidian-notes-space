
## 介绍

Vue 3 中的 watch API 可以监听响应式数据，从而在响应式数据发生改变时执行相关的回调。

## 三种不同的回调触发时机

Vue 3 中允许通过配置来执行 watch 回调的执行时机，代码如下：

```js
watch(someVal,()=>{},{
	flush: 'sync' // sync | pre | post
})
```

上面代码演示了使用 flush 配置项来执行 watch 回调的执行时机。
### pre - 默认

`flsh: pre` 是默认配置。

默认情况下，侦听器回调会在**父组件**更新 (如有) **之后**、**所属组件**的 DOM 更新**之前**被调用。这意味着如果你尝试在侦听器回调中访问所属组件的 DOM，那么 DOM 将处于更新前的状态。

**updateComponentPreRender 函数**

![[image-20240806105855555.png]]

上图中高亮部分为 pre 回调的刷新时机，在 updateComponentPreRender 函数中被调用。

**updateComponent 函数**

![[image-20240806110033745.png]]

从上图可以看到，第一个高亮行是 updateComponentPreRender 的调用。第二个高亮行是 instance. update () 的调用，也就是执行本组件的更新。

从上面代码可以得出结论：**pre 回调在自身组件更新之前调用**
### sync

`flush: sync` 表示创建一个同步侦听器

它会在 Vue 进行任何更新之前触发
### post

`flush: post` 回调在 Vue 更新完所属组件之后被调用，在这里可有拿到最新的 DOM。

![[image-20240806110526137.png]]

从上面可以看到执行 post 回调的函数在 patch 函数之后才被调用。此时组件已经更新完毕。

## 总结

sync、pre、post 三种回调的执行顺序是

![[image-20240806111118663.png]]

## 参考

[侦听器 | Vue.js](https://cn.vuejs.org/guide/essentials/watchers.html#callback-flush-timing)