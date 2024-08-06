创建 `import` 或 `require` 的别名，来确保模块引入变得更简单。例如，一些位于 `src/` 文件夹下的常用模块：

**webpack. config. js**

```js
const path = require('path');

module.exports = {
  //...
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/'),
    },
  },
};
```

现在，替换“在导入时使用相对路径”这种方式，就像这样：

```js
import Utility from '../../utilities/utility';
```

你可以这样使用别名：

```js
import Utility from 'Utilities/utility';
```

