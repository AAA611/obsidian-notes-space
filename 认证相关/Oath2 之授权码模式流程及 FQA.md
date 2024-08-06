## 整体流程

1、用户登录第三方应用，如果没有登录，则重回定向到认证系统让用户登录。登录成功过后根据重定向地址重定向到第三方应用，并且重定向地址中会带有一个授权码 `code`
2、第三方应用在得到 `code` 之后，向后台发起登录（第三方应用的登录接口），带上 `code` 参数。
3、后台登录接口接收到 `code` 参数之后，便开始发起通过 code 获取 `access_token` 的操作
4、将 `access_token` 返回给第三方应用。

## FQA

### 授权码模式有什么优点？

授权码模式在用户登录之后不会直接把 `access_token` 放到重定向回第三方的 url 中，取而代之的是在重定向地址中加入一个 `code`。后续可以通过 `code` 来获取 `access_token`。

优点：
- `code` 会展示在浏览器的地址栏中，但由于 `code` 的有效期极短，所以降低了泄露的风险。而且通过 `code` 获取 `token` 的请求在后端完成，且需要和 `client_secret` 配合使用，所以更加安全。
- `access_token` 不会直接暴露在浏览器端。可以强制使用 `https`。

### refresh_token 有什么作用？为什么不直接把 access_token 有效期设置的更长？

`refresh_token` 用于刷新 `access_token` 的有效期

为什么不直接把 `access_token` 有期设置的很长？**防止 access_token 泄露然后被滥用**。如果 `access_token` 有效期较短，那么泄漏之后也只能使用一小段时间，有效降低了被滥用的风险。而使用 `refresh_token` 机制来刷新时，**refresh_token 必须配合 client_id 一起使用**，盗用 `access_token` 者无法获取 `client_id` ，所以盗用者很难做到刷新 `access_token`。

## 参考

[Access Token & Refresh Token 详解以及使用原则](https://juejin.cn/post/6859572307505971213)