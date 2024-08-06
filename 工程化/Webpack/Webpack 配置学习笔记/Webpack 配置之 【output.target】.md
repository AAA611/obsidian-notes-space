## var

将入口文件的导出赋值给一个变量，变量名是 libary.target.name

```js
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createApp: () => (/* binding */ createApp),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const createApp = () => {
  return {
    name: 'App'
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createApp);

AppLib = __webpack_exports__; 
```

## module
输出 ESM。

由于这是 webpack （当前是 webpack5 ）的实验性功能，所以需要额外配置：

```js
experiments: {
	outputModule: true,
}
```

产物大概如下所示

```js
const createApp = () => {
  return {
    name: 'App'
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createApp);

var __webpack_exports__createApp = __webpack_exports__.E;
var __webpack_exports__default = __webpack_exports__.A;
export { __webpack_exports__createApp as createApp, __webpack_exports__default as default };
```

## commonjs
```js
const createApp = () => {
  return {
    name: 'App'
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createApp);





exports.AppLib = __webpack_exports__;
```

## 
```js
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createApp: () => (/* binding */ createApp),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const createApp = () => {
  return {
    name: 'App'
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createApp);

module.exports = __webpack_exports__;
```
