## 一、ShadowDOM 是什么
`ShadowDOM` 与普通 `DOM` 几位相似，最大的区别就是 `ShaowDOM` 对于页面运行的 `JS` 与 `CSS` 时隐藏的。它像是一个黑盒，外不无法影响到它，它也不会影响外部，提供了很好的封装性。
## 二、怎么使用
ShadowDOM 需要附加到常规 DOM 元素上面去，这个常规 DOM 成为 shadow host，具体内容可以参考下面说明：

_影子_ DOM 允许将隐藏的 DOM 树附加到常规 DOM 树中的元素上——这个影子 DOM 始于一个影子根，在其之下你可以用与普通 DOM 相同的方式附加任何元素。

![[Pasted image 20240709101635.png]]

有一些影子 DOM 术语需要注意：

- **影子宿主（Shadow host）**: 影子 DOM 附加到的常规 DOM 节点。
- **影子树（Shadow tree）**: 影子 DOM 内部的 DOM 树。
- **影子边界（Shadow boundary）**: 影子 DOM 终止，常规 DOM 开始的地方。
- **影子根（Shadow root）**: 影子树的根节点。

在了解了一些术语与概念之后，我们继续讨论如何使用 ShadowDOM。
下面将通过代码来展示使用方法,你这可以在[这里](https://developer.mozilla.org/zh-CN/play)尝试
```html
// HTML
<div id="host"></div>
<span>I'm not in the shadow DOM</span>

<script>
	// 1. 选择一个常规 DOM 节点作为 ShadowDOM 将要附加上的节点，这个是 shadow host
	const host = document.querySelector("#host");
	// 2. 通过在 shaow host 上面调用 attachShadow 方法创建 ShaowDOM。返回值 shadow 则是 ShadowDOM 的根，也就是 shadow root，后续操作 ShadowDOM 都要通过这个节点来进行
	const shadow = host.attachShadow({ mode: "open" });
	const span = document.createElement("span");
	span.textContent = "I'm in the shadow DOM";
	// 3. 添加元素到 ShadowDOM 中
	shadow.appendChild(span);
</script>
```
总结一下可以分为三个步骤：
- 选择一个常规 DOM 作为 ShadowDOM 附着的节点，称为 shaow host
- shadow host 调用 attachShadow 方法创建 ShadowDOM，方法的返回值称为 shaow root
- 通过 shaow root 进一步操作 ShadowDOM中内容

## 三、JS 封装
**ShadowDOM 中的元素对外部是隐藏的，在外部通过常规方法并不能获取到 ShadowDOM 中的节点。**

通过 shadow root 对象可以获取、操作 ShadowDOM 中的元素内容，这取决于 attachShadow 方法的参数 mode：
- mode 为 open ：可以通过 shadow root 对象获取、操作 ShadowDOM 中内容。
- mode 为 close ：attachShadow 方法返回的 shadow root 将会是 null

## 四、CSS 封装
**外部文档中的 CSS 不会影响到 ShadowDOM 中的元素样式，同样 ShadowDOM 也不会影响外部文档的样式。他们的 CSS 是互相隔离的**。你可以在[这里](https://developer.mozilla.org/zh-CN/play)进一步查看。

## 四、ShadowDOM 中使用样式
有两种方式在 ShadowDOM 使用样式：
- 编程式：通过构建 [`CSSStyleSheet`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleSheet)对象并附加到 shaow root 节点
- 声明式：通过在一个 [`<template>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/template) 元素的声明中添加一个 [`<style>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/style) 元素

在这两种情况下，影子 DOM 树中定义的样式局限在该树内，所以就像页面样式就像不会影响影子 DOM 中的元素一样，影子 DOM 样式也不会影响页面中其它元素的样式。

### 编程式
编程式通过一下步骤来为 ShadowDOM 应用样式：
1. 创建一个空的 [`CSSStyleSheet`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleSheet) 对象
2. 使用 [`CSSStyleSheet.replace()`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/replace "此页面目前仅提供英文版本") 或 [`CSSStyleSheet.replaceSync()`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/replaceSync "此页面目前仅提供英文版本") 设置其内容
3. 通过将其赋给 [`ShadowRoot.adoptedStyleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets "此页面目前仅提供英文版本") 来添加到影子根
代码如下：
```html
<div id="host"></div>
<span>I'm not in the shadow DOM</span>

<script>
	// 1. 构造 CSSStyleSheet 对象
	const sheet = new CSSStyleSheet();
	// 2. 添加样式
	sheet.replaceSync("span { color: red; border: 2px dotted black;}");
	
	const host = document.querySelector("#host");
	
	const shadow = host.attachShadow({ mode: "open" });
	// 3. 设置 shadowRoot 的 adoptedStyleSheets 属性以应用样式
	shadow.adoptedStyleSheets = [sheet];
	
	const span = document.createElement("span");
	span.textContent = "I'm in the shadow DOM";
	shadow.appendChild(span);
</script>
```

### 声明式
 [在 `<template>` 声明中添加 `<style>` 元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/Using_shadow_DOM#%E5%9C%A8_template_%E5%A3%B0%E6%98%8E%E4%B8%AD%E6%B7%BB%E5%8A%A0_style_%E5%85%83%E7%B4%A0)
 构建 `CSSStyleSheet` 对象的一个替代方法是将一个 [`<style>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/style) 元素包含在用于定义 web 组件的 [`<template>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/template) 元素中。

在这种情况下，HTML 包含 `<template>` 声明

```html
<template id="my-element">
  <style>
    span {
      color: red;
      border: 2px dotted black;
    }
  </style>
  <span>I'm in the shadow DOM</span>
</template>

<div id="host"></div>
<span>I'm not in the shadow DOM</span>
```

在 JavaScript 中，我们将创建影子 DOM 并将 \<template\> 的内容添加到其中：

```js
const host = document.querySelector("#host");
const shadow = host.attachShadow({ mode: "open" });
const template = document.getElementById("my-element");

shadow.appendChild(template.content);
```
