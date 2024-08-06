## 面试问题
### 在使用 qiankun 时，你如何处理老项目的资源加载问题？能给出一些具体的解决方案吗？

1. **使用 `qiankun` 的 `getTemplate` 函数重写静态资源路径**：对于 HTML 中已有的 `img/audio/video` 等标签，`qiankun` 支持重写 `getTemplate` 函数，可以将入口文件 `index.html` 中的静态资源路径替换掉。例如：

```js
start({
  getTemplate(tpl,...rest) {
    // 为了直接看到效果，所以写死了，实际中需要用正则匹配
    return tpl.replace('<img src="./img/my-image.png">', '<img src="http://localhost:8080/img/my-image.png">');
  }
});
```

2. **劫持标签插入函数**：对于动态插入的 `img/audio/video` 等标签，我们可以劫持 `appendChild` 、 `innerHTML` 、`insertBefore` 等事件，将资源的相对路径替换成绝对路径。例如，我们可以劫持 jQuery 的 `html` 方法，将图片的相对路径替换为绝对路径：
3. **给老项目加上 webpack 打包**：这个方案的可行性不高，都是陈年老项目了，没必要这样折腾。
5. **使用 iframe 嵌入老项目**：虽然 `qiankun` 支持 jQuery 老项目，但是似乎对多页应用没有很好的解决办法。每个页面都去修改，成本很大也很麻烦，但是使用 iframe 嵌入这些老项目就比较方便

### 你能解释一下 `qiankun` 的 `start` 函数的作用和参数吗？如果只有一个子项目，你会如何启用预加载？

如果只有一个子应用，可以通过 start 函数的 prefetch 配置：

```js
start({ prefetch:'all' })
```

### 在使用 `qiankun` 时，你如何处理 `js` 沙箱不能解决的 `js` 污染问题？

遵循良好的开发习惯，在子应用中如果注册了全局的监听事件，我们可以在 unmount 生命周期钩子中移除相应的事件。

其他一些具有副作用的操作也是如此。

### 你能解释一下 `qiankun` 如何实现 `keep-alive` 的需求吗？

我们可以通过一些技巧来实现 `keep-alive` 的效果。一种可能的方法是在子应用的生命周期函数中保存和恢复子应用的状态。例如，我们可以在子应用的 `unmount` 函数中保存子应用的状态，然后在 `mount` 函数中恢复这个状态：

```js
// 伪代码
let savedState;

export async function mount(props) {
  // 恢复子应用的状态
  if (savedState) {
    restoreState(savedState);
  }
}

export async function unmount() {
  // 保存子应用的状态
  savedState = saveState();
}

function saveState() {
  // 保存子应用的状态
  // 这个函数的实现取决于你的应用
}

function restoreState(state) {
  // 恢复子应用的状态
  // 这个函数的实现取决于你的应用
}
```

### 你能解释一下 `qiankun` 和 `iframe` 在微前端实现方式上的区别和优劣吗？在什么情况下，你会选择使用 `iframe` 而不是 `qiankun`？

[[为什么不是 iframe]]

