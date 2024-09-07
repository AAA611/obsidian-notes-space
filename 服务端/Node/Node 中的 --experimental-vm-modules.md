
## 介绍

`--experimental-vm-modules` 是 Node 中的一个是线性功能，用于开启一个新的 V8 虚拟环境中执行 ESM 的脚本。

## 与 type : module 有什么区别？

`type:module` 是切换整个项目的模块化方案，默认是 `commonjs`

由于 Node 最开始只支持 `CJS`，后面 Node 也开始支持 `ESM`。`type:module` 提供了一种配置共开发者选择：

```json
// package.json
{
	...
	"type":"module" // 开启 ESM 模块化方案
	...
}
```

```json
// package.json
{
	...
	"type":"commonjs" // 开启 CJS 模块化方案
	...
}
```

### 小结⭐

使用 `type:module` 标识项目中要使用 `ESM` 模块化方案。

使用 `--experimental-vm-modules` 标识运行脚本则标识开启一个新的上下文运行 ESM 脚本，至于你的项目使用的是什么模块化方案则不会影响，同样也不会被影响。


## 参考

[VM (executing JavaScript) | Node.js v22.7.0 Documentation](https://nodejs.org/api/vm.html#vm-executing-javascript)