## 一、qiankun 加载子应用的方式
qiankun 中加载子应用的方式是 HTML Entry 的方式，也就是说子应用需要提供一个 html 文件，qiankun 就可以正确加载。使用的是 import-html-entry 这个库。

> 与 single-spa 不同的是，single-spa 加载子应用的方式是 JS Entry 的方式，子应用以一个 js 文件的形式被加载。

示例如下：

```js
import { registerMicroApp,start() } from 'qiankun'
const microApps = [
  {
    name: 'vue-app',
    entry: '//localhost:3001',
    container: '#container1',
    activeRule: '/app1',
  }
]

registerMicroApp(microApps)

start()
```

主应用加载子应用的入口 entry 是 // localhost:3001,主应用请求 entry 时会返回一个 html 文件如下：

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="/favicon.ico">
    <title>vue-app</title>
  <script defer src="/js/chunk-vendors.js"></script><script defer src="/js/app.js"></script></head>
  <body>
    <noscript>
      <strong>We're sorry but vue-app doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
  </body>
</html>

```

这个 html 文件是子应用的入口，import-html-entry 可以自动解析这个 html 中的资源并请求、执行。执行完 js 脚本之后可以得到入口脚本的导出内容。所以在 qiankun 中可以获取到子应用在入口文件导出的生命周期钩子。