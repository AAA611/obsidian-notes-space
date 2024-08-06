## 是什么

`externals` 配置可以从打包输出中排除某个依赖项，即排除的依赖项时依赖于外部，需要从外部进行加载获取。

## 使用

**index. html**

```html
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"
></script>
```

**webpack. config. js**

```javascript
module.exports = {
  //...
  externals: {
    jquery: 'jQuery',
  },
};
```

配置了之后，jQuery 依赖就可以 "外部化"，本项目中不需要安装 jquery 依赖，jquery 的代码也不会出现在最终的 bundle 产物中。

这样就剥离了那些不需要改动的依赖模块,换句话，下面展示的代码还可以正常运行：

```javascript
import $ from 'jquery'; // jquery 需要依赖于外部环境中的 jquery，如果外部环境中不存在 jquery 则会报错。

$('.my-element').animate(/* ... */);
```

## 实现原理

### 通过打包产物来看 externals 实现的简单原理

**webpack. config. js**

```js
externals: {
  jquery: 'jQuery',
},
```

**打包入口 index. js**

```js
import $ from 'jquery'
console.log('[ $ ] >', $)
```

查看构建后的结果如下（经过精简）：

```js
__webpack_modules__= ({
	"jquery":(module)=>module.exports = jQuery; ⭐ 这里直接取的时当前环境中的变量 Jquery，所以项目的运行需要依赖于当前环境中的 Jquery 变量。
})
```

`__webpack_modules__` 中保存的时模块引入的映射，上面内容表示在从 jquery 中导入内容时，jquery 取的是当前环境中的 JQuery 变量。

### externalsType

在上面对打包产物分析中，我们发现 webpack 是从当前环境中取变量的形式来获取外部依赖模块，这其实是因为 externalsType 默认为 var 的原因。

externalsType 还有很多其他的取值，这可以影响到 webpack 是一何种方式使用外部依赖模块的。关于 externalsType 的更多内容可以查看 [外部扩展(Externals) | webpack 中文文档](https://webpack.docschina.org/configuration/externals/#externalstype)。

