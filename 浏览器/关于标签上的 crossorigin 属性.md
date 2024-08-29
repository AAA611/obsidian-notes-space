## 介绍

`crossorigin` 属性在 [`<audio>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio)、[`<img>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img)、[`<link>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link)、[`<script>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/script) 和 [`<video>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video) 元素中有效，它们提供对 [CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS) 的支持，定义该元素如何处理跨域请求，从而实现对该元素获取数据的 CORS 请求的配置。

`crossorigin` 的可能取值有：

- `anonymos`
	- 请求使用 CORS 标头，且证书标志被设置为 `same-origin`，浏览器发起对资源的请求时会识别是否是跨域请求，如果是则带上 CORS 相关标头，服务端需要响应 `Access-Control-Allow-Origin` 来控制是否允许跨域。
- `with-credentials`
	- 请求时带上 CORS 标头且会带上用户凭据 Cookie，服务端需要响应 `Access-Control-Allow-Credentials:true` ，否则跨域请求失败
- `""`
	- 设置空值后行为与设置 `anonymos` 的行为相同

> 除了上面的值之外，设置其他为无效值时默认视为 `anonymos`


## 不设置 crossorigin 属性

还有一个很重要的点是 `<script>、<img>` 这些比较历史悠久的标签，本来在设计之初就是没有同源限制的。所以它们本来就是可以跨域请求资源的。

⭐在这些标签不设置 `crossorigin` 属性的时候，浏览器不会发起跨域请求，不带 CORS 标头，也不会受同源策略的限制。

