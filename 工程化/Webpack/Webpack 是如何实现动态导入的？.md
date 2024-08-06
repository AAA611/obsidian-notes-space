## 是什么

动态导入时 ESM 的一个新语法，弥补了 ESM 不能实现动态导入的问题。在实际场景中，动态导入是一个十分重要的东西。利用它可以实现按需加载，这也是现代 web 应用的一个重要的优化手段。

## 怎么使用

```js
import('./someModule').then(module => {})
```

## 原理是什么

### webpack 实现

假设现在有一个动态导入语句：

```js
import('./common')
```

webpack 打包产物如下：

```js
__webpack_require__.e("src_common_js").then(__webpack_require__.bind(__webpack_require__, "./src/common.js"))
```

可以看到，import () 语句被编译为 `__webpack_require__.e` 函数，函数代码如下：

```js
/* webpack/runtime/ensure chunk */
(() => {
	__webpack_require__.f = {};
	// This file contains only the entry chunk.
	// The chunk loading function for additional chunks
	__webpack_require__.e = (chunkId) => {
		return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
			__webpack_require__.f[key](chunkId, promises);
			return promises;
		}, []));
	};
})();
```

其中 `__webpack_require__.f` 是一个对象里面包含了处理模块的方法，经调试在这里 `__webpack_require__.f` 中包含了一个属性 j，是 webpack 中用于处理 Jsonp 加载模块的方法。

> 关于__webpack_require__. f 可以看 [[__webpack_require__. f 是什么？]]

`__webpack_require__.f.js` 的主要代码如下：

```js
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if (installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 					// a Promise means "currently loading".
/******/ 					if (installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
        /******/
      } else {
/******/ 						if (true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId); // ⭐ 获取要加载的动态模块的地址
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if (__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if (installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if (installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                var realSrc = event && event.target && event.target.src;
                error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
                error.name = 'ChunkLoadError';
                error.type = errorType;
                error.request = realSrc;
                installedChunkData[1](error);
              }
            }
          };
          __webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId); // ⭐ 调用加载函数
        }
      }
    }
  };
```

这里面主要是检查模块是否已经加载过，如果已经加载过则直接返回。如果没有加载过，则获取要加载的模块地址，然后调用 `__webpack_require__.l` 方法加载远程模块。

> `__webpack_require__.l` 是 load 远程模块的方法。

`__webpack_require__.l` 主要代码如下：

```js
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
```

其主要逻辑是通过创建 script 标签来实现模块的加载与执行。

## 总结

webpack 实现动态加载的流程如下：

- 将 import () 编译为 `__webpack_require__.e` 函数
- `__webpack_require__.e` 用于加载远程模块，内部调用 `__webpack_require__.f.j` 来使用 jsonp 加载模块
- `__webpack_require__.f.j` 检查是否已加载
	- 已加载，使用缓存
	- 未加载，构造 url 调用 `__webpack_require__.l` 来加载模块。
- `__webpack_require__.l` 主要通过创建 script 标签，利用 jsonp 原理跨域来实现模块加载。


