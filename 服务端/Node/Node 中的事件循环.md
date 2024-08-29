## 介绍

![[image-20240729104047263.png]]

timers ：执行 setTimeout、setInterval 回调
pending callbacks：执行系统 I/O 回调
idle，prepare：仅在内部使用
poll：检查新的 I/O 事件，执行已就绪的 I/O 回调
check：执行 setImmediate 回调
close callbacks：如果套接字或句柄突然关闭（例如 `socket.destroy()`）， `'close'` 则将在此阶段发出事件。

### 轮询

轮询**阶段**有两个主要功能：

1. 计算它应该阻塞和轮询 I/O 多长时间，然后
2. **处理轮询**队列中的事件。

如何计算应该阻塞和轮询 I/O 多长时间呢？下面是 libuv 的描述，可以作为重要参考：

- If the loop was run with the `UV_RUN_NOWAIT` flag, the timeout is 0.
    
- If the loop is going to be stopped ([`uv_stop()`](https://docs.libuv.org/en/v1.x/loop.html#c.uv_stop "uv_stop") was called), the timeout is 0.
    
- If there are no active handles or requests, the timeout is 0.
    
- If there are any idle handles active, the timeout is 0.
    
- If there are any handles pending to be closed, the timeout is 0.
    
- If none of the above cases matches, the timeout of the closest timer is taken, or if there are no active timers, infinity.



## test

```js
script start
async1 start
async2
promise1
promise2
script end
nextTick1
nextTick2
setTimeout0
setImmediate
setTimeout1
```