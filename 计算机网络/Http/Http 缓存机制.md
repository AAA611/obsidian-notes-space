## 为什么需要缓存

缓存作为一种常见的优化手段也广泛应用于 Http 的客户端与服务端之间的通信。使用缓存有如下优点：

- **缓存减少了冗余数据的传输**
- **缓存缓解了网络瓶颈的问题**。不需要更多的带宽就能够更快地加载页面
- **缓存降低了对原始服务器的要求**。缓存在一定程度上可以<mark style="background: #BBFABBA6;">缓解服务器压力，避免服务器过载</mark>。
- .....

## 缓存结构

缓存可以是单个用户专用的，也可以是数千名用户共享的。

专用缓存称为 "**私有缓存**"。私有缓存是个人缓存，包含了单个用户 1 最常用的页面等资源。

共享的缓存称为 "**公有缓存**"。公有缓存中包含了某个用户团体常用的页面等资源。

### 私有缓存

![[image-20240726145202291.png]]

私有缓存通常不需要很复杂的功能与很大的存储空间，因为它服务于单个用户。

web 浏览器中有内建的私有缓存——大多数浏览器会将常用的文档缓存在你个人电脑的磁盘或者内存中。

### 公有缓存

![[image-20240726145629645.png]]

公有缓存是特殊的共享代理服务器，被称为 "**缓存代理服务器**"。缓存服务器会从本地缓存为客户端提供文档，或者代表用户与服务器进行联系。公有缓存会接受来自多个用户的访问，所以通过缓存服务器可以很好地减少源站服务器的压力。而且通常使用缓存可以更快速地响应客户端。

<mark style="background: #BBFABBA6;">代理缓存可以根据需求划分多层次结构，这种层次化的缓存结构可以增加缓存的命中率</mark>。通常，客户端的请求先到达一级缓存，一级缓存未命中则继续请求下一个节点。

## 缓存的处理步骤

Web 缓存对一个 HTTP GET 请求的基本缓存处理过程如下：

- 接收，缓存服务接受请求报文。
- 解析，缓存服务解析保温，得到本次请求的基本信息如 URL、请求头部信息等。
- 查询，查询本地是否有缓存可用，如果没有，就从远程服务器获取保存在本地缓存。
- 新鲜度检测，查看缓存是否足够新鲜。
- 创建响应，缓存会用新的首部和已缓存的主题来构建一条响应报文。
- 发送，将响应发送给客户端。

## Http 缓存控制

Http 协议中有一些头部可以进行缓存控制。

### Cache-Control 首部

`Cache-Control` （<mark style="background: #BBFABBA6;">推荐</mark>）响应头信息可以进行缓存控制，有以下有效值：

- **no-store**: 表示不使用缓存
- **no-cache**: 使用缓存，但是每次使用之前都需要向服务器进行缓存新鲜度检测
- **max-age**: 设置一个缓存过期时间，**单位是秒**

### Expires 首部

`Expires` （<mark style="background: #FF5582A6;">不推荐</mark>）通过设置一个绝对的过期日期来表示缓存的过期时间。但由于设备之间的时钟同步问题，这种方式已经**不推荐使用**。

## 缓存新鲜度检测

缓存新鲜度检测指的是在使用缓存之前需要向远端服务器确认缓存的新鲜度。**缓存服务通过发起条件请求来实现新鲜度的检测**。

下面以浏览器的视角来讲解如何进行缓存的新鲜度检测。

假如浏览器需要对本地的某个缓存进行新鲜度检测，浏览器发起一个 "**条件 GET**"，请求的服务器只有在文档对象改变时才会发送新的对象主体给浏览器。否则则不会有对象主体返回（服务端可以返回 304 响应来告诉客户端缓存依然可用）。

通过在请求的头部加上 `If-Modified-Since:<date> 或者 If-None-Match:<tags>` 就可以发起**条件 GET**。

- `If-Modified-Since:<date>` 值是原始响应时的 Last-Modified 字段，服务端通过此字段判断文档内容是否有更新。
- `If-None-Match:<tags>` （<mark style="background: #BBFABBA6;">推荐</mark>）值是原始响应时的 ETag，ETag 是文档的指纹，它可以更加精准地表示一个文档的内容是否有改变。
## 强缓存与协商缓存

### 强缓存

强缓存指的是在缓存未过期之前，都可以直接使用缓存内容。

### 协商缓存

协商缓存指的是在使用缓存之前需要向远端服务器确认缓存的新鲜度，如果服务端返回 304，则表示可以继续使用本地的缓存内容。

## 总结

本文主要讲了：
- 缓存的好处
- 缓存的类型、结构
- 缓存的处理流程
- Http 缓存控制
- 强缓存与协商缓存