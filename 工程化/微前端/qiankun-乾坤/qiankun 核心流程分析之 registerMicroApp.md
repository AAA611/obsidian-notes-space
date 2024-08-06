 
## registerMicroApp

 registerMicroApp 是 qiankun 中用于注册子应用的 api。具体使用方法及参数说明可以看[这里](https://qiankun.umijs.org/zh/api#registermicroappsapps-lifecycles)

核心代码如下：

```js
export function registerMicroApps<T extends ObjectType>(
  apps: Array<RegistrableApp<T>>,
  lifeCycles?: FrameworkLifeCycles<T>,
) {
  // Each app only needs to be registered once
  // 过滤出未注册的应用
  const unregisteredApps = apps.filter((app) => !microApps.some((registeredApp) => registeredApp.name === app.name));

  microApps = [...microApps, ...unregisteredApps];

  // 循环调用 single 中 registerApplication 注册未注册的应用
  unregisteredApps.forEach((app) => {
    const { name, activeRule, loader = noop, props, ...appConfig } = app;

	// 调用 single-spa api 注册应用
    registerApplication({
      name,
      app: async () => {
        loader(true);
        await frameworkStartedDefer.promise;

        const { mount, ...otherMicroAppConfigs } = (
          await loadApp({ name, props, ...appConfig }, frameworkConfiguration, lifeCycles)
        )();

        return {
          mount: [async () => loader(true), ...toArray(mount), async () => loader(false)],
          ...otherMicroAppConfigs,
        };
      },
      activeWhen: activeRule,
      customProps: props,
    });
  });
}
```

从上面代码可以看到，registerMicroApp 是在 single-spa 的 registerApplication 的基础上做了一些事情：
- 在加载子应用的入口（single-spa 中是 app 参数）中做了处理，其核心主要是 loadApp 函数。
- 加入 loader 方法调用。

## loadApp 流程解析

### 基于 HTML Entry 加载子应用

我们知道 single -spa 是基于 JS Entry 的方式来加载子应用的，这种方式由较大的缺陷，而 qiankun 则是采用了 HTML Entry 的方式来加载子应用。所以 qiankun 在 loadeApp 方法中首先改变了子应用的加载方式：

![[Pasted image 20240711100129.png]]

>📣关于 JS Entry 、HTML Entry 的更多内容可以查看 [[qiankun 原理之 import-html-entry]] 、[[qiankun 与 single-spa 的简单比较]]

### 格式化子应用模板

由于 qiankun 的子应用加载的是一个 HTML 文档，在挂载的时候如果直接将文档添加到子应用对应的 container 节点中，则子应用的 HTML 文档中的一些信息会被浏览器解析时删除。如 head 标签，浏览器不允许在一些其他地方插入 head 标签。所以 qiankun 需要对子应用加载的 HTML 文档做进一步处理

![[Pasted image 20240711101135.png]]

### 初始化子应用挂载点

初始化子应用挂载点，也就是是说 qiankun 需要确保子应用的挂载点 `container` 存在。

![[Pasted image 20240711103635.png]]

![[Pasted image 20240711103728.png]]

例如下面例子，qiankun 需要确认在挂载子应用 App1 的时候，所传入的 DOM 节点（也可能是一个 CSS 选择器）已经存在，这样 qiankun 才可以把加载的子应用模板添加到这个 container 节点中。不然子应用挂载时会找不到挂载点导致抛错。

>📣注意：此时只是确认挂载点已存在，子应用还未执行挂载操作

```js
const app={
	// ...
	name:'App1',
	container:'#app1-container'
}
```

### 初始化沙箱容器

qiankun 使用沙箱进行应用之间的 JS 隔离，因此在执行子应用的 scripts 之前，需要初始化沙箱。

在上面的 [[#基于 HTML Entry 加载子应用]] 中看到，qiankun 使用 import-html-entry 库中的 importEntry 方法来加载子应用，下面是 importEntry 方法的代码，代码中高亮行 execScripts 是 qiankun 执行子应用脚本的方法。可以看到 execScripts 方法可接收一个 proxy 对象，这个对象会作为执行脚本的全局对象。

![[Pasted image 20240711152412.png]]

import-html-entry 实现全局代码对象的方式是通过将脚本插入到一个函数体内，通过 bind 将 proxy 对象绑定为函数的 this 对象，定义名为 window 的对象，然后传入 proxy 作为 window 参数。

核心代码如下：

![[Pasted image 20240711153458.png]]

### 返回 parcelConfigGetter 函数

parcelConfigGetter 是一个函数，返回一个对象，这个对象中包含了如 name、bootstrap、mount、unmount 属性，qiankun 会将其作为调用 registerApplication () 方法中 app 参数的返回对象中的一些值。

TODO

mount 钩子数组

mount 

unmount 钩子数组
## registerMicroApp、loadApp 核心流程图

![[Pasted image 20240711145458.png]]