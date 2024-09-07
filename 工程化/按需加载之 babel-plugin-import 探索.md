
> 我的 github 实践案例：[GitHub - AAA611/load-on-demand2](https://github.com/AAA611/load-on-demand2)
## babel-plugin-import

`babel-plugin-import` 是一个用于按需加载模块的 Babel 插件。它主要应用于优化前端项目中的包引入，尤其是在使用像 `antd`、`lodash`、`material-ui` 等大型库时，可以显著减少打包后的文件大小，提升应用性能。

### 背景

在前端开发中，使用现代 JavaScript 库和框架时，通常会直接引入整个库或框架。这会导致所有模块或组件都被加载，无论它们是否在实际代码中被使用。这种方式不仅增加了打包文件的体积，还可能影响应用的加载和运行性能。

### 作用

`babel-plugin-import` 的主要作用就是解决上述问题。它通过重写导入路径，实现按需加载，即只引入实际使用的模块或组件，从而减少不必要的代码打包。

### 工作原理

`babel-plugin-import` 的工作原理是：在 Babel 编译过程中，自动将你的模块导入语句转换成针对单个模块的导入语句。这种转换可以避免将整个库引入，从而减少打包后的代码量。

### 示例

假设你正在使用 `antd` 这个 UI 库，通常情况下，你可能会这样引入组件：

```js
import { Button, DatePicker } from 'antd';
```

这种写法会导致 `antd` 库中的所有组件和样式都被加载，虽然你只使用了 `Button` 和 `DatePicker`。

使用 `babel-plugin-import` 后，导入语句会被自动转换为按需加载的形式：

```js
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
```

这使得只会加载 `Button` 和 `DatePicker` 相关的代码和样式，而不会加载整个库。

### 安装和使用

1、 **安装插件**： 

使用 npm 或 yarn 安装 `babel-plugin-import`：

```shell
npm install babel-plugin-import --save-dev
```
    
2、**配置 Babel**：
    
在 `.babelrc` 或 `babel.config.js` 文件中配置 `babel-plugin-import`。以 `antd` 为例：
    
```json
{
  "plugins": [
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": "css" // 自动加载样式
    }]
  ]
}
```

或者使用 JavaScript 配置：

```js
module.exports = {
  plugins: [
    ["import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: "css" // `style: true` 会加载 less 文件，`style: "css"` 会加载 css 文件
    }]
  ]
};
```
    
3、**使用组件**：

现在你可以直接导入 `antd` 的组件，而不必担心加载整个库的负担：

```js
import { Button, DatePicker } from 'antd';
```
### 常见使用场景

1. **UI 库**：对于像 `antd`、`material-ui` 这样的 UI 库，使用 `babel-plugin-import` 可以显著减少打包体积，因为这些库通常非常庞大。
2. **工具函数库**：像 `lodash` 这样的工具函数库也可以受益于按需加载，通过只引入你使用的函数来避免加载整个库。
3. **自定义库**：如果你开发了一个模块化的库，并且想让用户按需加载，也可以在用户项目中配置 `babel-plugin-import`。

### 优点

- **减少打包体积**：通过按需加载，只引入实际使用的部分，避免引入整个库，显著减少最终打包文件的体积。
- **提升加载性能**：减小了打包文件的大小，也就减少了浏览器加载和解析的时间，提高了应用的性能。
- **简化代码**：开发者不必手动指定具体的模块路径，只需按照原有的导入方式，`babel-plugin-import` 会自动处理。

### 结论

`babel-plugin-import` 是一个非常实用的 Babel 插件，特别是在使用大型第三方库时。它通过按需加载模块，减少了打包后的代码量，从而提升了应用的性能。对于现代前端开发者来说，这是一个必备的优化工具。

## 为什么编译后就可以实现按需加载？

问题：为什么编译成import Button from 'antd/lib/button'; import DatePicker from 'antd/lib/date-picker';这种形式就可以按需加载了？

### 模块的分包结构

现代的 JavaScript 库，<mark style="background: #BBFABBA6;">尤其是像 `antd` 这样的库，通常会将每个组件或功能单独放在一个文件或目录中。这样做的目的是为了支持按需加载</mark>。例如：

- `antd/lib/button` 对应的是 `Button` 组件及其相关代码。
- `antd/lib/date-picker` 对应的是 `DatePicker` 组件及其相关代码。