## globalState

globalState 通信方式是 qiankun 中提供的一套基于**发布订阅**模式的一种应用见通信方式。
### 使用

主应用：

```js
import { initGlobalState } form 'qiankun'

// 初始化 state
const actions=initGlobalState({user:'Main app'})

// 订阅 state 变化，state 变化则会执行回调
actions.onGlobaStateChange((state,prev)=>{
	console.log(state,prev)
})

actions.setGlobalState({user:'Main app1'}) // 改变 state
```

子应用：

```js
// 从生命周期 mount 中获取通信方法，使用方式和 master 一致
export function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev);
  });

  props.setGlobalState(state);
}
```

### 原理解析

qiankun 在子应用的 mount 中会注入额外的 onGlobalStateChange、setGlobalState 参数。所以在 子应用的 mount 钩子中可以通过参数来获取通信方法。

![[Pasted image 20240710160949.png]]

qiankun 的 globalState 通信方案就是由主应用在全局定义一个状态 `state`，主、子应用通过 `onGlobalStateChange(callback)` 方法来订阅 `state` 的变化。`state` 变化之后会调用 `onGlobalStateChange` 方法传入的回调，回调函数的参数是新、旧 `state`。

## props 传递

### 使用

在通过 registerMicroApp 或者 loadMicroApp 加载子应用时，可以通过 props 参数来实现主应用向子应用传递数据的目的。

```js
// 主应用
import { registerMicroApp,start } from 'qiankun'
import store from './store'

const app={...,props:{ store }} // 向子应用传递 store 对象

registerMicroApp([app])

start()
```

上面示例中，在加载子应用的时候使用 props:{ store } 向子应用传递了主应用的 store 对象，子应用可以在钩子函数中获取使用。

```js
子应用
// ...

export async mount(props){
	// 子应用接收 store 对象并挂载到 Vue 原型上，方便后面在其他地方使用。
	Vue.prototype.mainStore=props.store
} 

// ...
```

## 总结
应用间通信是构建微前端应用的重要部分，在很多场景下应用间通信都是必要的。本文主要介绍了两种由于间通信方式：
- **基于发布订阅的 globalstate**
- **基于 props 传递（只能再子应用钩子中获取，一般用于传递一些固定的值或者是方法等）**

但应用间的通信应尽量少且简单。复杂繁琐的应用间通信用于考虑子应用的拆分是否合理。