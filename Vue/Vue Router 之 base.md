## 一、介绍
官方解释：应用的基路径。例如，如果整个单页应用服务在 `/app/` 下，然后 `base` 就应该设为 `"/app/"`。

## 二、详解
### 2-1、normalizeBase
VueRouter 接收到 base 这个配置是如何处理的？下面我们详细介绍下 normalizeBase 这个方法。
```js
function normalizeBase (base: ?string): string {
  if (!base) {
    // 如果没有传 base 选项，则会尝试从 html 中的 base 标签中获取
    if (inBrowser) {
      // respect <base> tag
      const baseEl = document.querySelector('base')
      base = (baseEl && baseEl.getAttribute('href')) || '/'
      // strip full URL origin
      // 去掉协议以及域名部分，留下路径作为 base
      base = base.replace(/^https?:\/\/[^\/]+/, '')
    } else {
      // 如果不是浏览器环境则直接 base='/'
      base = '/'
    }
  }
  // make sure there's the starting slash
  // ⭐ 确保 base 以 / 开头
  if (base.charAt(0) !== '/') {
    base = '/' + base
  }
  // remove trailing slash
  // 去掉 base 结尾的 /
  return base.replace(/\/$/, '')
}
```
总结：normalizeBase 对 base 参数做了下面几件事：
1. 如果没有传 base 参数，在浏览器环境中则从 \<base\> 标签中获取 base，不是浏览器环境则直接将 base 设置为 “/”
2. 如果传了 base 参数，则需要确保 base 以 “/” 开头并且不以“/”结尾。
### 2-2、base 用在哪些地方

1、router.push() 方法
在使用 push 方法进行页面导航的时候，最终我们需要调用原生 History 的 pushState api，这个时候需要在匹配到的路由信息的 fullPath 前面加上 base，最终的导航地址是 base+route.fullPath。
```js
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(location, route => {
      pushState(cleanPath(this.base + route.fullPath))
      handleScroll(this.router, route, fromRoute, false)
      onComplete && onComplete(route)
    }, onAbort)
  }
```

> 其他导航方法如 replace 跟上面逻辑一致，不再一一赘述

## 三、总结
base 参数是创建 VueRouter 实例的重要参数，它的作用是给我们的应用添加公共路由前缀，如果你的应用需要一个公共的路由前缀如：myapp，那么你可以使用 base 参数来进行配置。
