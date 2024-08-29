## typescript 依赖及相关库

在项目中使用 TS 的时候，你可能对如何编译 TS 文件有一些疑问，下面是一些你经常看到的关于 TS 的一些包或工具：

- typescript 依赖
- tslib 依赖
- ts-loader

下面分别介绍它们

### typescript 依赖

`typescript` 依赖包括编译器本身及其他与 TS 相关的工具和库。这些依赖项帮助你编译 TS 代码、执行类型检查、生成声明文件、与其他工具（ 如 Babel、Webpack ）集成等。

`typescript` 是 TS 项目的核心依赖项，包含 TS 编译器。它用于将 `.ts` 和 `.tsx` 文件编译成 JS。

安装方式通常是：

```bash
pnpm install -D typescript
```

> typescript 安装后也包含了命令行工具 tsc

### tslib 依赖

`tslib` 是一个 TS 辅助库，用于包含便于 TS 代码是常用的一些辅助函数。它通过减少代码重复和优化编译后的代码体积来提高 TS 项目的运行效率。

#### 为什么要 tslib？

当 TS 编译器将 TS 代码编译成 JS 时，为了实现某些高级特性（ 如类的集成、装饰器、异步函数等 ），编译器会生成一些辅助函数。这些辅助函数原本会在每个使用到这些特性的文件中重复出现，导致编译后的代码体积增大。

`tslib` 提供了一组通用的函数，这些函数通过集中在一个单独的模块中被引入，避免了在每个编译后的文件中重复生成相同的代码。这样可以有效减少打包后的文件体积，并提升应用运行效率。

#### tslib 中主要辅助函数

`tslib` 中包含以下常见的 TS 编译时使用的辅助函数：

1、`_extends` 用于实现类的集成

```js
function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
```

2、`_assign` 用于实现对象的浅拷贝，类似于 `Object.assign`

```js
var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};
```

3、`_decorate` 用于实现装饰器模式

```js
function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
```

4、`_awaiter` 用于处理异步函数

```js
function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}
```

#### 如何在项目中使用 tslib？

安装：

```bash
pnpm install tslib
```

配置 `tsconfig.json`

```json
{
  "compilerOptions": {
    "importHelpers": true,
    "module": "commonjs",
    "target": "es5"
  }
}
```

`importHelpers`：启用该选项之后，TS 编译器会自动从 `tslib` 导入辅助函数，而不是在每个文件中重复生成。

#### 编译结果

假设有一个简单的 TS 继承：

```ts
class Parent {}
class Child extends Parent {}
```

启用 `importHelpers` 选项之后，编译出的代码类似于：

```js
import { __extends } from "tslib";
var Parent = /** @class */ (function () {
    function Parent() {}
    return Parent;
}());
var Child = /** @class */ (function (_super) {
    __extends(Child, _super);
    function Child() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Child;
}(Parent));
```

注意上面的 `__extends` 是从 `tslib` 中导入的。、

#### 小结

`tslib` 是一个重要的工具，用于优化 TypeScript 项目的编译过程。通过集中管理和导入辅助函数，它可以减少编译后 JavaScript 文件的大小，提升应用的运行效率。启用 `importHelpers` 选项并使用 `tslib`，是 TypeScript 项目中一个常见的最佳实践。
### ts-loader

`ts-loader` 是一个 webpack loader，用于将 TS 代码编译成 JS。它的原理是利用 `typescript 依赖` 提供的 API 来对 TS 文件进行编译。

如果在 webpack 项目中使用 `ts-loader`，需要像下面这样安装它 ：

```bash
pnpm install -D ts-loader typescript
```

然后，在 `webpack.config.js` 中配置 `ts-loader`：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,            // 匹配 .ts 和 .tsx 文件
        use: 'ts-loader',           // 使用 ts-loader 处理这些文件
        exclude: /node_modules/,    // 排除 node_modules 目录
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // 自动解析这些扩展名的文件
  },
  // ...
};

```

#### 使用场景

- **React 项目**：你可以使用 `ts-loader` 处理带有 JSX 语法的 `.tsx` 文件，并结合 Babel、Webpack 等工具，搭建现代化的 React 项目。
- **Node.js 项目**：在使用 TypeScript 构建 Node.js 应用时，`ts-loader` 允许你通过 Webpack 打包整个应用并运行在 Node.js 环境中。
- **性能优化**：在大型项目中，通过启用 `transpileOnly` 和结合 `fork-ts-checker-webpack-plugin`，可以大幅提升构建性能，减少开发过程中的编译时间。


## 使用 babel 编译 TS

除了 `typescript（ tsc ）` 之外，Babel 也可以对 TS 代码进行编译，不过 Babel 主要负责语法转义（ 即 TS 代码转为 JS 代码 ），而不是类型检查，因此使用 Babel 编译 TS 时仍需要结合 `typescript` 编译器来进行类型检查。

### 如何使用 Babel 编译 TS

1、安装必要的包：

```bash
pnpm install -D @babel/core @babel/preset-env @babel/preset-typescript
```

2、配置 Babel，创建一个 `.babelrc` 文件，用于配置 Babel：

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript"
  ]
}
```

上面代码中：

- **`@babel/preset-env`**：用于将现代 JavaScript 代码转译为目标环境支持的旧版 JavaScript 代码。
- **`@babel/preset-typescript`**：用于处理 TypeScript 代码，将 `.ts` 和 `.tsx` 文件编译为 JavaScript。

3、编译代码，可以使用 Babel CLI 来编译 TS 代码：

```bash
npx babel src --out-dir dist --extensions ".ts,.tsx"
```

### Babel 和 typescript 编译器比较

在实际项目中，你可以结合使用 Babel 和 TypeScript 编译器。典型的工作流程可能如下：

1. **TypeScript 类型检查**：使用 `tsc --noEmit` 进行类型检查，确保代码中没有类型错误。
2. **Babel 编译**：使用 Babel 来编译 TypeScript 代码，生成兼容性更好的 JavaScript 代码。

Babel 可以编译 TypeScript，但它不进行类型检查，因此最好结合 TypeScript 编译器来使用。通过合理配置 Babel 和 TypeScript 编译器，你可以在保留类型检查的同时，利用 Babel 的快速编译和现代语法转译能力来构建应用。


## 问题 TODO？

1、typescript 编译器可以语法降级吗？怎么做？
2、可以不使用 tslib 吗？手动实践
3、关于 tsconfig. json 的常见配置学习

