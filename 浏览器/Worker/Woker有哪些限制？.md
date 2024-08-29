
## 同源策略限制

Worker 脚本的加载受同源策略的限制

## 可操作对象的限制

在 Worker 中，有一些不能操作的对象，如：

- DOM
- window：Worker 中不能使用 window 上的方法和属性，Worker 脚本中有自己的全局对象，上面会有一些全局方法和属性可以使用

## 数据传递的限制

Woker 接口的 `postMessage()` 方法可以向 worker 发送消息。第一个参数是要发送到 worker 的数据。该数据可以是任何可以被[结构化克隆算法](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)处理的 JavaScript 对象。

Worker 的 `postMessage()` 方法委托给 MessagePort 的 `postMessage()` 方法，该方法会在对应的用于接收 MessagePort 的事件循环中添加一个任务。

Worker 可以使用 [`DedicatedWorkerGlobalScope.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope/postMessage "此页面目前仅提供英文版本") 方法将信息发送回生成它的线程。

> 注意：当一个数据在主线程和 worker 线程之间传递时，他被复制了或者转移了，而不是共享。

> 主页面与 worker 之间的传递的数据是通过**拷贝**，而不是通过共享来完成的。传给 worker 的对象需要经过**序列化**，**接下来在另一端还需要反序列化**。
> 页面与 worker **不会共享一个实例**，最终的结果就是在每次通信结束时生成了数据的一个副本。大部分浏览器使用结构化克隆来实现该特性

如下：

```js
// worker.js
onmessage=(event)=>{
	// self.postMessage() 方法一，self 就是 worker 环境中的全局对象
	// postMessage() // 方法二
}
```

进入重点，Worker 线程与主线程之间的数据传递到底有哪些限制呢 ？其实就是上面提到的[结构化克隆算法](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)。

下面简单介绍一下结构化克隆算法。

### 结构化克隆算法

结构化克隆算法用于复制复杂的 JavaScript 对象的算法。它通过递归输入对象来构建克隆，同时保持先前访问过的引用的映射，这是一个无限遍历循环。

> 通过缓存遍历过的对象来解决循环引用的问题。

#### 结构化克隆所不能实现的

- Function：无法实现对 Function 类型数据的克隆
- DOM：无法实现 DOM 的克隆
- 对象的某些特定参数不会被保留：
	- RegExp 对象的 lastIndex 字段不会被保留。
	- 属性映射，setter、getter 不会被复制
- 原型链：原型链上的属性不会被追踪和复制

#### 支持的类型

- Array
- ArrayBuffer
- Boolean
- DataView
- Date
- Error（仅限部分）
- Map
- Set
- Object 对象（仅限简单的对象）
- 除 symbol 以外的基础类型
- RegExp（lastIndex 不会被保留）
- String
- TypedArray


## 参考

[结构化克隆算法 - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
[使用 Web Workers - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers#worker_%E4%B8%AD%E6%95%B0%E6%8D%AE%E7%9A%84%E6%8E%A5%E6%94%B6%E4%B8%8E%E5%8F%91%E9%80%81%EF%BC%9A%E8%AF%A6%E7%BB%86%E4%BB%8B%E7%BB%8D)