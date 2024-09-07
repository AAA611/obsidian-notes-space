## 1XX

请求未完成，还需要进行后续的操作

## 2XX

成功

- 200 OK
- 201 Created

## 3XX

资源位置变动

- 301 永久重定向
- 302 临时重定向
- 304 资源未改变

## 4XX

客户端错误

- 400 Bad Request 错误的请求，一般指客户端请求的问题（ 如参数类型、格式错误等 ）
- 401 Unauthorized 未授权，用于表示此请求没有身份认证信息或认证信息已过期
- 403 Forbidden 请求被禁止，用于表示此请求没有权限访问此资源
- 404 Not Found 未找到，用于表示访问的资源不存在
- 405 Method Not Allowed，请求的方法不允许，用于告诉客户端使用的 HTTP 请求方式不对（ 如使用 GET 请求了一个 POST 接口 ）
- 408 Request Timeout 请求超时
- 429 Too Many Request 太多的请求，用于服务端告诉客户端一定时间内的请求数量太多，让客户端稍后请求。常用于服务端的节流，缓解服务器压力
## 5XX

服务端错误

- 500 Internat Server Error 服务端错误，常指服务端服务错误、代码错误
- 501 Not Implemented 未实现
- 502 Bad Gateway 服务网关错误
- 503 Service Unavailable 服务不可用
- 504 Gateway Timeout 网关超时

