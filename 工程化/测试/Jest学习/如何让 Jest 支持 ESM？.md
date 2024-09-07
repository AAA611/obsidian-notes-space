
## 背景

Jest 运行在 Node 环境，模块化方案是 CJS，正常情况下不支持 ESM。如果你的项目中使用 ESM 来编写测试用例的话，你需要做一些额外的事情来让 Jest 正常运行！

## 怎么做？

我们知道 Jest 不支持 ESM 的原因是 Jest 是基于 CJS 的并且运行在 Node 环境的，一个可以让 Jest 正常运行的方式是将 ESM 的测试用例文件转换为（ 编译为 ）CJS 格式的文件。

提到编译我们可能会想到：

- Babel：一个 JavaScript 编译器
- tsc：也是一个编译器，TS 官方出的主要用于支持 `.ts` 文件编译的一个工具（ 依赖 ）。

### 使用 Babel

Babel 作为一个 JavaScript 编译器，支持将 ESM 的文件编译成 CJS。

具体使用步骤：

1、安装 jest

```bash
pnpm install -D jest
```

安装 `jest` 之后，jest 会自动安装 `babel-jest`。

> `babel-jest` 是 Babel 与 Jest 的一个粘合工具，它主要的作用就是检测当前项目中是否有 Babel 的配置文件，如果有，就会自动使用 Bable 来对测试用例代码进行编译。

1、安装 Babel 相关依赖

```bash
pnpm install -D @babel/core @babel/preset-env
```

2、新建 `.babelrc` 文件，如果项目中存在 Babel 的配置文件，jest 会自动使用 abel 进行代码转换。

```js
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "node": "current"
                }
            }
        ]
    ]
}
```

如果不想 jest 自动根据 Babel 的配置文件转换代码，可以配置 `jest.config.js` 如下：

```js
export default{
	transform:{}
}
```
### 使用 tsc

如果你的项目是 TS 的，那么你的测试用例大概率也会使用 TS 来进行编写。那么你可以使用 `ts-jest` 这个库来让 Jest 正常运行。

`ts-jest` 是什么？

`ts-jest` 是一个 npm 包，可以把它看成是 `typescript ( tsc )` 与 `jest` 之间的一层粘合剂，它底层还是基于 `typescript` 这个库来进行代码的编译转换的。

具体使用步骤：

1、安装 `ts-jest`

```bash
pnpm install -D ts-jest
```

2、按需求配置 `tsconfig.json`

### 使用 node 对 ESM 的实验性支持

使用 `--experimental-vm-modules` 标志来运行 jest 脚本。

>更多关于 ` --experimental-vm-modules` 查看： [[Node 中的 --experimental-vm-modules]]


## 参考

[Jest中文文档 | Jest中文网](https://www.jestjs.cn/docs/ecmascript-modules)

