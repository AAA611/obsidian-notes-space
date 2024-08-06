## 介绍

使用 webpack 的 watch mode(监听模式)。而不使用其他工具来 watch 文件和调用 webpack 。内置的 watch mode 会记录时间戳并将此信息传递给 compilation 以使缓存失效。

在某些配置环境中，watch mode 会回退到 poll mode(轮询模式)。监听许多文件会导致 CPU 大量负载。在这些情况下，可以使用 `watchOptions.poll` 来增加轮询的间隔。

总的来说，增量编译可以让 Webpack 只编译那些改动范围内文件，从而避免全量编译。

## 使用

通过 webpack 的 wacth 与 watchOptions 配置来实现。

配置参考链接：  [watch 和 watchOptions](https://v4.webpack.docschina.org/configuration/watch/)

### 开启 watch 监听模式

启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改。

**webpack.config.js**

```js
module.exports = {
  //...
  watch: true
};
```

> [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 和 [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) 里 Watch 模式默认开启。

### 使用 watchOptions 配置优化

watchOptions 中有一些配置选项可以用来**定制** watch 模式。

一些常用的优化选项如下：

####  `watchOptions.aggregateTimeout`

当第一个文件更改，会在重新构建前增加延迟。这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位：

```js
module.exports = {
  //...
  watchOptions: {
    aggregateTimeout: 600
  }
};
```

#### `watchOptions.ignored`

`RegExp` [`anymatch`](https://github.com/micromatch/anymatch)

对于某些系统，监听大量文件系统会导致大量的 CPU 或内存占用。这个选项可以排除一些巨大的文件夹，例如 `node_modules`：

**webpack.config.js**

```js
module.exports = {
  //...
  watchOptions: {
    ignored: /node_modules/
  }
};
```

也可以使用多种 [anymatch](https://github.com/micromatch/anymatch) 模式：

**webpack.config.js**

```js
module.exports = {
  //...
  watchOptions: {
    ignored: ['files/**/*.js', 'node_modules']
  }
};
```

> 如果你使用 `require.context`，webpack 会观察你的整个目录。你应该忽略一些文件和/或(and/or)目录，以便那些不需要监听的文件修改，不会触发重新构建。

#### `watchOptions.poll` [](https://v4.webpack.docschina.org/configuration/watch/#watchoptions-poll)

`boolean: false` `number`

通过传递 `true` 开启 [polling](https://whatis.techtarget.com/definition/polling)，或者指定毫秒为单位进行**轮询**。

**webpack.config.js**

```
module.exports = {
  //...
  watchOptions: {
    poll: 1000 // 每秒检查一次变动
  }
};
```

> 如果监听没生效，试试这个选项吧。Watch 在 NFS 和 VirtualBox 机器上不适用。