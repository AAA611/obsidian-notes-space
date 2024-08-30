
`target` 指定编译出来的 JS 代码的 ECMAScript 版本，比如 `es2021` ，默认是 `es3`。

它可以取以下值：

- es3
- es5
- es6/es 2015
- es2016
- es2017
- es2018
- es1019
- es2020
- es2021
- es2022
- esnext

注意，如果编译的目标版本过老，比如：`target:es3`，有些语法可能无法编译，`tsc` 命令会报错。

> 注意：tsc 编译并没有采用 Bable 来做的

参考：[tsconfig.json - TypeScript 教程 - 网道](https://wangdoc.com/typescript/tsconfig.json#target)