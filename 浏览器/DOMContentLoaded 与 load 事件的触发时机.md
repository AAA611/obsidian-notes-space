
## DOMContentLoaded 事件

当 HTML 文档完全解析，且所有延迟脚本（ `<script defer src="...">` 和 `<script type="module">` ）下载和执行完毕后，会触发 `DOMContentLoaded` 事件。他不会等待图片、子框架（ iframe ）和异步脚本内容完成加载。

`DOMContentLoaded` 不会等待样式表加载，但延时脚本会等待样式表，而且 `DOMContentLoaded` 事件排在延迟脚本之后。此外，非延迟或异步的脚本将等待一解析的样式表加载。

## load 事件

`load` 事件在整个页面及所有依赖资源如样式表和图片都完成加载时触发。它与 `DOMContentLoaded` 不同，后者只要页面 DOM 加载完成就触发，无需等待依赖资源的加载。

该事件不可取消，也不会冒泡。

> 注意：所有以 `load` 命名的事件都不会传递到 `window` 上，即使 `bubbles` 初始化为 `true`。要在 `window` 上捕获 `load` 事件，相关的 `load` 事件必须直接绑定到 `window` 上。

## 参考

[Document：DOMContentLoaded 事件 - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/DOMContentLoaded_event)
[Window：load 事件 - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/load_event)