## 天然的沙箱隔离

qiankun 中，天然的沙箱隔离指的是在**单例模式**下（**同一时间只有一个子应用被激活**），子应用之间的样式隔离。原理是 qiankun 在单例模式下，每次只有一个由于被激活，失活的子应用的内容 DOM（包括样式标签和其他内容等）都会被销毁。**所以在单例模式下只有一个子应用的样式存在。**
**这样自然不会有子应用之间的冲突**。**但是子应用与主应用之间的样式可能会存在冲突**。

## 基于 ShadowDOM 的样式隔离

qiankun 提供了 `strictStyleIsolation` 配置来决定是否开启严格的样式隔离。内部原理基于 **ShadowDOM 的 CSS 封装特性**。

点击 [[ShadowDOM 入门]] 查看更多关于 ShadowDOM 的内容。

具体使用方式如下：

```js
import { registerMicroApp,start } form 'qiankun'

const app={...}

registerMicroApp([app])

start({
  sandbox:{  strictStyleIsolation:true } // 开启严格样式隔离
})
```

开启 `strictStyleIsolation:true` 之后，qiankun 会以 appElement 作为 shadow host 来创建 shadow root，然后将应用的内容作为 ShadowDOM 的内容。

这样加载的子应用的内容就被 ShadowDOM 包裹，而 **ShadowDOM 具有 CSS 封装特性**，所以可以实现多个子应用、主应用与子应用之间的样式隔离。

最后附上一段 qiankun 中实现 ShadowDOM 样式隔离的核心代码，如下：

```js
  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn('[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!');
    } else {
      var innerHTML = appElement.innerHTML;
      appElement.innerHTML = '';
      var shadow;
      if (appElement.attachShadow) {
	    // 创建 shadow root 节点
        shadow = appElement.attachShadow({
          mode: 'open'
        });
      } else {
	    // 已被启弃用方法，为了兼容性
        shadow = appElement.createShadowRoot();
      }
      // 将应用内容作为 shadowDOM 的内容，即使用 ShadowDOM 包裹应用
      shadow.innerHTML = innerHTML;
    }
  }
```

> 📣注意：ShadowDOM 看似完美，但依然不适用于所有场景。目前 ShadowDOM 技术并没有得到广泛应用，一些主流的框架的实现有可能没有考虑到 ShadowDOM 并做一些兼容处理。
> 例如：在 React 中使用 ShadowDOM 可能会出现 ShaowDOM 中的元素绑定的事件回调无法被执行。因为 React 的事件机制是由框架统一注册在顶层元素上面，事件回调的执行需要依赖于冒泡。而 ShadowDOM 中元素与外界是隔离的，其中的事件并不会冒泡到 ShadowDOM 外部，以至于无法捕获事件。详细请看  [问题](https://github.com/facebook/react/issues/10422)

## 实验性方案 ScopedCSS

ScopedCSS 方案类似于 Vue 中的 scoped，它通过给 css 选择器前面再加上一个属性选择器来实现 css 样式的作用域。

可以通过设置 experimentalStyleIsolation:true 开启 ScopedCSS。开启后，qiankun 会改写子应用所添加的样式为所有样式规则增加一个特殊的选择器规则来限定其影响范围，因此改写后的代码会表达类似为如下结构：

```css
// 假设应用名是 react16
.app-main {
  font-size: 14px;
}

div[data-qiankun-react16] .app-main {
  font-size: 14px;
}
```

>📣注意: @keyframes, @font-face, @import, @page 将不被支持 (i.e. 不会被改写)

qiankun 中的实现这部分的代码我们简单了解一下：
```js
if (scopedCSS) {
const attr = appElement.getAttribute(css.QiankunCSSRewriteAttr);
if (!attr) {
  appElement.setAttribute(css.QiankunCSSRewriteAttr, appInstanceId);
}

// 获取子应用所有的 style 标签
const styleNodes = appElement.querySelectorAll('style') || [];
// 循环改写里面的 css 选择器
forEach(styleNodes, (stylesheetElement: HTMLStyleElement) => {
  css.process(appElement!, stylesheetElement, appInstanceId);
});
}
```

## 问题
- [x] [qiankun 沙箱个例带来的问题，主要是全局弹窗组件样式问题](https://juejin.cn/post/7184419253087535165) @completed(2024-08-06T15:14:15+08:00)