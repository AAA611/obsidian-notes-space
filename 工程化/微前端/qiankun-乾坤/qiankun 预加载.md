预加载值得是在使用内容之前提前加载内容。在 qiankun 中，尤其是当某个子应用内容较多，加载较慢时，预加载就显得尤为重要。它能够加快子应用的打开速度。

qiankun 中使用预加载有下面两种方式：
- 基于路由注册子应用时，可以在调用 `start()` 方法是配置 `prefetch` 参数（默认为 `true`）
- 手动加载子应用时，可以使用 ### `prefetchApps(apps, importEntryOpts?)` API

### 使用 prefetch 参数

- prefetch - `boolean | 'all' | string[] | (( apps: RegistrableApp[] ) => { criticalAppNames: string[]; minorAppsName: string[] })` - 可选，是否开启预加载，**默认为 `true`**。
    
    配置为 `true` 则会在第一个微应用 mount 完成后开始预加载其他微应用的静态资源
    
    配置为 `'all'` 则主应用 `start` 后即开始预加载所有微应用静态资源
    
    配置为 `string[]` 则会在第一个微应用 mounted 后开始加载数组内的微应用资源
    
    配置为 `function` 则可完全自定义应用的资源加载时机 (首屏应用及次屏应用)

### 使用 prefetchApps 方法

使用方法如下：

```js
import { loadMicroApp, prefetchApps } from 'qiankun'

const apps=[
	app1:{...},
	app2:{...}
]

prefetchApps(apps) // 预加载所有子应用
```

### prefetch 原理解析

#### prefetch 方法

qiankun 中主要执行预加载的方法是 `prefetch` 方法，主要是使用浏览器 [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback) API 在浏览器空闲的时候执行预加载。

核心代码如下：

```js
/**
 * prefetch assets, do nothing while in mobile network
 * @param entry // 需要预加载的子应用的入口地址
 * @param opts  // importEntry 的配置信息
 */
function prefetch(entry: Entry, opts?: ImportEntryOpts): void {
  // 无网络或在弱网环境下不执行预加载
  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }

  // 在空闲时间执行预加载
  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry, opts);
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });
}
```

#### prefetchAfterFirstMounted

在第一个子应用挂载完之后预加载其他子应用，利用 `single-spa` 中的 `single-spa：first-mount` 钩子实现。

核心代码如下：

```js
function prefetchAfterFirstMounted(apps: AppMetadata[], opts?: ImportEntryOpts): void {

  // 监听 single-spa 中第一个应用挂载后的事件
  window.addEventListener('single-spa:first-mount', function listener() {
	// 得到未加载的子应用列表
    const notLoadedApps = apps.filter((app) => getAppStatus(app.name) === NOT_LOADED);

    if (process.env.NODE_ENV === 'development') {
      const mountedApps = getMountedApps();
      console.log(`[qiankun] prefetch starting after ${mountedApps} mounted...`, notLoadedApps);
    }

	// 遍历进行预加载
    notLoadedApps.forEach(({ entry }) => prefetch(entry, opts));

	// 移除事件监听
    window.removeEventListener('single-spa:first-mount', listener);
  });
}
```

#### prefetchImmediately

立即执行预加载，逻辑就是循环执行 [[#prefetch 方法]] 。


```js
export function prefetchImmediately(apps: AppMetadata[], opts?: ImportEntryOpts): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[qiankun] prefetch starting for apps...', apps);
  }

  apps.forEach(({ entry }) => prefetch(entry, opts));
}
```

## 总结
本文主要介绍了 qiankun 中的预加载策略以及其实现原理。主要通过使用  [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)方法来利用浏览器的空闲事件来请求子应用资源。
合理地使用预加载（或自定义预加载策略）可以有效提升子应用的加载速度，提高用户体验。