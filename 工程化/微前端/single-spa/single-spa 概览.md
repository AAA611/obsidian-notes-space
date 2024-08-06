## 一、single-spa 是什么？
single-spa 是一个将多个单页应用聚合为一个整体应用的微前端框架。换句话说，single-spa 是一个容器，用于管理同一个页面上运行的多个应用。
## 二、single-spa 做了什么？
single-spa 作为多个应用的容器，主要有以下功能
1. 注册应用：single-spa 作为一个容器，可以注册多个应用。
2. 根据路由管理应用：single-spa 应用管理是基于路由，应用配置中有 activeWhen 选项，single-spa 会监听路由变化，从而结合 activeWhen 来得到哪些应用应用应该激活，哪些应用应该失活。然后调用应用暴露出的对应的生命周期钩子来实现应用的管理