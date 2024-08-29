
## 问题背景

假如一个项目中使用了 CommonJS 模块，但是也安装了 ESM 的依赖，那么 CommonJS 可以与 ESM 混着用吗？

## 实验验证

现有项目入口文件如下：

```js
// index.js

import $ from 'jquery'
const axios = require('axios')

console.log(axios.create);
console.log('[ $1 ] >', $)
```

项目里面既使用了 CommonJS 也使用了 ESM，那么 webpack 可以正常打包吗？

运行 `npm run build` 发现 webpack 可以正常打包。

那么问题来了，webpack 是如何做到解析 ESM 的？

## webpack 源代码中找答案

webpack 中有这样一段代码，如下：

![[image-20240823104632555.png]]

从上图中可以看到 webpack 中使用一个名为 `es-module-lexer` 来解析 ESM 模块。

> `es-module-lexer` 的 github 地址：[es-module-lexer/lexer.js at main · guybedford/es-module-lexer · GitHub](https://github.com/guybedford/es-module-lexer/blob/main/lexer.js)

## 总结

使用 webpack 进行打包时，CommonJS 与 ESM 可以混用（ 但不建议 ）。
webpack 内部使用 `es-module-lexer` 来解析 ESM 依赖。