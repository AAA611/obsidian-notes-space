## 介绍

Server-send Event（服务端发送事件，简称 SSE） 是一种服务端向客户端推送消息的机制。底层实现原理基于 HTTP 响应头的 keep-alive

**`EventSource`** 接口是 web 内容与[服务器发送事件](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events)通信的接口。
## 本质

严格地说，[HTTP 协议](https://www.ruanyifeng.com/blog/2016/08/http.html)无法做到服务器主动推送信息。但是，有一种变通方法，就是服务器向客户端声明，接下来要发送的是流信息（streaming）。

也就是说，发送的不是一次性的数据包，而是一个数据流，会连续不断地发送过来。这时，客户端不会关闭连接，会一直等着服务器发过来的新的数据流，视频播放就是这样的例子。本质上，这种通信就是以流信息的方式，完成一次用时很长的下载。

SSE 就是利用这种机制，使用流信息向浏览器推送信息。它基于 HTTP 协议，目前除了 IE/Edge，其他浏览器都支持。

## 与 WebSocket 的比较

SSE 是服务端向客户端推送数据, 是单向的, WebSocket 是双向通信。

但 SSE 有以下优点：

- SSE 使用 HTTP 协议，现有的服务器软件都支持。WebSocket 是一个独立协议。
- SSE 属于轻量级，使用简单；WebSocket 协议相对复杂。
- **SSE 默认支持断线重连**，WebSocket 需要自己实现。
- SSE 一般只用来传送文本，二进制数据需要编码后传送，WebSocket 默认支持传送二进制数据。
- SSE 支持自定义发送的消息类型。

## 服务端实现

### 数据格式⭐

服务器向浏览器发送的 SSE 数据，必须是 UTF-8 编码的文本，具有如下的 HTTP 头信息。

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

每一次发送的消息，有若干个 message 组成，每个 message 之间使用 <mark style="background: #BBFABBA6;">\n\n</mark> 分割。每个`message`内部由若干行组成，每一行都是如下格式。

```
[field]: value\n
```

上面的 field 可以取四个值：

- data
- event
- id
- retry

此外，还可以有冒号开头的行，表示注释。通常，服务器每隔一段时间就会向浏览器发送一个注释，保持连接不中断。

```
: this is a test stream\n\n

data: some text\n\n

data: another message\n
data: with two lines \n\n
```

### data 字段

数据内容用 `data` 字段表示。

```
data:  message\n\n
```

如果数据很长，可以分成多行，最后一行用 `\n\n` 结尾，前面行都用 `\n` 结尾。

```
data: begin message\n
data: continue message\n\n
```

下面是一个发送 JSON 数据的例子。

```js
data: {\n
data: "foo": "bar",\n
data: "baz", 555\n
data: }\n\n
```

### id 字段

数据标识符用 `id` 字段表示，相当于每一条数据的编号。

```
id: msg1\n
data: message\n\n
```

浏览器用`lastEventId`属性读取这个值。一旦连接断线，浏览器会发送一个 HTTP 头，里面包含一个特殊的`Last-Event-ID`头信息，将这个值发送回来，用来帮助服务器端重建连接。因此，这个头信息可以被视为一种同步机制。

### event 字段

`event`字段表示自定义的事件类型，默认是`message`事件。浏览器可以用`addEventListener()`监听该事件。

```
event: foo\n
data: a foo event\n\n

data: an unnamed event\n\n

event: bar\n
data: a bar event\n\n
```

上面的代码创造了三条信息。第一条的名字是 `foo`，触发浏览器的 `foo` 事件；第二条未取名，表示默认类型，触发浏览器的 `message` 事件；第三条是 `bar`，触发浏览器的 `bar` 事件。

### retry 字段

服务器可以用`retry`字段，指定浏览器重新发起连接的时间间隔。

```
retry: 10000\n
```

两种情况会导致浏览器重新发起连接：

- 一种是时间间隔到期，
- 二是由于网络错误等原因，导致连接出错。


## 代码实现

### Node 服务端实现

**server. js**

```js
const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');

const PORT = 3000;

function createFileStream(filePath) {
    return fs.createReadStream(filePath, { encoding: 'utf-8', highWaterMark: 1 });
}

app.use(ctx => {
    if (ctx.path === '/events') {
        const filePath = path.resolve(__dirname, './events.md');

        ctx.response.type = 'text/event-stream';
        ctx.response.set('Cache-Control', 'no-cache');
        ctx.response.set('Connection', 'keep-alive');
        ctx.response.set('Access-Control-Allow-Origin', '*');

        const fileStream = createFileStream(filePath);

        const stream = new PassThrough();

        ctx.response.body = stream;

        fileStream.on('data', chunk => {
            stream.write(`data: ${chunk}\n\n`);
        });

        fileStream.on('end', () => {
            stream.write('data: [DONE]\n\n');
            stream.end();
        });

        fileStream.on('error', (err) => {
            stream.write('data: [ERROR]\n\n');
            stream.end();
        });

        ctx.req.on('close', () => {
            fileStream.destroy();
        });
    }
});

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});

```

### 客户端实现

**client. html**

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <pre id="events"></pre>
    <script>
        const eventSource = new EventSource('http://localhost:3000/events');
        eventSource.onopen = function (event) {
            // 
        }
        eventSource.onmessage = function (event) {
            if (event.data === '[DONE]') {
                eventSource.close();
            } else {
                const pre = document.getElementById('events');
                pre.textContent += event.data + '\n';
            }
        }
        eventSource.onerror = (error) => {
            console.log(2);
            console.error('SSE error:', error);
        };
    </script>
</body>

</html>
```

## 参考

[EventSource - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventSource)
[Server-Sent Events 教程 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html)