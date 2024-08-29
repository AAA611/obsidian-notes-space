
## 介绍

JSON Web Token 简称 JWT

## JWT 组成

JWT 由三个部分组成，分别是：

- Header 头部
- Payload 负载
- Signature 签名

### Header

Header 部分是一个 JSON 对象，描述 JWT 的元数据，通常是下面的样子：

```json
{
	"alg":"HS256", // alg 表示签名的算法
 	"typ":"JWT" // typ 属性表示这个令牌的类型，JWT 令牌统一写为 JWT
}
```

### Payload

Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据。JWT 规定了 7 个官方字段，供选用：

- iss （issuser）：签发人
- exp（expiration time）：过期时间
- sub（subject）：主题
- aud（audience）：受众
- nbf（Not Before）：生效时间
- iat（Issued At）：签发时间
- jti（JWT ID）：编号

除了使用这些官方字段，还可以自己定义私有字段，例如下面：

```json
{
	"sub":"121",
	"name":"James",
	"admin":true
}
```

注意 JWT 默认是不加密的，所以 JWT 主最好不要包含一些敏感信息。

### Signature

Signature 部分是对前两部分的签名，方式数据被篡改。

首先要指定一个密钥 secret。这个密钥只有服务器才知道，不能泄漏给用户。然后，使用 Header 里面指定的签名算法，按照下面公式产生签名。

```js
HMACSHA256(
	base64UrlEncode(header) + "." +
	base64UrlEncode(payload),
	secret
)
```

算出签名后，把 Header、Payload、Signature 三部分拼成一个字符串，每个部分之间使用 "." 进行分隔，就组成了最终的 JWT。

## JWT 的优缺点

### 优点

- **无状态**
	- JWT 自包含了身份验证的所有信息，是的服务器不需要存储 Session 信息，这显然增加了系统的可用性和伸缩性，减轻了服务器压力。适合分布式场景。
- **不依赖于 Cookie**
	- 在不支持 Cookie 的客户端中可以很好地使用
- **单点登录友好**

### 缺点

- **JWT 失效问题**
	- 由于 JWT 包含了所有的认证信息，所以如果服务端没法直接失效一个 token，只能等待 Token 过期。但这个问题是有解决方案的，把用的的 token 存放在一个 redis 缓存中，失效一个 token 就是把他从这个缓存中移除
- **体积**
	- JWT 可能体积较大