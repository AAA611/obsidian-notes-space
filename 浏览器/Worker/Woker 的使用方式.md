## 常规 Worker

通常情况下，Worker 脚本回作为一个单独的 JS 文件存在：

```js
// woker.js
self.onmessage=(event) => {
  console.log("🚀 ~ event:", event)
  postMessage('900')
}
```

```html
// index.html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <button id="btn">click</button>
  <script>
    const btn = document.getElementById('btn')

    const worker = new Worker('./worker1.js')

    let count = 1

    btn.addEventListener('click', () => {
      count++
      worker.postMessage({ a: new Map() })
    })

    worker.addEventListener('message', (event) => {
      console.log("🚀 ~ worker.addEventListener ~ event:", event)
    })
  </script>
</body>

</html>
```
## 嵌入式 Worker

嵌入式 Worker 指的是使用 `<script>` 标签将 worker 脚本嵌入到 `html` 中。下面是一个嵌入式 Woker 的示例：

```html
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>MDN Example - Embedded worker</title>
    <script type="text/js-worker">
      // 该脚本不会被 JS 引擎解析，因为它的 mime-type 是 text/js-worker。
      const myVar = 'Hello World!';
      // 剩下的 worker 代码写到这里。
    </script>
    <script>
      // 该脚本会被 JS 引擎解析，因为它的 mime-type 是 text/javascript。
      function pageLog(sMsg) {
        // 使用 fragment：这样浏览器只会进行一次渲染/重排。
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createTextNode(sMsg));
        frag.appendChild(document.createElement("br"));
        document.querySelector("#logDisplay").appendChild(frag);
      }
    </script>
    <script type="text/js-worker">
      // 该脚本不会被 JS 引擎解析，因为它的 mime-type 是 text/js-worker。
      onmessage = (event) => {
        postMessage(myVar);
      };
      // 剩下的 worker 代码写到这里。
    </script>
    <script>
      // 该脚本会被 JS 引擎解析，因为它的 mime-type 是 text/javascript。

      // 过去存在 blob builder，但现在我们使用 Blob
      const blob = new Blob(
        Array.prototype.map.call(
          document.querySelectorAll("script[type='text\/js-worker']"),
          (script) => script.textContent,
          { type: "text/javascript" },
        ),
      );

      // 创建一个新的 document.worker 属性，包含所有 "text/js-worker" 脚本。
      document.worker = new Worker(window.URL.createObjectURL(blob));

      document.worker.onmessage = (event) => {
        pageLog(`Received: ${event.data}`);
      };

      // 启动 worker。
      window.onload = () => {
        document.worker.postMessage("");
      };
    </script>
  </head>
  <body>
    <div id="logDisplay"></div>
  </body>
</html>
```
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>MDN Example - Embedded worker</title>
    <script type="text/js-worker">
      // 该脚本不会被 JS 引擎解析，因为它的 mime-type 是 text/js-worker。
      const myVar = 'Hello World!';
      // 剩下的 worker 代码写到这里。
    </script>
    <script>
      // 该脚本会被 JS 引擎解析，因为它的 mime-type 是 text/javascript。
      function pageLog (sMsg) {
        // 使用 fragment：这样浏览器只会进行一次渲染/重排。
        const frag = document.createDocumentFragment ();
        frag.appendChild (document.createTextNode (sMsg));
        frag.appendChild (document.createElement ("br"));
        document.querySelector (" #logDisplay "). appendChild (frag);
      }
    </script>
    <script type="text/js-worker">
      // 该脚本不会被 JS 引擎解析，因为它的 mime-type 是 text/js-worker。
      onmessage = (event) => {
        postMessage (myVar);
      };
      // 剩下的 worker 代码写到这里。
    </script>
    <script>
      // 该脚本会被 JS 引擎解析，因为它的 mime-type 是 text/javascript。

      // 过去存在 blob builder，但现在我们使用 Blob
      const blob = new Blob (
        Array.prototype.map.call (
          document.querySelectorAll ("script[type='text\/js-worker']"),
          (script) => script. textContent,
          { type: "text/javascript" },
        ),
      );

      // 创建一个新的 document. worker 属性，包含所有 "text/js-worker" 脚本。
      document. worker = new Worker (window.URL.createObjectURL (blob));

      document. worker. onmessage = (event) => {
        pageLog (`Received: ${event. data}`);
      };

      // 启动 worker。
      window. onload = () => {
        document.worker.postMessage ("");
      };
    </script>
  </head>
  <body>
    <div id="logDisplay"></div>
  </body>
</html>

<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>MDN Example - Embedded worker</title>
    <script type="text/js-worker">
      // 该脚本不会被 JS 引擎解析，因为它的 mime-type 是 text/js-worker。
      const myVar = 'Hello World!';
      // 剩下的 worker 代码写到这里。
    </script>
    <script>
      // 该脚本会被 JS 引擎解析，因为它的 mime-type 是 text/javascript。
      function pageLog(sMsg) {
        // 使用 fragment：这样浏览器只会进行一次渲染/重排。
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createTextNode(sMsg));
        frag.appendChild(document.createElement("br"));
        document.querySelector("#logDisplay").appendChild(frag);
      }
    </script>
    <script type="text/js-worker">
      // 该脚本不会被 JS 引擎解析，因为它的 mime-type 是 text/js-worker。
      onmessage = (event) => {
        postMessage(myVar);
      };
      // 剩下的 worker 代码写到这里。
    </script>
    <script>
      // 该脚本会被 JS 引擎解析，因为它的 mime-type 是 text/javascript。

      // 过去存在 blob builder，但现在我们使用 Blob
      const blob = new Blob(
        Array.prototype.map.call(
          document.querySelectorAll("script[type='text\/js-worker']"),
          (script) => script.textContent,
          { type: "text/javascript" },
        ),
      );

      // 创建一个新的 document.worker 属性，包含所有 "text/js-worker" 脚本。
      document.worker = new Worker(window.URL.createObjectURL(blob));

      document.worker.onmessage = (event) => {
        pageLog(`Received: ${event.data}`);
      };

      // 启动 worker。
      window.onload = () => {
        document.worker.postMessage("");
      };
    </script>
  </head>
  <body>
    <div id="logDisplay"></div>
  </body>
</html>
