## babel 是什么？

babel 是一个现代 JavaScript 语言编译器。
## babel 家族核心成员介绍

### @babel/core

@babel/core 是 Babel 实现转换的核心，它可以根据配置进行源码的编译转换，示例如下：

```js
babel.transform(code, options, function(err, result)=>{
	result // { code, map, ast }
})
```

### @babel/cli

@babel/cli 是 Babel 提供的命令行，可以使用命令行来调用 Babel 的功能。可以实现在命令行中使用命令对文件或者目录进行编译。

其底层依然是调用 @babel/core 的能力。

### @babel/standalone

@babel/standalone 可以在浏览器中直接执行，可以实现在线的自动解析编译。

### @babel/parser

@babel/parser 提供了对 JavaScript 语言进行解析的能力。是 JavaScript 语言解析器, 可以将源代码解析为 AST。

示例如下：

```js
require("@babel/parser").parser(code, {
	sourceType:'module',

	plugins:[...]
})
```

@babel/parser 配合 @babel/traverse 、@babel/types、 @babel/generator 等包提供了基础的 AST 处理能力。

