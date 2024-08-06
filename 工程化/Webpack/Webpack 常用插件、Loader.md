## 常用插件

| 名称                                                                                                | 描述                                                                                                 | 相关链接                          |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------- |
| [`CommonsChunkPlugin/SplitChunks`](https://v4.webpack.docschina.org/plugins/commons-chunk-plugin) | 在 Webpack V5 中是一个内置插件                                                                              | [[Webpack 常用插件之 SplitChunks]] |
| [`HtmlWebpackPlugin`](https://v4.webpack.docschina.org/plugins/html-webpack-plugin)               | 简化 HTML 文件的创建，用于服务器访问                                                                              |                               |
| VueLoaderPlugin                                                                                   | 它的职责是将你定义过的其它规则复制并应用到 `.vue` 文件里相应语言的块。例如，如果你有一条匹配 `/\.js$/` 的规则，那么它会应用到 `.vue` 文件里的 `<script>` 块。 |                               |
| [`DllPlugin`](https://v4.webpack.docschina.org/plugins/dll-plugin)                                | 用与打包出动态链接库文件                                                                                       | [[Webpack 优化之 Dll]]           |
| [`MiniCssExtractPlugin`](https://v4.webpack.docschina.org/plugins/mini-css-extract-plugin)        |                                                                                                    |                               |

## 常用 Loader


| 名称                                                                      | 描述                                                                                | 相关链接 |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---- |
| vue-loader                                                              | 识别并加载处理 .vue 文件                                                                   |      |
| [`url-loader`](https://v4.webpack.docschina.org/loaders/url-loader)     | 像 file loader 一样工作，但如果文件小于限制，可以返回 [data URL](https://tools.ietf.org/html/rfc2397) |      |
| [`babel-loader`](https://v4.webpack.docschina.org/loaders/babel-loader) | 加载 ES2015+ 代码，然后使用 [Babel](https://babel.docschina.org/) 转译为 ES5                  |      |
| [`ts-loader`](https://github.com/TypeStrong/ts-loader)                  | 像 JavaScript 一样加载 [TypeScript](https://www.typescriptlang.org/) 2.0+              |      |

### 样式

- [`style-loader`](https://v4.webpack.docschina.org/loaders/style-loader) 将模块的导出作为样式添加到 DOM 中
- [`css-loader`](https://v4.webpack.docschina.org/loaders/css-loader) 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
- [`less-loader`](https://v4.webpack.docschina.org/loaders/less-loader) 加载和转译 LESS 文件
- [`sass-loader`](https://v4.webpack.docschina.org/loaders/sass-loader) 加载和转译 SASS/SCSS 文件
- [`postcss-loader`](https://v4.webpack.docschina.org/loaders/postcss-loader) 使用 [PostCSS](http://postcss.org/) 加载和转译 CSS/SSS 文件
- [`stylus-loader`](https://github.com/shama/stylus-loader) 加载和转译 Stylus 文件

### 代码检查和测试

- [`eslint-loader`](https://github.com/webpack-contrib/eslint-loader) PreLoader，使用 [ESLint](https://eslint.org/) 清理代码

### 框架

-  [`vue-loader`](https://github.com/vuejs/vue-loader) 加载和转译 [Vue 组件](https://vuejs.org/v2/guide/components.html)