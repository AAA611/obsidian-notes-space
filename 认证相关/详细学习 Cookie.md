
## 介绍

Cookie 是一段存储在客户端的一段文本，大小限制约为 4KB，Cookie 的作用是为了解决 HTTP 协议无状态的问题。

通常 Cookie 中存储着标识一个用户的信息，在发送请求时带上 Cookie，服务端通过 Cookie 信息来识别用户。

## 设置 Cookie（ Set-Cookie ）

```txt
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;
```

## Cookie 的属性

### 定义 Cookie 发送的位置（ 作用域 ）

`Domain` 和 `Path` 标识定义了 Cookie 的作用域：即允许 Cookie 应该发送给哪些 URL。

#### Domain 属性

`Domain` 属性制定了哪些主机可以接收 Cookie。如果不指定，该属性默认为同一 host 设置 cookie，不包含子域名。如果指定了 `Domain` ，则一般包含子域名。因此，**指定 `Domain` 比生活略它的限制要少**。但是，当子域需要共享有关用户的信息时，这可能会有所帮助。

例如，如果设置 `Domain=mozilla.org`, 则 Cookie 也包含在子域名中（ 如 `developer.mozilla.org` ）。

#### Path 属性

`Path` 属性指定了一个 URL 路径，该 URL 路径必须存在于请求的 URL 中，以便发送 Cookie 标头。以字符 `%x2F` ( "/" ) 作为路径分割符，并且子路径也会被匹配。

例如，设置 `Path=/docs`，则一下地址都会匹配：

- `/docs`
- `/docs/`
- `/docs/web`
- `/docs/web/http`

但是这些请求路径不会匹配以下地址：

- `/`
- `/docssets`
- `/fr/docs`

### Cookie 的安全

#### SameSite 属性

`SameSite` 属性允许服务器指定是否/何时通过挂站点请求发送。这提供了一些针对跨站点请求伪造攻击（[[CSRF 跨站点请求伪造]]）的保护。它采用了三个可能的值：`Strict`、`Lax`、`None`。

- **Strict**
	- Cookie 仅发送到他来源的站点
- **Lax**
	- Lax 与 Strict 类似，只是在用户导航到 Cookie 的源站点时发送
	- 例如，A.com 有一个 cookie，用户此时在 B.com 的页面中，B.com 中有一个导航到 A.com 的链接，用户点击链接后进入 A.com, 此时在 A.com 的请求就会带上 Cookie
- **None**
	- 指定浏览器在跨站请求、同站请求都会发送 Cookie
	- 注意，在设置了 None 之后必须设置 Secure 属性


#### HttpOnly

阻止 JS 通过 `Document.cookie` 属性访问 cookie。注意，设置了 `HttpOnly` 的 cookie 仍然会通过 JavaScript 发起的请求发送。

#### Secure

表示仅当请求通过 `https:` 协议（ localhost 不受此限制 ）发送时才会将该 cookie 发送到服务器，因此其更能够抵抗[中间人](https://developer.mozilla.org/zh-CN/docs/Glossary/MitM)攻击。

> 备注：不要假设 `Secure` 会阻止所有的对 cookie 中敏感信息（会话密钥、登录信息，等等）的访问。携带这一属性的 cookie 在不设置 `HttpOnly` 属性的情况下仍能从客户端的硬盘或是从 JavaScript 中访问及更改。
   非安全站点（`http:`）不能在 cookie 中设置 `Secure` 属性（从 Chrome 52 和 Firefox 52 开始）。当 `Secure` 属性由 localhost 设置时，`https:` 的要求会被忽略（从 Chrome 89 和 Firefox 75 开始）。

### Cookie 的有效期

Cookie 从有效期上可以分为持久化 Cookie 与会话期 Cookie：

- 持久化 Cookie
	- 通过设置 `Expires` 或 `Max-Age` 属性
	- 示例： `Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT`
	- 过期之后 Cookie 被清除
- 会话期 Cookie
	- 不设置 `Expires` 或者 `Max-Age` 属性的将称为会话期 Cookie
	- 示例：`Set-Cookie: sessionId=38afes7a8`

#### Max-Age

#### Expires
