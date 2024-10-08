## 问题

### TCP 层面的队头阻塞

HTTP/2 的所有流都共享一个 TCP 连接，如果在传输过程中发生了丢包或者延迟，TCP 连接会触发一些机制来进行丢包重传，这也就意味着这会阻塞公用这个 TCP 连接的所有流。

即使 HTTP/2 允许多个流在同一个 TCP 连接上并行传输，但 TCP 层的丢包或者延迟仍然会等导致整个 TCP 阻塞，没有做到多个传输流的独立。
