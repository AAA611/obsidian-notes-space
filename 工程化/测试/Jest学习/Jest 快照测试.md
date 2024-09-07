
## 什么是快照测？

快照测试就是通过对比当前的执行结果与快照来看测试是否通过。

简单来说就是有一份快照，然后每次运行单元测试的时候，用单元测试中的当前快照与之前的快照对比，如果两个快照不匹配，则测试不通过。

## 使用 Jest 进行快照测试

在测试 React 组件时，可以采用类似的方法。可以使用测试渲染器快速为 React 树生成可序列化的值，而不是渲染图形 UI。

### React 组件快照测试示例

考虑下面 Link 组件的测试：

```js
import { render } from "@testing-library/react";
import Link from "../index";

it("render Link correctlt", () => {
  const { container } = render(<Link url="http://123.com" />);

  expect(container).toMatchSnapshot();
});
```

第一次运行测试之后会生成一份快照文件

![[image-20240903170121370.png]]

快照文件 `index.test.tsx.snap` 文件内容如下：

```js
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`render Link correctlt 1`] = `
<div>
  <a
    href="http://123.com"
  />
</div>
`;
```

后续再运行测试时，会将当前运行的结果与快照文件中的结果做对比，如果不相同则测试失败。

### 更新快照

从上面的例子中我们知道快照是再第一次运行单元测试时生成的，假如我们升级了组件，当前快照已经不能满足了，那么我们就需要更新快照。

使用下面命令可以更新快照：

```bash
jest --updateSnapshot
```

如果想限制需要更新快照的测试用例，可以传递 `--testNamePattern` 来标志仅为符合模式的测试重新记录快照。

```bash
jest --updateSnapshot --testNamePattern=^index
```


## 内联快照

内联快照基本上与上面的相同，只是生成的快照不再是单独存放在一个文件，而是再测试用例文件中。

## 匹配器

快照测试还可以进行不精确匹配。

考虑下面例子：

```js
it('will check the matchers and pass', () => {
  const user = {
    createdAt: new Date(),
    id: Math.floor(Math.random() * 20),
    name: 'LeBron James',
  };

  expect(user).toMatchSnapshot({
    createdAt: expect.any(Date), // ⭐这里只要是 Date 类型都可以，不一定完全相等
    id: expect.any(Number), // ⭐这里只要是 Number 类型都可以，不一定完全相等
  });
});

// Snapshot
exports[`will check the matchers and pass 1`] = `
{
  "createdAt": Any<Date>,
  "id": Any<Number>,
  "name": "LeBron James",
}
`;
```


## 最佳实践

快照是识别应用程序中意外界面更改的绝佳工具，无论该界面是 API 响应、UI、日志还是错误消息。

### 将快照视为代码

提交快照并将其视为常规代码一样进行审核流程审核。这意味着像对待项目中的任何其它类型的测试或代码一样对待快照。

确保快照清晰易读。

如前所述，Jest 用于 [`pretty-format`](https://yarnpkg.com/en/package/pretty-format) 使快照易于人类阅读，但您可能会发现引入其他工具很有用，例如 [`eslint-plugin-jest`](https://yarnpkg.com/en/package/eslint-plugin-jest) 使用其 [`no-large-snapshots`](https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-large-snapshots.md) 选项或其 [`snapshot-diff`](https://yarnpkg.com/en/package/snapshot-diff) 组件快照比较功能，以促进提交简短、集中的断言。

### 测试应该是正确的

您的测试应该是确定性的。对未发生改变的组件多次运行相同的测试应该每次都产生相同的结果。您有责任确保生成的快照不包含特定于平台或其他非确定性数据

### 描述性快照名称

始终努力为快照使用描述性测试和/或快照名称。最佳名称描述预期的快照内容。