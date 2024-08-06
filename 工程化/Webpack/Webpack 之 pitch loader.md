
通常我们谈论的都是 Normal loader，loader 按照配置顺序从右到左依次执行。下一个 loader 可以接收到上一个 loader 处理后的结果，最终 webpack 的 compiler 拿到最后一个 loader 的处理结果。

然而，有些情况下，loader 只关心 request 后面的 **元数据(metadata)**，并且忽略前一个 loader 的结果。如何理解呢？

## loader 的执行顺序

先执行 pitch loader，然后执行 normal loader。如下图：

![[image-20240727161150387.png]]



## 为什么 loader 可以利用 Pitching 阶段？

### 共享前面的值

首先，传递给 `pitch` 方法的 `data`，在执行阶段也会暴露在 `this.data` 之下，并且可以用于在循环时，捕获并共享前面的信息。

```javascript
module.exports = function (content) {
  return someSyncOperation(content, this.data.value);
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  data.value = 42;
};
```

### 在 pitch loader 中返回内容

其次，如果某个 loader 在 `pitch` 方法中给出一个结果，那么这个过程会回过身来，并跳过剩下的 loader。

```javascript
module.exports = function (content) {
  return someSyncOperation(content);
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  if (someCondition()) {
    return (
      'module.exports = require(' +
      JSON.stringify('-!' + remainingRequest) +
      ');'
    );
  }
};
```

为什么可以跳过呢？因为返回内容代表你明确知道最后的结果，remainingRequest 表示剩下的处理，webpack 会自动递归处理这一切。