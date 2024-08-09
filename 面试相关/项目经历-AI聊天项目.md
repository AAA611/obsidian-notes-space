
## 项目介绍

`Vue3` `Pinia` `Vite` `TypeScript` `Docker` `Nginx` `Jenkins`
- **项目描述**
	 一个用于公司内部人员的一款 AI 聊天软件。包括 PC 端网站、PC 浏览器插件、公共库。主要功能有 AI 聊天、定制化 AI 聊天指令等
- **人员规模** 
	 研发 3，前端 1
- **负责内容**
	1. 项目从 0 到 1 的搭建、功能开发、迭代、维护
	3. 基于 Docker、 Nginx、Jenkins 实现简单的项目自动化部署工作流
	4. 聊天功能的浏览器插件开发、公共逻辑抽离复用
- **难点与亮点**：
	1. 使用 IndexDB 代替 LocalStorage 的优化聊天内容的存储
	2. 实现聊天功能插件系统，便于聊天功能扩展
	3. 封装聊天功能核心逻辑与组件，在多个项目中实现复用
	4. 使用 ShadowDOM 实现浏览器插件的样式隔离

## 可能会问到的问题

### 说一下 EventSource，使用 EventSource 的原因？为什么不使用 WebSocket

关于 EventSource 可以参考： [[Server-sent Event 服务端推送事件]]

**选择 EventSource 的原因**：

- 需要支持聊天流，所以只是在发起一个聊天时，服务端能不断地往客户端推送数据，所以通信是单向的：服务端=>户端。EventSource 符合这个场景
- 从简单易用方面来看，WebSocket 是一个新的通信协议，浏览器在使用时需要从 Http 协议通过一些请求头字段来做协议升级。并且 WebScoket 需要服务端支持。相比之下，EventSource 本身就是基于 Http 协议的 Connection： keep-alive 实现的，因此不需要做协议升级，而且服务端的开发量相对较少。

鉴于上面两个主要原因，最终选择了 EventSource 来实现流式的聊天对话

### 详细说说聊天功能是怎么开发的

基于 [[Server-sent Event 服务端推送事件]] 的服务端消息响应

### 聊天插件指的是什么？

聊天的部分可能需要根据用户选择的功能场景（如选择定制的 AI 角色、产品）不同调用它不同的聊天接口，而且页面上的 UI 渲染会不一样。

基于这个场景设计了一个功能插件机制，插件可以是一个 JS 对象或者是一个组件。

另外还有一个插件管理组件（插件容器），负责 1、插件选择列表部分的渲染；2、当前正在使用哪个插件。选择插件时的插件卸载、安装工作。

这样做的好处是在后续添加新的功能式会非常方便，组件在 plugins 文件夹中根据插件的要求编写新的组件即可。

### 抽离了哪些可复用的逻辑？

1、聊天窗口组件，主要有聊天记录组件与聊天对话输入框组件，传入相应的 props 如 chatRecordList 即可
2、聊天逻辑 useChat hook 的封装，这个 hook 返回了两个对象、chatRecordList 等，分别是 user 与 ai，各自有 say 方法来进行聊天。

#### useChat

useChat 的用法主要是调用 useChat () 函数，然后传入一些关于这个聊天的一些内容如：id，type 等等。

返回值是一个 chat 对象，对象中包含了两个聊天对象，一个聊天记录列表，和一些方法如 switchChat，saveChat 等等。

useChat 中有关于聊天记录保存的逻辑

**useChat 封装了哪些逻辑：**

- 创建聊天对象 chat，其中包含链条对象，user、ai
- 切换聊天上下文功能，保存聊天记录功能，（创建）

#### 一些组件

- 聊天组件：包括气泡聊天列表，聊天输入框、历史记录列表。

### 使用 IndexDB 来代替 LocalStorage 有哪些优点？

**背景 OR 动机**

处于一些原因，聊天记录的储存需客户端实现，对比了 localStorage 与 IndexDB，由于聊天内容可能会非常的多，所以选择使用容量更高的 IndexDB，同时也更加符合场景。

1. **数据容量**
	- IndexDB：提供了更大的存储容量，通常在几百 MB 到几 GB 之间，具体取决于浏览器和设备的实现。
	- LocalStorage：存储容量较小，通常限制在 5-10 MB 之间，具体数值依赖于浏览器实现。
2. **数据结构**
	- IndexDB：支持更加复杂的数据结构
	- LocalStorage：只支持能够 JSON 话的字符串
3. **查询能力**
	- IndexDB：支持复杂的查询能力，可以创建索引来加速查询
	- LocaStorage：不支持查询
4. **异步操作**
	- IndexDB：所有的操作都是异步的，不阻塞主线程的执行
	- LocalStorage：同步执行，影响后续操作
5. **事务支持**
	- IndexDB：支持事务操作
	- LocalStorage：不支持事务操作
6. **数据持久化**
	- IndexDB：持久
	- LocalStorage：持久

### 浏览器插件中基于 ShadowDOM 的样式隔离。

[[ShadowDOM 入门]]


### 如何使用 docker + jenkins 构建 CI/CD 的 ？以及这样做有什么好处？

**背景**

由于项目最开始是一个测试项目，所以部署在一个公司分配的的服务器上，部署步骤如下：

- 进入公司服务器的远程 shell 连接
- 安装 git、node、nginx 等
- 只是使用 nginx 起了一个服务，每次代码更新 git clone 、npm build 都还需要自己手动操作

**解决方案**

使用 docker 部署

**解决方案 plus**

使用 docker+nginx +jenkins 实现项目的自动化

- 使用 jenkins 镜像启动一个 jenkins 容器
- 编写 jenkinsfile 添加项目流水线，流水线主要分为下面几个阶段：

1. **Checkout** Stage 源代码代码分支拉取
	- 使用一个自定义的镜像，里面包含了一个固定的 nodejs 版本与 git，项目将使用这个 node 版本进行编译。
2. **Build** Stage 产物构建
	- 项目依赖安装
	- 项目打包
3. **Build Docker Image** Stage 根据产物构建镜像
	- 根据打包产物，基于 nginx 镜像构建一个产物镜像（这样做的好处是打包出的镜像可以移植到任何地方使用，直接基于这个镜像启动一个容器即可）
4. **Deploy** Stage 部署阶段
	- 使用产物镜像进行部署，基于产物镜像启动一个 docker 容器来提供 nginx 服务

- 添加 webHooks，流水线有了，想要在进行某些操作（如 git push event）时自动触发 jenkins 的流水线打包。

**后续的可优化点**：

1. 构建通知