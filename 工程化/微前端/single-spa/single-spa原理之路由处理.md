## 一、问题引入

我们知道，single-spa 是一个将多个单页面应用聚合的一个微前端框架，在注册好应用之后，single-spa 可以帮助我们管理多个微应用的初始化、挂载、卸载等一系列生命周期。

假设现在我们有如下配置：

```js
import { registerApplication, start } from 'single-spa'

const App1 = {
    bootstrap: () => Promise.resolve("bootstrap App1"),
    mount: () => Promise.resolve("mount App1"),
    unmount: () => Promise.resolve("unmount App1"),
}

const App2 = {
    bootstrap: () => Promise.resolve("bootstrap App2"),
    mount: () => Promise.resolve("mount App2"),
    unmount: () => Promise.resolve("unmount App2"),
}

// register App1
registerApplication({
    name: "App1",
    app: () => Promise.resolve(App1),
    activeWhen: "/app1",
    customProps: {
        
    },
})

// register App2
registerApplication({
    name: "App2",
    app: () => Promise.resolve(App2),
    activeWhen: "/app2",
    customProps: {
        
    },
})

start()
```

当路由地址由 /app1 变为 /app2 时，App1 应该被卸载，而 App2 应该被挂载激活，那 single-spa 是如何知道这一地址的变化并且正确地管理多个子应用的呢？本文就详细讨论 single-spa 在路由方面做了那些事情。

## 二、全局监听 hashchange、popstate

与页面地址变化相关的事件主要有两个，分别是 hashchange（主要是使用 hash 路由的应用）、popstate（主要是使用 H5 histoiry 路由的应用）。

如何在页面触发这两个事件时，single-spa 做出响应？则需要全局监听这两个事件，single-spa 代码如下：

```js
// We will trigger an app change for any routing events.
window.addEventListener("hashchange", urlReroute);
window.addEventListener("popstate", urlReroute);

function urlReroute() {
  reroute([], arguments); // reroute 是 single-spa 中对多个应用加载、处理应用变更的函数
}
```

可以看到 single-spa 中通过全局监听 hashchange、popstate 事件来相应页面路由的变化，从而达到在路由变化后处理应用变更的目的。

## 三、劫持 pushState、replaceState

在使用 H5 history 路由方案的应用中，代码中需要使用 history.pushState 这个 api 对地址进行变更，但有时这并不会触发 popstate 事件，因此我们还需要拦截 pushState 方法，在其中手动触发 popstate 事件。
single-spa 代码如下：

```js
// 劫持 pushState方法,这样我们可以做一些其他事情
window.history.pushState = patchedUpdateState(
window.history.pushState,
"pushState"
);
window.history.replaceState = patchedUpdateState(
originalReplaceState,
"replaceState"
);

function patchedUpdateState(updateState, methodName) {
  return function () {
    const urlBefore = window.location.href;
    const result = updateState.apply(this, arguments); // 调用原方法
    const urlAfter = window.location.href;

    // 在这里可手动触发事件
    if (!urlRerouteOnly || urlBefore !== urlAfter) {
      // fire an artificial popstate event so that
      // single-spa applications know about routing that
      // occurs in a different application
      window.dispatchEvent(
        createPopStateEvent(window.history.state, methodName)
      );
    }

    return result;
  };
}
```
## 四、延迟 hashchange、popstate 回调

single-spa 管理多个应用的生命周期，被卸载的应用注册的回调不应该被调用。

假如现在使用 pushState 将地址由 /app2 变为 /app1，App2 将会被卸载，App1 将被挂载。地址栏变化的同时，需要触发应用注册的 popstate 事件回调，由于 App2 将要被卸载，所以其注册的回调就不需要调用了。因此此时我们不能直接调用回调，而是要等待那些将要被卸载的应用卸载完成之后再调用。

single-spa 不会调用那些即将被卸载的应用的 hashchange、popstate 回调函数，对应将要被卸载的应用，single-spa 等待这些应用卸载完成并清理掉它们的回调事件，然后再调用回调函数。
single-spa 代码如下：

劫持 addEventListener 函数

```js
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;
// 劫持 addEventListener 函数并捕获 hashchange、popstate 事件的回调
window.addEventListener = function (eventName, fn) {
if (typeof fn === "function") {
  if (
	routingEventsListeningTo.indexOf(eventName) >= 0 &&
	!find(capturedEventListeners[eventName], (listener) => listener === fn)
  ) {
	capturedEventListeners[eventName].push(fn);
	return;
  }
}

// 其他事件正常调用原函数
return originalAddEventListener.apply(this, arguments);
};
```

等待应用卸载后调用回调函数

```js
// 卸载应用的 Promise
return unmountAllPromise
  .catch((err) => {
	callAllEventListeners();
	throw err;
  })
  .then(() => {
	// 现在，那些该卸载的应用都已经卸载完毕了，它们的回调也该清理完毕了，现在可以安全地调用        // hashchange、popstate 这些事件的回调函数了
	callAllEventListeners();
```

## 五、总结

本文主要介绍了 single-spa 如何处理路由来管理多个应用的基本原理。
- 如何相应路由变化来管理应用？single-spa 通过全局监听 hashchange、popstate事件来重新处理应用的挂载、卸载、更新等操作。
- 代码中如何每次导航都触发相应的 popstate事件？single-spa 通过劫持 pushState，replaceState 方法，在调用原函数的基础上手动增加触发 popstate 事件的逻辑。
- 如何保证卸载的应用不再调用注册的事件回调？对于 hashchange、popstate 事件，single-spa 会等待应用卸载完成后再调用，这样留给应用自己清理回调的机会。而对于其他监听事件，我们也应该在应用卸载时（unmount）钩子中将其清理，以免对其他地方产生副作用。