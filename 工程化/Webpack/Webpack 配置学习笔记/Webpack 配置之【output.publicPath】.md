## 一、是什么
publicPath 是配置中 output 配置中的一个选项，是打包后资源加载的前缀地址。使用方法如下：
```js
const path = require('path');

module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, 'public/assets'),
    publicPath: 'https://cdn.example.com/assets/',
  },
};
```

假设我们有一个 Vue 项目有如下配置：
```js
publicPath: 'http://localhost:8081/',
```

那么 build 之后的产物 index.html:
```html
<!doctype html>
<html lang="">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="icon" href="http://localhost:8081/favicon.ico">
  <title>vue-app</title>
  <script defer="defer" src="http://localhost:8081/js/chunk-vendors.a2a01f19.js"></script>
  <script defer="defer" src="http://localhost:8081/js/app.1242a0a3.js"></script>
  <link href="http://localhost:8081/css/app.7c12303e.css" rel="stylesheet">
</head>

<body><noscript><strong>We're sorry but vue-app doesn't work properly without JavaScript enabled. Please enable it to
      continue.</strong></noscript>
  <div id="app"></div>
</body>

</html>
```
可以看到所有的资源加载都被加上了 publicPath 前缀。

上面是入口资源，我们在看看项目中的资源加载路径。组件 HelloWorld 中有一个使用图片的地方。
```html
// HelloWorld.vue
<template>
  <div class="hello">
    <img :src="logo" alt="">
  </div>
</template>

<script>
import logo from '../assets/logo.png'
export default {
  name: 'HelloWorld',
  data() {
    return {
      logo
    }
  }
}
</script>
```
同时在 vue.config 中使用资源处理模块来处理图片，如下：
```js
module: {
  rules: [
	{
	  test: /\.(png|jpe?g|gif)$/i,
	  type: 'asset/resource', // 使用资源模块处理图片文件,图片会被解析成路径地址
	},
  ]
}
```
打包后的代码如下：
```js
var logo_namespaceObject = __webpack_require__.p + "img/logo.6c137b82.png";
```

> $\_\_webpack\_require\_\_.p$ 是 webpack 打包后存储 publicPath 的全局变量

可以看到项目中的资源的引用也会被加上 publicPath 前缀。

总结：
publicPath 是一个打包后资源的引用地址的前缀

## 二、作用
上面我们已经了解了 publicPath 的简单用法它是干嘛的，下面我们讨论一下它在实际场景中究竟有哪些用法。

在普通情况下，我们会将应用打包后的产物部署到服务器上，TODO

## 三、动态 publicPath
动态 *publicPath* 顾名思义，是我们需要在程序运行时才能决定 *publicPath* 到底是什么。依赖于项目运行时，而不是一开始就确定了的。

如何在运行时设置 *publicPath*？*webpack* 暴露了一个全局变量 $\_\_webpack\_public\_path\_\_$ ，在程序运行时可以直接通过设置这个变量的值来实现动态 *publicPath*。

### 3-1、使用场景

1、动态 CDN 地址
假如我们的项目中的一些静态资源如图片、字体等是托管在 CDN 的，在你的代码中希望根据用户信息来动态选择 CDN地址。那么你可以这样：
```js
// index.js

// 假设有一个函数能够根据用户地理位置返回对应的 CDN 前缀
const getCDNPrefix = () => {
  // 这里可以使用 GeoIP 服务来确定用户地理位置
  const userLocation = getUserLocation(); // 假设这是一个获取用户地理位置的函数
  if (userLocation === 'US') {
    return 'https://us-cdn.example.com/assets/';
  } else if (userLocation === 'EU') {
    return 'https://eu-cdn.example.com/assets/';
  } else {
    return 'https://default-cdn.example.com/assets/';
  }
};

// 动态设置 publicPath
__webpack_public_path__ = getCDNPrefix();

// 加载模块和资源
import('./module').then(module => {
  console.log('Module loaded:', module);
});

```

2、微前端中的的子应用资源加载（以 qiankun 为例）
在使用 qiankun 构建微前端应用时，需要在主应用中加载子应用。如果主应用与子应用部署在不同的域名，那么主应用在加载子应用的静态资源时可能会出现 404 错误。这是因为主应用在加载子应用的静态资源时，会按照主应用当前路径去请求子应用的资源，由于子应用时部署在其他地方，所以主应用自然请求不到。这个时候就需要在子应用中动态设置 publicPath
```js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

> *window.\_\_INJECTED\_PUBLIC\_PATH\_BY\_QIANKUN\_\_* 是 qiankun 为子应用生成的一个 publicPath,它的值是注册子应用时的入口地址。

通过动态设置 publicPath 之后，主应用在加载子应用的资源时，资源地址前面就会被加上子应用的入口地址，这样就可以正确加载了。
## 四、总结
publicPath 是 webpack 打包中的一个重要概念，它决定了打包后的代码中加载资源的路径（作为资源路径的前缀）。这通常与项目资源的部署有关，我们需要确保代码中加载资源的路径与实际资源所在的（资源所部署的位置）相同，这样才能保证正确无误地加载资源。

