## 题目介绍

题目描述：

![[image-20240727091847556.png]]

这道题大概一看就很容易想到二分查找，因为二分查找在有序数组中查找的时间复杂是 $O(lgN)$ 。

但这道题的核心点在于给出的数组 `nums` 并不是一个严格的升序数组，而是由升序数组 "旋转" 而来，下面让我们深入分析一下如何使用二分查找来解决这个问题。

## 思路分析

假设现在有一个经旋转后的数组 `nums = [4,5,6,7,0,1,2]`, 我们要寻找的 `target = 0` 。

下面我使用一张图来描述一下现在的 `nums`：

![[image-20240727092545594.png]]

从上图中我们可以得到两个关键信息：

- **有序数组在经过 “旋转” 后可以看作两段升序区间**
- **第二个升序区间（图中红色部分）中的所有值都比第一段区间中的值要小**

现在我们计算第一个 `mid`，`mid=3`，`mid` 在 `nums` 中的位置如下图所示：

![[image-20240727093440810.png]]

从图中可以看到 `mid` 位于第一个升序区间内，这时我们可以通过比较 `target` 与 `nums[mid]` 的值来确定 `target` 位于 `mid` 的左边还是右边。

如果  `nums[left] < target < nums[mid],` 那么 `target` 位于 `left` 与 `mid` 之间的这段升序区间内，可以更新 `right = mid-1`。注意这一步一定要 `target > nums[left]`, 否则 `target` 只是小于 `nums[mid]` 的话，也可以位于第二区间内，这样我们便不能正确更新 `right` 的值。

不然：`target` 则位于 `mid` 与 `right` 之间，则可以更新 `left = mid+1`。

这个时候可能有些伙伴会有疑问，那如果 `mid` 位于第二个升序区间内，上面的逻辑不就不成立了吗？

确实是这样，假如 `mid` 的位置像下面这样，上面的逻辑则行不通。

![[image-20240727095256902.png]]

假设 `mid` 位于上图中的位置，我们的逻辑则会与上面的逻辑不同，变成下面的逻辑：

如果 `nums[mid] < target < nums[right]` ，则可以更新 `left = mid+1`

不然： `traget` 位于 `mid` 的左侧，则可以更新 `right = mid - 1`

**读到这里你可能发现了，我们有一个关键的判断需要实现，那就是确定 mid 的位置是出于第一区间还是第二区间。不同的区间我们有不同的逻辑。**

仔细观察你会发现 `mid` 的位置其实很好确认，这得益于我们上面的一个重要结论：**第二区间的所有值都小于第一区间**。

有了这个理论基础，则可以通过判断 `nums[mid]` 与 `nums[left]` 的关系来确定 `mid` 的位置：

若 `nums[mid] > nums[left]` 则说明 `mid`, 一定在第一区间内，因为第二区间的值都比 `nums [left]` 要小
否则 `mid` 应该属于第二区间。

如此以来，我们便清楚了如何在查找的过程中不断更新` left、right` 的值来缩小查找范围，这也是二分查找的核心，有了上述分析，我们可以轻松写出查找的代码，如下：

```js
var search = function (nums, target) {
  const n = nums.length
  let left = 0 // 左指针 left
  let right = n - 1 // 右指针 right
  while (left <= right) {
    const mid = Math.floor((right - left) / 2) + left // 计算 mid
    if (target === nums[mid]) {
      return mid // 找到了 target，返回下标 mid
    }
    if (nums[mid] >= nums[left]) {
      // mid 位于第一升序区间
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1
      } else {
        left = mid + 1
      }
    } else {
      // mid 位于第二升序区间内
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
  }
  return -1
};
```

## 总结

本文主要分析了二分查找在解决旋转升序数组中的一些思路，希望能让你对二分查找有更加深入的理解对你有所帮助。