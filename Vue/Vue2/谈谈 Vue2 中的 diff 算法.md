
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

```js
const nodeOps = {
  setTextContent() { }
}

function patchVnode(oldVnode, vnode) {
  const oldCh = oldVnode.children
  const newCh = vnode.children

  if (isUndef(vnode.text)) { // 新节点不是文本节点
    if (isDef(oldCh) && isDef(newCh)) {
      if (oldCh !== newCh) {
        updateChildren(oldCh, newCh) // 新旧节点都有 children 节点，则使用 updateChildren 来对比子节点
      }
    } else if (isDef(newCh)) { // 走到这里的逻辑说明只有新节点，没有旧节点，那么就需要挂载新的节点
      // 注意：旧的子节点没有的话，也可能是旧的节点是一个文本节点，所以这里要加一个判断
      if (idDef(oldVnode.text)) {
        nodeOps.setTextContent('') // 如果旧的节点是文本节点，则需要置空
      }
      addVnodes(newCh)
    } else if (isDef(oldCh)) { // 走到这里的逻辑说明只有旧节点，没有新节点，则旧的节点需要被移除
      removeVnodes(oldCh)
    } else if (isDef(oldVnode.text)) { // 走到这里的逻辑就说明新旧节点都没有子节点，那么它们有可能是文本节点，由于这里的逻辑是处于 isUndef(vnode.text) 所以新节点不是文本节点，但旧节点可能是文本节点
      nodeOps.setTextContent('')
    }
  } else if (oldVnode.text !== vnode.text) { // 走到这里的逻辑说明新的节点是文本节点
    nodeOps.setTextContent(vnode.text) // 设置为新节点的 text 文本
  }
}


function updateChildren(oldCh, newCh) {
  // updateChildren 函数的作用是对比新旧子节点数组
  // 采用的是双端对比的方式

  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartVnode = oldCh[oldStartIdx]
  let oldEndVnode = oldCh[oldEndIdx]
  let newStartVnode = newCh[newStartIdx]
  let newEndVnode = newCh[newEndIdx]

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameNode(oldStartVnode, newStartVnode)) {

    } else if (sameNode(oldEndVnode, newEndVnode)) {

    } else if (sameNode(oldStartVnode, newEndVnode)) {

    } else if (sameNode(newStartIdx, oldEndVnode)) {

    } else {
      // 上面几种情况都没有匹配到的时候，通过
      if (isUndef(oldKeyToIdx)) {
        oldKeyToIdx = createKeyToOldIdx()
      }
      const idxInOld = idDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh)

      if (isUndef(idxInOld)) {
        // 说明旧节点中没有可复用的节点

        // 创建新的节点
        createElm(newStartVnode)
      } else {
        vnodeToMove = oldCh(idxInOld)
        // 在旧的节点中找到了可复用的节点,比较一下两者
        if (sameNode(newStartVnode, vnodeToMove)) {
          patchVnode(vnodeToMove, newStartVnode) // 服用了节点，只做打补丁的操作
        } else {
          // sameKey but different element
          // 有时候由于开发人员的不规范使用 key，导致 key 相同但是元素的类型都可能变化了，所以这种情况要考虑到，要创建新元素不能复用旧的

          createElm(newStartVnode)
        }
      }
    }
  }

  // while 循环完毕之后，说明有一边的 children 节点已经被遍历完了

  if (oldStartIdx > oldEndIdx) {
    // 说明旧的节点遍历完了，新的节点可能还未遍历完

    // 将剩余新的节点添加
    addVnodes(newCh, newStartIdx, newEndIdx)
  } else if (newStartIdx > newEndIdx) {
    // 说明新的节点遍历完了，但是旧的节点可能还未遍历完

    // 删除剩余的旧节点
    removeVnodes(oldCh, oldStartIdx, oldEndIdx)
  }
}


function createElm() { }
function findIdxInOld() { }
function createKeyToOldIdx() { }
function sameNode() { }
function addVnodes() { }
function removeVnodes() { }
function isDef() { }
function isUndef() { }


// FAQ

// Q：key 有什么作用？

// A：
// 1、key 是 Vue 提供给开发者的一个节点属性，它主要作用于 Vue 中的 diff 算法过程。在 Vue diff 过程中，Vue 会尽量复用之前的旧节点来达到最少操作真实
// DOM 的目的，如果提供了正确的 key，那么 Vue 就可以在 diff 时通过 key 来从旧的节点中找到相同的的可复用节点（ ⭐注意：前提是相同节点的 key 在渲染前后不变 ）。
// 从而更好地来操作 DOM
// 2、除此之外，由于节点前后 key 不同的话会被认为是不相同的节点，所以不会复用，而是会销毁旧的然后重新创建新的，所以在有些时候我们可能通过改变 key 来让 Vue
// 重新渲染这个节点或者组件，这在有些情况下可能会有用

// Q：不提供 key 会有什么问题？

// A：
// 假如我们在一个 for 循环中没有给子元素提供 key，那么 Vue 在进行 diff 更新的时候，可能会多做一些操作。
// 举个例子：
// 有一个渲染列表为 [1,2,3],更新后为 [1,3,2]。假设都是使用 div 元素进行渲染
// 在 Vue2 进行双端 diff 算法时，由于没有提供 key，渲染前后所有元素的 key 都是 undefined，这也视为相同。那么在对比两个列表的尾部时，div-3 与 div-2 可以被认为是
// 相同的元素,Vue 会进行复用,但由于文本节点的内容不同,所以 Vue 需要使用 setTextContent 来改变 DOM 元素的内容,其他情况也类似。
// 但是如果提供了 key，那么 Vue 在 diff 的过程中通过 key 来寻找可复用节点，由于列表中的元素只是顺序变化了，所以 Vue 只需要移动 DOM 元素的位置即可
// 而不需要对 DOM 进行更改操作。这里只是举一个比较简单的例子，在一些复杂情况下，这种差异可能会尤为明显，所以在 for 循环中我们一般需要给每个子节点指定一个合理的 key

// Q：没有 key 就不能复用元素吗？

// A：
// 不是的，没有 key 的，情况下，Vue 也会尝试从旧的子节点中查找能够复用的元素，虽然可能要做一些 patch 操作。如果提供了 key，Vue 在复用元素时就会更加
// 精准，一定程度上可以进一步减少不必要的 DOM 操作。
```

