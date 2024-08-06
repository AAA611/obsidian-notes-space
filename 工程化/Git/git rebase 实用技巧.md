
## 介绍

在 Git 中**整合来自不同分支的修改**主要有两种方法：`merge` 以及 `rebase`。

## 使用变基

### 整合分支提交

分叉的提交历史

![[image-20240806213820254.png]]

上图中我们的分支 `experiment` 是基于 C2 又做了一次新的提交 C4，而 `master` 分支也基于 C2 做了一次新的提交 C3。

这个时候如果我们想要在其中一个分支应用另一个分支中的最新代码，有两种方法：`merge（合并）` 与 `rebase（变基）`

合并的结果是生成一个新的提交，如下图所示：

![[image-20240806214155088.png]]

还有一种整合的方法是使用 `rebase`

```shell
git checkout experiment
git rebase master
```

它的原理是：
1. 找出这两个分支的最近公共祖先 C2
2. 对比当前分支相对于祖先 C2 的历次提交，提取相应的修改并保存为临时文件
3. 将当前分支指向目标基底 C3
4. 最后以此将之前另存为临时文件的修改依序应用

变基的结果如下图所示：

![[image-20240806214911221.png]]

### 合并多个提交

使用 rebase 还可以很方便地合并多次提交。

例如我们正在开发一个功能 FeatureA，首先我们进行了一次提交记为 C1，后面又发现一些问题，陆陆续续对 FeatureA 做了多次的提交更改 C2、C3、...。

这样对一个功能 FeatureA 提交了多次会造成提交记录的冗余，同时 commit message 也不好区分。这个时候就可以使用 rebase 来合并多次的提交为一个提交。

方法如下：

1、执行命令

```shell
git rebase -i HEAD~2 // ⭐ 表示合并最近的两次的提交记录
```

2、执行完命令之后会进入 vi 编辑模式

```vim
p cacc52da feat: 提交1
s f072ef48 feat: 提交2 // ⭐ 将 p 改为 s

# Rebase 5f2452b2..8f33126c onto 5f2452b2 (4 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

改好之后，按 Esc 并输入 wq 退出并保存

3、此时会进入 commit message 的 vi 编辑模式，更改自己想要的 commit message 然后像第二步一样推出并保存即可。

## 参考

[Git - 变基](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA)
[彻底搞懂 Git-Rebase - Jartto's blog](http://jartto.wang/2018/12/11/git-rebase/)