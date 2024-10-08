在发送已加密的 HTTP 报文之前，客户端和服务器要进行一次 SSL 握手，在这个握手的过程中，它们要完成以下工作：

- 交换协议版本号
- 协商并选择一个两端都了解得密码套件
- 对两端身份进行认证
- 生成临时的会话密钥，一边加密信道

### 基于 RSA 的密钥交换

- 服务端发送公钥
	- 服务器将公钥通过证书发送给客户端，证书中包含公钥
- 客户端生成会话密钥
	- 客户端生成一个随机的会话密钥（称为“预主密钥”）
- 客户端使用公钥加密会话密钥
	- 客户端使用服务器的公钥加密这个会话密钥，并将加密后的会话密钥发送给服务器
- 服务器使用私钥解密会话密钥
	- 服务器使用自己的私钥解密会话密钥，这样双方都拥有了相同的堆成加密密钥

上面客户端使用服务端的公钥加密会话密钥，服务端使用私钥解密的过程称为**非对称加密**

最后，双方基于这个共同拥有的会话密钥来加密后面的通信。这个过程是**对称加密**

### 扩展 - 基于 Diffie-Hellman 的密钥交换（包括 DHE 和 ECDHE）

现代的 HTTPS 连接通常使用 Diffie-Hellman（DH）或椭圆曲线 Diffie-Hellman（ECDH）算法来生成会话密钥。这种方式支持完美前向保密性（PFS），即使服务器的私钥泄露，也不会影响已完成的会话的安全性。

#### 过程：

1. **服务器和客户端交换参数**：
    
    - 在握手过程中，服务器和客户端交换加密算法的参数，包括椭圆曲线参数（在 ECDHE 中使用）或素数和生成元（在 DHE 中使用）。
2. **客户端生成密钥对**：
    
    - 客户端生成一个临时的私钥和对应的公钥。
3. **服务器生成密钥对**：
    
    - 服务器也生成一个临时的私钥和对应的公钥。
4. **双方交换公钥**：
    
    - 客户端和服务器互相发送自己的公钥。
5. **计算共享密钥**：
    
    - 客户端使用服务器的公钥和自己的私钥计算一个共享密钥（会话密钥）。
    - 服务器使用客户端的公钥和自己的私钥计算相同的共享密钥。

由于 Diffie-Hellman 算法的数学性质，双方最终会生成相同的会话密钥，而不需要直接传输这个密钥本身。