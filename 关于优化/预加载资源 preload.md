
## 原理

预加载资源可以让浏览器<mark style="background: #BBFABBA6;">提前发现并加载资源</mark>，浏览器缓存预加载的资源以便在需要的时候直接使用。

## 使用场景

### 预加载在 CSS 中定义的资源

在浏览器下载并解析 CSS 文件之前，系统不会发现使用 [`@font-face`](https://web.dev/articles/reduce-webfont-size?hl=zh-cn#define_a_font_family_with_font-face) 规则定义的字体或在 CSS 文件中定义的背景图片。预加载这些资源可确保在下载 CSS 文件之前提取这些资源。

### 预加载 CSS 文件

如果您使用的是[关键 CSS 方法](https://web.dev/articles/extract-critical-css?hl=zh-cn)，则可以将 CSS 拆分为两部分。呈现首屏内容所需的关键 CSS 内嵌在文档的 `<head>` 中，非关键 CSS 通常会使用 JavaScript 进行延迟加载。如果在加载非关键 CSS 之前等待 JavaScript 执行，可能会导致用户滚动页面时出现延迟，因此最好使用 `<link rel="preload">` 尽早启动下载。

### 预加载 JavaScript 文件

由于浏览器不会执行预加载的文件，因此预加载有助于将提取与[执行](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/?hl=zh-cn)操作分离开来，从而提高可交互时间等指标。如果您[拆分](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting?hl=zh-cn) JavaScript 软件包，并且仅预加载关键分块，则预加载的效果最佳。

## 怎么使用 rel=preload

实现 `preload` 的最简单方法是向文档的 `<head>` 添加 `<link>` 标记：

```
<head>  <link rel="preload" as="script" href="critical.js"></head>
```

⭐重要：**提供 `as` 属性有助于浏览器根据预提取资源的类型设置其优先级、设置正确的标头，以及确定该资源是否已存在于缓存中**。此属性接受的值包括：`script`、`style`、`font`、`image` 和 [others](https://developer.mozilla.org/docs/Web/HTML/Element/link#Attributes)。

⭐重要：某些类型的资源（例如字体）以[匿名模式](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements)加载。对于这些元素，您必须使用 `preload` 设置 `crossorigin` 属性：

```
<link rel="preload" href="ComicSans.woff2" as="font" type="font/woff2" crossorigin>
```
## 参考

[预加载关键资源，以提高加载速度  |  Articles  |  web.dev](https://web.dev/articles/preload-critical-assets?hl=zh-cn)