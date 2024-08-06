## 为什么需要 Reflect

`Proxy`和`Reflect`的关系体现在它们共同协作时。在`Proxy`的捕获器函数中，开发者可以调用对应的`Reflect`方法，以实现默认的行为，同时加入自己的操纵和侧面逻辑。`Reflect`方法提供了一种方便的方式来保持默认行为，而不需要手动编写这些语义。
## 参考

[Proxy 和 Reflect 有什么关系？【热度: 361】 · Issue #695 · pro-collection/interview-question · GitHub](https://github.com/pro-collection/interview-question/issues/695)