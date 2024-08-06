
## 构建速度优化

### 多个 compilation (编译时）

在进行多个 compilation 时，以下工具可以帮助到你：

- [`parallel-webpack`](https://github.com/trivago/parallel-webpack)：它允许在 worker 池中运行 compilation。
- `cache-loader`：可以在多个 compilation 之间共享缓存。

### source map
source map 相当消耗资源。你真的需要它们？

## 加载优化

### 加载优化

1、代码丑化、压缩，图片压缩。
2、代码合理分包、生产环境中按需加载。
