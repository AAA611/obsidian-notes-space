
## Host 请求头介绍

**Host** 请求头指明了请求将要发送到的服务器主机名和端口号。

如果没有包含端口号，会自动使用被请求服务的默认端口（比如 HTTPS URL 使用 443 端口，HTTP URL 使用 80 端口）。

⭐所有 HTTP/1.1 请求报文中必须包含一个 `Host` 头字段。对于缺少 `Host` 头或者含有超过一个 `Host` 头的 HTTP/1.1 请求，可能会收到 [`400`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/400)（Bad Request）状态码。

> 参考：[Host - HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Host)

## Host 与虚拟主机

在另一篇文章 [[虚拟主机与 Host 请求头]] 中我们详细地介绍了虚拟主机的概念与三种实现方式。

⭐ 基于域名的虚拟主机的实现需要依赖于客户端提供标识，服务端读取这个标识来决定使用哪一个虚拟主机为客户端提供服务。Host 字段一般就是用来提供这个标识的。