
## 介绍

thread-loader 的作用是在单独的进程中运行 loader 来达到优化的目的。

## 快速开始

```bash
npm install --save-dev thread-loader
```

使用时，需要将此 loader 放置在其他 loader 之前。放置在此 loader 之后的 loader 会在一个独立的 woker 池值运行。

在 woker 池中运行 loader 是受到限制的，例如：

- 这些 loader 不能生成新的文件
- 这些 loader 不能使用自定义 loader API（ 也就是说，不能通过插件来自定义 ）
- 这些 loader 无法获取 webpack 的配置

每个 loader 都是一个独立的 node. js **进程**，其开销大约 600ms 左右。同时回限制跨进程数据交换。

> 请尽在耗时操作中使用此 loader！

### 示例

webpack. config. js

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          "thread-loader",
          // 耗时的 loader （例如 babel-loader）
        ],
      },
    ],
  },
};
```

with options，可以进行一些配置

```js
use: [
  {
    loader: "thread-loader",
    // 有同样配置的 loader 会共享一个 worker 池
    options: {
      // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)，或者，
      // 在 require('os').cpus() 是 undefined 时回退至 1
      workers: 2,

      // 一个 worker 进程中并行执行工作的数量
      // 默认为 20
      workerParallelJobs: 50,

      // 额外的 node.js 参数
      workerNodeArgs: ['--max-old-space-size=1024'],

      // 允许重新生成一个僵死的 work 池
      // 这个过程会降低整体编译速度
      // 并且开发环境应该设置为 false
      poolRespawn: false,

      // 闲置时定时删除 worker 进程
      // 默认为 500（ms）
      // 可以设置为无穷大，这样在监视模式(--watch)下可以保持 worker 持续存在
      poolTimeout: 2000,

      // 池分配给 worker 的工作数量
      // 默认为 200
      // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
      poolParallelJobs: 50,

      // 池的名称
      // 可以修改名称来创建其余选项都一样的池
      name: "my-pool"
    },
  },
  // 耗时的 loader（例如 babel-loader）
];
```

## 原理解析

thread-loader 是一个 pitch loader，关于 pitch loader 的特点可以查看：[[Webpack 之 pitch loader]]。

thread-loader 利用了 pitch loader 如果返回了内容就可以跳过剩下 loader 的特点，来在 thread-loader 中使用 worker 池来自行执行剩余的 loader。

**index. js**

```js
import { getPool } from './workerPools';

function pitch() {
  const options = this.getOptions();
  const workerPool = getPool(options); //⭐worker 池

  if (!workerPool.isAbleToRun()) {
    return;
  }

  const callback = this.async(); //⭐此 worker 是一个异步 worker，通过 this.async() 得到回调函数 callback


  // ⭐使用 worker 池执行剩余的 loader
  workerPool.run(
    {
      // ⭐在这里通过 api 得到配置在 thread loader 后面的 loader 列表。
      loaders: this.loaders.slice(this.loaderIndex + 1).map((l) => {
        return {
          loader: l.path,
          options: l.options,
          ident: l.ident,
        };
      }),
      _compiler: {
        fsStartTime: this._compiler.fsStartTime,
        options: { plugins: [] },
      },
      _compilation: {
        outputOptions: {
          hashSalt: this._compilation.outputOptions.hashSalt,
          hashFunction: this._compilation.outputOptions.hashFunction,
          hashDigest: this._compilation.outputOptions.hashDigest,
          hashDigestLength: this._compilation.outputOptions.hashDigestLength,
        },
        options: {
          devtool:
            this._compilation &&
            this._compilation.options &&
            this._compilation.options.devtool,
        },
      },
      resourcePath: this.resourcePath,
      resource: this.resourcePath + (this.resourceQuery || ''),
      sourceMap: this.sourceMap,
      emitError: this.emitError,
      emitWarning: this.emitWarning,
      loadModule: this.loadModule,
      resolve: this.resolve,
      getResolve: this.getResolve,
      target: this.target,
      minimize: this.minimize,
      resourceQuery: this.resourceQuery,
      optionsContext: this.rootContext || this.options.context,
      rootContext: this.rootContext,
    },
	// 这里是执行完 loader 的回调函数
    (err, r) => {
      if (r) {
        r.fileDependencies.forEach((d) => this.addDependency(d));
        r.contextDependencies.forEach((d) => this.addContextDependency(d));
        r.missingDependencies.forEach((d) => this.addMissingDependency(d));
        r.buildDependencies.forEach((d) =>
          // Compatibility with webpack v4
          this.addBuildDependency
            ? this.addBuildDependency(d)
            : this.addDependency(d)
        );
      }

      if (err) {
        callback(err);
        return;
      }

	  //⭐调用 callback，表示 thread loader 已经执行完毕，r.result 是返回的结果，由于 thread loader 是一个
	  // pitch loader，所以后面的 loader 都不会被执行了。thread loader 会帮你执行了
      callback(null, ...r.result);
    }
  );
}

function warmup(options, requires) {
  const workerPool = getPool(options);

  workerPool.warmup(requires);
}

export { pitch, warmup }; // eslint-disable-line import/prefer-default-export

```

**WorkerPool. js 部分**

```js
this.worker = childProcess.spawn(
  process.execPath,
  [].concat(sanitizedNodeArgs).concat(workerPath, options.parallelJobs),
  {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe', 'pipe', 'pipe'],
  }
);
```

从上面可以看到 thread loader 中的 worker 实际上是一个独立的 node. js **子进程**。
### thread loader 实现要点总结

- pitch loader：thread loader 是一个 pitch loader，如果 loader 有返回值就会跳过后面 loader 的执行。thread loader 利用了这一特性跳过了后续 loader 的执行，并使用 worker 池来自定义执行后面的 loader
- 异步：thread loader 是一个异步 loader，使用 `const callback = this.async()` 获取到回调，loader 执行完后调用 `callback()` 并返回结果来跳过后面 loader 的执行
- 获取后面的 loaders：通过 `this.loaders` 和 `this.loaderIndex` ,可以获取到配置在 thread loader 后面的 loader 配置。thread loader 将使用 worker 池来自定义执行剩余的 loader

