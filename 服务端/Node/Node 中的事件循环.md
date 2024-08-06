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

简单总结一下：
1. 如果没有相关的回调事件（如果注册了回调，但是还未就绪则视为有），那么会直接跳过轮询阶段，因为即使等多久也不会有新的时间回调就绪。
2. 如果有相关的回调事件，则轮询阶段的轮询时长则为最近的定时器时长，在等待最近的定时器到达阈值之前，如果有新的相关的回调事件就绪，那么则会先执行事件，然后再进入定时器阶段。
3. 假如没有注册定时器
	- 如果轮询队列不为空，事件循环将遍历其回调队列并同步执行它们，直到队列耗尽或达到系统相关的硬限制。
	- 如果轮询队列不为空，则会发生下面两件事之一：
		- 如果脚本已经被安排`setImmediate()`，事件循环将结束**轮询**阶段并继续**检查**阶段以执行那些被安排的脚本。
		- 如果脚本**尚未**被安排`setImmediate()`，事件循环将等待回调被添加到队列中，然后立即执行它们。