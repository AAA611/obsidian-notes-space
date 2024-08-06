## 什么是 WebScoket

WebScoket 是一个协议。我们常见的浏览器中的 WebScoket 是一个 API，它用于控制 WebScoket 协议。

WebScoket 位于 OSI 模型中的应用层，是一个基于 TCP 的通信协议。主要特点如下：
- 与 HTTP 协议兼容：WebScoket 可以通过 HTTP 中的 Upgrade 头将通信协议转为 WebScoket 协议。
- 全双工通信：WebScoket 提供全双工模式的通信，通信双方都可以自由、主动地向对方发送数据。这也是 WebScoket 最大的优势之一。
- 连接保持：相比于 HTTP  协议，基于 WebScoket 的连接可以保持相对较长时间。
- 面向文本和二进制：WebScoket 可以传输文本数据，也可以直接传输二进制数据。

## 为什么会出现 WebScoket

传统互联网中