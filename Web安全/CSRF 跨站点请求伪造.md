## 简介

CSRF 跨站请求伪造，英文全称 Cross Site Request Forgery。是一种跨站的攻击方式。

CSRF 主要表现形式为：假设有一个用户网站 user. com 和一个恶意网站 a.com。攻击者诱导用户访问 a.com, a.com 中存在恶意脚本，脚本中访问了 user. com 的某些接口，那么请求时便会带上 Cookie，从而使恶意网站能够进行对 user. com 的正常访问。攻击者可以在恶意脚本中做一些事情比如删除用户在 user. com 上面的重要信息等。

## 浏览器的 Cookie 策略


## CSRF 常见攻击

### 利用 Cookie 进行跨站请求

恶意网站在脚本中发起对用户网站 user. com 的请求时，浏览器可能会带上用户在 user. com 下的 Cookie 信息，从而使恶意网站的请求成功。

## CSRF 防御

### 源检查

由于 CSRF 攻击通常是攻击者在不同于用户网站的恶意网站上发起的，所以服务端可以检查请求中的的头部信息如 Referer、Origin 来确定请求是否来自于允许的源。

### CSRF Token

我们回想一下 CSRF 攻击的方式，攻击者我通过在恶意网站模拟用户进行请求用户网站，那么首先攻击者需要知道要攻击的接口地址，假如攻击者无法构造出正确的请求地址，那么 CSRF 攻击则不会成功。

一个好的方案是在请求时在 url 上添加一个额外的 Token，这个 Token 是足够随机并且应该作为一个 "秘密" 由客户端与服务端共同持有，不能让第三方知晓。在实际应用中，Token 可以放在 Cookie 中或者用户的 Session 中。由于攻击者只是利用浏览器会带上 Cookie 而不能获取 Cookie 中的值，所以攻击者无法从 Cookie 中取出 Token 来构造出正确的 url。

服务端则需要验证请求中 Token 的合法性。

> Token 的使用一定要注意保密性。

### Cookie 的 SameSite 属性

设置了 SameSite 属性的 Cookie 将不会在第三方网站发起请求的时候被带上。可以有效缓解 CSRF 攻击。