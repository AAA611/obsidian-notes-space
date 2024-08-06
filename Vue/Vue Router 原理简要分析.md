## 一、Vue Router 的使用
*VueRouter* 的基本使用如下图所示
![[Pasted image 20240707110324.png]]
## 二、Vue.use(VueRouter)
因为 *VueRouter* 是一个 *Vue* 插件，所以需要使用 *Vue.use* 来安装插件。
![[Pasted image 20240707113650.png]]
```js
import View from './components/view'
import Link from './components/link'

export let _Vue

export function install(Vue) {
  if (install.installed && _Vue === Vue) return
  install.installed = true

  // 在外部赋值一个 Vue 引用，主要用于后续其他地方使用，因为 Vue 只能在 install 的参数里面获取到
  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  // Vue 的全局混入，主要用于将
  Vue.mixin({
    beforeCreate() {
      // 是否使用了 VueRouter 路由,使用之后 $options 里面会有一个 router 实例传入,如下:
      // new Vue({
      //   router
      // })
      // ⭐注意:如果 this.$options.router 有定义,那么说明这个实例是 Vue 的根实例,其他组件则不会有 $options.router 参数
      if (isDef(this.$options.router)) {
        this._routerRoot = this // 这个是 Vue 根实例
        this._router = this.$options.router // VueRouter 实例对象
        this._router.init(this) // 初始化
        // 在 Vue 根实例对象(此时的 this)上面定义 _route 属性,_route 属性的数据源是 this._router.history.current
        // this._router.history.current 是一个 Route 对象,大概属性如下:
        // const route: Route = {
        //   name: location.name || (record && record.name),
        //   meta: (record && record.meta) || {},
        //   path: location.path || '/',
        //   hash: location.hash || '',
        //   query,
        //   params: location.params || {},
        //   fullPath: getFullPath(location, stringifyQuery),
        //   matched: record ? formatMatch(record) : []
        // }
        // ⭐注意:这里将 _route 属性变为了响应式的对象,后面依赖 _route 的组件(例如 RouterView 组件),在 _route 变化之后会重新触发渲染
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 如果没有 $options.router 定义,则说明不是 Vue 根实例,那么向上查找直到找到 Vue 根实例的地方
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed() {
      registerInstance(this)
    }
  })

  // 全局挂载 $router 属性,让每个 Vue 组件都可以通过 this.$router 获取到 router
  Object.defineProperty(Vue.prototype, '$router', {
    get() { return this._routerRoot._router }
  })

  // 全局挂载 $route 属性,让每个 Vue 组件都可以通过 this.$route 获取到 route
  Object.defineProperty(Vue.prototype, '$route', {
    get() { return this._routerRoot._route }
  })

  // 全局注册了两个路由相关的组件,可以直接使用
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}

```
总结：
- 全局混入钩子函数，用于初始化 *router* 对象，在 *Vue* 根实例定义响应式数据  *\_route*, 这个即是所有组件中 *this.route* 的数据源，所以我们在组件中使用 *this.$route* 的时候很方便。
- *Vue.prototype* 原型对象上全局挂载 *$router、\$route* 属性。
	- *\$router* 的数据源是 *router* 对象（*VueRouter* 实例）
	- *\$route* 的数据源就是上面所说的响应式数据 *\_route*（这是一个与当前路由相关的对象）
- 全局注册两个组件 RouterView、RouterLink
## 三、new Router
*new Router* 会创建一个 *router* 实例对象
1、首先 *VueRouter* 会根据 *mode* 不同来创建不同的 *history* 实例（有 *hash、history、abstract* 三种）
2、根据 *routes* 创建 *matcher*（使用 *createMatcher* 方法），用于后续的路由匹配。
主要生成下面几个数据结构：
- *nameMap*：路由名称到路由记录的映射，用于通过 *name* 匹配路由
- *pathList*：路由路径字符串列表，用于通过 *path* 来匹配路由
- *pathMap*：路由路径到路由记录的映射，便于通过 *path* 获取对应的路由记录，方便查找
## 四、初始化 router 实例
上面说到 *Vue.use(VueRouter)* 时，会混入一些钩子函数
![[Pasted image 20240707152417.png]]
绿色部分就是在 *Vue* 根实例创建的时候调用 *router.init()* 方法对 *router* 做进一步设置，主要做下一下几个事情：
1. 在 *Vue* 根实例上监听 'hook:destoryed' 也就是实例销毁的生命周期钩子，主要用于在应用销毁时做一些清理工作
2. 设置监听，毫无疑问我们需要监听路由变化事件，*H5 History* 路由监听 *popstate*，*Hash* 路由监听 *hashchange*
3. 进行应用的第一次导航，获取当前地址进行第一次导航
4. 将路由变化关联到页面的渲染，路由最终要的一步莫过于当路由发生变化时，重新渲染出正确的页面。前面说到代表当前路由信息的 *\_route* 数据已经变成响应式数据，*RouterView* 组件的渲染依赖了这个数据，所以在 *\_route* 变化时，*RouterView* 会重新渲染。所以我们需要在路由变化时更新 *\_route* 即可触发响应式的渲染
## 五、总结
本文主要讲解了 *VueRouter* 的简单原理。
1. *VueRouter* 是一个 *Vue* 插件，通过注册插件来混入一些钩子函数、全局挂载一些数据、组件。
2. *VueRouter* 通过 *routes* 配置来建立路由查找索引，后续根据 *name* 或者 *path* 导航来进行路由查找。
3. *Vue* 根实例上面挂载一个响应式的 *_route* 对象，这是一个与当前路由相关的对象，通过在路由变化时改变这个对象，可以实现组件（*RouterView*）的重新渲染，从而渲染出正确的页面。

**监听路由变化，变化后更新 \_route,依赖 \_route 渲染的 RouterView 组件会重新渲染出正确的组件**