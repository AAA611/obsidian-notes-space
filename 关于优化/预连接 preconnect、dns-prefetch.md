
## 原理

现代浏览器会[尽量预测](https://www.igvita.com/posa/high-performance-networking-in-google-chrome/#tcp-pre-connect)网页需要哪些连接，但无法可靠地预测所有连接。好消息是你可以给他们一个（资源 😂?）提示。

![[image-20240726173717635.png]]

[浏览器支持 `dns-prefetch`](https://caniuse.com/#search=dns-prefetch) 与 [`preconnect`](https://caniuse.com/#search=preconnect) [支持](https://caniuse.com/#search=preconnect)略有不同，因此 `dns-prefetch` 可作为不支持 `preconnect` 的浏览器后备。
## 参考

[尽早建立网络连接，以提升系统感知的网页速度  |  Articles  |  web.dev](https://web.dev/articles/preconnect-and-dns-prefetch?hl=zh-cn)