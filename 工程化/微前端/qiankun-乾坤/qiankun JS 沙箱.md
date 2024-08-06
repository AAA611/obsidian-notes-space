## 介绍
沙箱是一种计算机领域的技术。它可以让软件运行在一个限制的环境中，在这个限制的环境中，软件的运行会受到限制，从而实现对外部的影响可控。这个限制的环境指的就是沙箱环境。

同样，对于多个独立的 JS 脚本来说，他们的执行可能会发生冲突。
例如，脚本 A 在全局创建了一个全局变量 name，脚本 B 也创建了同名的变量，那么全局变量 name 会被另一方覆盖。脚本 A 与脚本 B 之间就产生了冲突。我们可以使用 沙箱技术也解决这一问题。

在 qiankun 中，多个子应用都具有相互独立的 JS 脚本，如何让它们不产生冲突呢？qiankun 使用了沙箱环境来解决这个问题。下面我们详细讨论 qiankun 中的沙箱。

## snapshotSandbox - 快照沙箱
快照沙箱的实现原理是在运行脚本前记录全局的状态快照，脚本执行完之后根据快照在恢复到脚本执行前的状态。

### 实现
qiankun 中的实现：

```js
function iter(obj: typeof window | Record<any, any>, callbackFn: (prop: any) => void) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const prop in obj) {
    // patch for clearInterval for compatible reason, see #1490
    if (obj.hasOwnProperty(prop) || prop === 'clearInterval') {
      callbackFn(prop);
    }
  }
}

export default class SnapshotSandbox {
  proxy: WindowProxy
  name: string
  type: any
  sandboxRunning = true

  private windowSnapshot!: Window
  private modifyPropsMap: Record<any, any> = {}
  private deletePropsSet: Set<any> = new Set()
  constructor(name: string) {
    this.name = name
    this.proxy = window
    this.type = 'SnapshotSandbox'
  }

  /**
   * 激活沙箱
   */
  active() {
    // 快照对象
    this.windowSnapshot = {} as Window
    // 遍历 window 对象赋值属性,记录 window 当前快照
    iter(window, (prop) => {
      this.windowSnapshot[prop] = window[prop]
    })

    // 除了要记录快照,还需要恢复之前的状态
    Object.keys(this.modifyPropsMap).forEach(prop => {
      window[prop] = this.modifyPropsMap[prop]
    })

    // 删除之前删除的属性
    this.deletePropsSet.forEach(prop => {
      delete window[prop]
    })

    this.sandboxRunning = true
  }

  /**
   * 失活沙箱
   */
  inactive() {
    this.modifyPropsMap = {}
    this.deletePropsSet.clear()

    iter(window, (prop) => {
      if (window[prop] !== this.windowSnapshot[prop]) {
        // 说明在运行脚本的过程中改变了 window 上面的属性
        // 将改变的属性记录下来,后面再执行这个脚本的时候恢复它之前修的属性
        this.modifyPropsMap[prop] = window[prop]
        // 根据快照恢复 window 原来的属性
        window[prop] = this.windowSnapshot[prop]
      }
    })

    iter(this.windowSnapshot, prop => {
      if (!window.hasOwnProperty(prop)) {
        // 脚本运行时删除了某个属性也要记录下来
        this.deletePropsSet.add(prop)
        window[prop] = this.windowSnapshot[prop]
      }
    })

    this.sandboxRunning = false
  }
}
```

可以看到快照沙箱的实现原理很简单，主要有两个核心逻辑：
- **激活沙箱**：记录当前 window 的快照。还需要恢复之前的执行状态，因为沙箱可能是二次激活，这个时候 modifyPropsMap 与 deletePropSet 可能有值。
- **失活沙箱**：根据激活时记录的快照对象恢复 window 状态，同时应该记录变更。

### 优缺点
优点：
- 实现简单，兼容性好
缺点：
- 只支持单例模式，因为不能多个子应用脚本同时修改 window，那样无法区分时哪个子应用的修改。
- 效率不高，每次切换都需要遍历 window 对象


## LegacySandbox

LegacySandbox 沙箱的原理是直接通过 Proxy 代理 window 对象，通过监听 set、get 等操作来直接记录更改。

代码如下：

