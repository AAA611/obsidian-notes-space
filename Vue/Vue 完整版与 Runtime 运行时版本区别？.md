
## 术语介绍

- **完整版**：同时包含编译器和运行时的版本。
    
- **编译器**：用来将模板字符串编译成为 JavaScript 渲染函数的代码。
    
- **运行时**：用来创建 Vue 实例、渲染并处理虚拟 DOM 等的代码。基本上就是除去编译器的其它一切。

## 使用：完整版 VS 运行时版本

### 使用完整版本

如果你需要在客户端编译模板 (比如传入一个字符串给 `template` 选项，或挂载到一个元素上并以其 DOM 内部的 HTML 作为模板)，就将需要加上编译器，即完整版：

```js
// 需要编译器
new Vue({
  template: '<div>{{ hi }}</div>'
})

// 不需要编译器
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```

### 使用运行时版本

当使用 `vue-loader` 或 `vueify` 的时候，`*.vue` 文件内部的模板会在构建时预编译成 JavaScript。你在最终打好的包里实际上是不需要编译器的，所以只用运行时版本即可。

**因为运行时版本相比完整版体积要小大约 30%**，所以应该尽可能使用这个版本。

⭐注意：如果你仍然希望使用完整版，则需要在打包工具里配置一个别名：
#### webpack

> 关于 webpack 中 resolve. alias 请参考：[[resolve.alias]]

```js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'
    }
  }
}
```

#### Rollup

```js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': require.resolve('vue/dist/vue.esm.js')
    })
  ]
})
```

#### 小结⭐

在客户端没有在运行时编译字符串模板需求的情况下，应该尽量使用运行时版本，因为运行时版本有更小的体积。

使用 `webpack、rollup` 等构建工具时，默认使用的时运行时版本

如果使用构建工具时还要使用完整本，则需要通过设置别名来让构建工具在构建时引入 Vue 的完整版本
## 参考

[Vuejs-运行时-编译器-vs-只包含运行时](https://v2.cn.vuejs.org/v2/guide/installation.html#%E8%BF%90%E8%A1%8C%E6%97%B6-%E7%BC%96%E8%AF%91%E5%99%A8-vs-%E5%8F%AA%E5%8C%85%E5%90%AB%E8%BF%90%E8%A1%8C%E6%97%B6)