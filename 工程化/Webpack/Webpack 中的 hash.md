## 为什么需要 hash

在 webpack 中，`hash` 值通常作为打包产物名称的一部分，**这样做是为了利用浏览器的缓存机制**。

如果文件名中的 `hash` 值未改变，浏览器可以使用文件的缓存。

如果应用有更新，那么更新部分对应的打包产物名称的 `hash` 也会随之改变。这样浏览器无法使用缓存，也可以请求到最新的资源。

**总之，hash 是为了更好地利用浏览器的缓存机制，以此来提升应用的性能。**

## Webpack 中的 hash

webpack 中的 hash 分为三类，分别是 `fullhash`、`chunkhash`、`contenthash`。

- **fullhash**：整个项目公用的 hash，任何一个文件改变，`fullhash` 就会改变。
- **chunkhash**：每个 chunk 的 hash，chunk 中任何一个模块改变，`chunkhash` 就会改变。
- **contenthash**: 每个产物文件的 hash，文件内容改变，`contentHash` 就会改变。

## 参考

1、[# webpack 中的 hash 与优化](https://juejin.cn/post/7146489193491857421)