```js
function isPropConfigurable(target: typeof window, prop: PropertyKey) {
  const descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}

function setWindowProp(prop: PropertyKey, value: any, toDelete?: boolean) {
  if (value === undefined && toDelete) {
    delete (window as any)[prop];
  } else if (isPropConfigurable(window, prop) && typeof prop !== 'symbol') {
    Object.defineProperty(window, prop, { writable: true, configurable: true });
    (window as any)[prop] = value;
  }
}

/**
 * 基于 Proxy 实现的沙箱
 * TODO: 为了兼容性 singular 模式下依旧使用该沙箱，等新沙箱稳定之后再切换
 */
export default class SingularProxySandbox implements SandBox {
  /** 沙箱期间新增的全局变量 */
  private addedPropsMapInSandbox = new Map<PropertyKey, any>();

  /** 沙箱期间更新的全局变量 */
  private modifiedPropsOriginalValueMapInSandbox = new Map<PropertyKey, any>();

  /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */
  private currentUpdatedPropsValueMap = new Map<PropertyKey, any>();

  name: string;

  proxy: WindowProxy;

  type: SandBoxType;

  sandboxRunning = true;

  latestSetProp: PropertyKey | null = null;

  active() {
    if (!this.sandboxRunning) {
      this.currentUpdatedPropsValueMap.forEach((v, p) => setWindowProp(p, v));
    }

    this.sandboxRunning = true;
  }

  inactive() {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
        ...this.addedPropsMapInSandbox.keys(),
        ...this.modifiedPropsOriginalValueMapInSandbox.keys(),
      ]);
    }

    // renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
    // restore global props to initial snapshot
    this.modifiedPropsOriginalValueMapInSandbox.forEach((v, p) => setWindowProp(p, v));
    this.addedPropsMapInSandbox.forEach((_, p) => setWindowProp(p, undefined, true));

    this.sandboxRunning = false;
  }

  constructor(name: string) {
    this.name = name;
    this.type = SandBoxType.LegacyProxy;
    const { addedPropsMapInSandbox, modifiedPropsOriginalValueMapInSandbox, currentUpdatedPropsValueMap } = this;

    const rawWindow = window;
    const fakeWindow = Object.create(null) as Window;

    const proxy = new Proxy(fakeWindow, {
      set: (_: Window, p: PropertyKey, value: any): boolean => {
        if (this.sandboxRunning) {
          if (!rawWindow.hasOwnProperty(p)) {
            addedPropsMapInSandbox.set(p, value);
          } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
            // 如果当前 window 对象存在该属性，且 record map 中未记录过，则记录该属性初始值
            const originalValue = (rawWindow as any)[p];
            modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
          }

          currentUpdatedPropsValueMap.set(p, value);
          // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
          // eslint-disable-next-line no-param-reassign
          (rawWindow as any)[p] = value;

          this.latestSetProp = p;

          return true;
        }

        if (process.env.NODE_ENV === 'development') {
          console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`);
        }

        // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
        return true;
      },

      get(_: Window, p: PropertyKey): any {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (p === 'top' || p === 'parent' || p === 'window' || p === 'self') {
          return proxy;
        }

        const value = (rawWindow as any)[p];
        return getTargetValue(rawWindow, value);
      },

      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has(_: Window, p: string | number | symbol): boolean {
        return p in rawWindow;
      },

      getOwnPropertyDescriptor(_: Window, p: PropertyKey): PropertyDescriptor | undefined {
        const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
        // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object
        if (descriptor && !descriptor.configurable) {
          descriptor.configurable = true;
        }
        return descriptor;
      },
    });

    this.proxy = proxy;
  }
}

```

### 优缺点

优点：
- 不在像快照沙箱那样频繁赋值整个 window 对象，而是通过代理来获取更改。性能更好。
缺点：
- 兼容性不如快照沙箱，依然只支持单例。
## Proxy 沙箱

Proxy 沙箱的实现原理是基于 Proxy 代理。

Proxy 的实现原理是：

- 把当前 window 的一些原生属性（如 document、location 等）拷贝出来，单独放在一个对象上，这个对象称为 fakeWindow。
- 之后每个微应用分配一个 fakeWindow，这也是可以实现多实例的关键。
- 当微应用修改全局变量时：
	- 如果时原生属性，则修改全局的 window
	- 如果不是原生属性，则修改 fakeWindow 里的内容
- 微应用获取全局变量时：
	- 如果时原生属性，则从 window 里拿
	- 如果不是原生属性，则优先从 fakeWindow 里面拿

### 隔离原理

隔离主要时针对各个子应用的脚本的执行进行隔离，我们需要把子应用的脚本的执行放到我们创建的沙箱环境中。

由于乾坤使用的是 import-html-entry 加载子应用，子应用脚本的执行实际上是由 import-html-entry 中的方法完成的。实现隔离的操作也是在其中进行的。其原理如下：

```js
const executableScript = `
  ;(function(window, self, globalThis){
    ;${scriptText}${sourceUrl}
  }).bind(window.proxy)(window.proxy, window.proxy, window.proxy);
`

eval.call(window, executableScript)
```

在上面代码中，window. proxy 是乾坤传进来的沙箱实例，通过将其作为子应用脚本的 window 对象，在子应用中访问 window 其实就是在访问 window. proxy。

但这种方式依然有有问题：加入我没有通过 window 来定义全局变量，像下面这样：

```js
a = 123

a // undefined
```

由于上下文 this 也是 window. proxy, 所以无法访问到 a 属性。**详见 [这个 Issue](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fumijs%2Fqiankun%2Fissues%2F1894 "https://github.com/umijs/qiankun/issues/1894")。**

怎么解决呢？

1. 把代码 a = 123 换成 window. a = 123
2. 添加全局声明 window. a

这样一来，你就得每次打包代码以及发布时执行一个脚本来做这些文本替换，非常麻烦。
### 优缺点
优点：
- 支持多实例，因为每个由于都拥有自己的 fakeWindow 对象
缺点：
- Proxy 存在一定的兼容性问题

## 总结

要和这些沙箱结合起来使用，qiankun 会把要执行的 JS 包裹在立即执行函数中，通过绑定上下文和传参的方式来改变 `this` 和 `window` 的值，让它们指向 `window.proxy` 沙箱对象，最后再用 `eval` 来执行这个函数。