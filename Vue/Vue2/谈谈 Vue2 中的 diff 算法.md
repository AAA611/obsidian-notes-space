
## 什么是 diff 算法？

diff 算法是 Vue 中用于对比更新前后的虚拟 DOM 树的一种算法，他的核心作用就是通过对比来尽量复用之前的 DOM，尽量减少对真实 DOM 的操作（ 操作真实 DOM 的性能耗费很大 ）从而提升应用性能的一种算法。

### diff 算法在对比什么？

diff 算法对比的是更新前后，新旧虚拟 DOM 树。

旧的虚拟 DOM 树对应的是目前页面上的元素
新的虚拟 DOM 树则对应的是更新后应该展示的元素

通过对比两者来最小改变 DOM，最大复用真实 DOM，从而提升性能。

## diff 算法的流程

Vue2 中，执行 diff 算法的入口函数是 patch 函数，由 createPatchFunction 创建。

patch 函数中主要用于指定 diff 的函数是 patchVnode 函数，它接收 oldVnode、vnode 作为参数（ 实际上不止这两个参数，但这两个是最重要的 ）来进行上面描述的 diff 算法。



