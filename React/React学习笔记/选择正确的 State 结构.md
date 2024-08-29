## State 的原则

1. **合并关联的 state**。如果你总是同时更新两个或更多的 state 变量，请考虑将它们合并为一个单独的 state 变量。
2. **避免互相矛盾的 state**。当 state 结构中存在多个相互矛盾或“不一致”的 state 时，你就可能为此会留下隐患。应尽量避免这种情况。
3.  **避免冗余的 state**。<mark style="background: #BBFABBA6;">如果你能在渲染期间从组件的 props 或其现有的 state 变量中计算出一些信息，则不应将这些信息放入该组件的 state 中。</mark>
4.  **避免重复的 state**。当同一数据在多个 state 变量之间或在多个嵌套对象中重复时，这会很难保持它们同步。应尽可能减少重复。
5. **避免深度嵌套的 state**。深度分层的 state 更新起来不是很方便。如果可能的话，最好以<mark style="background: #BBFABBA6;">扁平化方式构建 state</mark>。

这些原则背后的目标是 **使 state 易于更新而不引入错误**。从 state 中删除冗余和重复数据有助于确保所有部分保持同步。这类似于数据库工程师想要 [“规范化”数据库结构](https://docs.microsoft.com/zh-CN/office/troubleshoot/access/database-normalization-description)，以减少出现错误的机会。用爱因斯坦的话说，**“让你的状态尽可能简单，但不要过于简单。”**

## 合并关联的 state

1. **如果某两个 state 变量总是一起变化，则将它们统一成一个 state 变量可能更好**
2. 你需要将数据整合到一个对象或一个数组的情况是，你不知道未来需要多少个 state 片段。例如，有一个用户可以添加自定义字段的表单时，这将会很有帮助。

## 避免互相矛盾的 state

**因为 `isSending` 和 `isSent` 不应同时为 `true`，所以最好用一个 `status` 变量来代替它们，这个 state 变量可以采取三种有效状态其中之一**：`'typing'` (初始), `'sending'`, 和 `'sent'`:

## ⭐避免冗余的 state

如果你能在渲染期间从组件的 props 或其现有的 state 变量中计算出一些信息，则不应该把这些信息放到该组件的 state 中。

考虑下面例子：

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

这个表单有三个 state 变量：`firstName`、`lastName` 和 `fullName`。然而，`fullName` 是多余的。**在渲染期间，你始终可以从 `firstName` 和 `lastName` 中计算出 `fullName`，因此需要把它从 state 中删除。**

优化后的代码如下：

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}

```

### 不要在 state 中镜像 props

考虑下面代码：

```jsx
function Message({ messageColor }) {  

const [color, setColor] = useState(messageColor);
```

这里，一个 `color` state 变量被初始化为 `messageColor` 的 prop 值。这段代码的问题在于，**如果父组件稍后传递不同的 `messageColor` 值（例如，将其从 `'blue'` 更改为 `'red'`），则 `color`** state 变量**将不会更新！** state 仅在第一次渲染期间初始化。

这就是为什么在 state 变量中，“镜像”一些 prop 属性会导致混淆的原因。相反，你要在代码中直接使用 `messageColor` 属性。如果你想给它起一个更短的名称，请使用常量：

```jsx
function Message({ messageColor }) {  

const color = messageColor;
```

这种写法就不会与从父组件传递的属性失去同步。

<mark style="background: #BBFABBA6;">只有当你 **想要** 忽略特定 props 属性的所有更新时，将 props “镜像”到 state 才有意义</mark>。按照惯例，prop 名称以 `initial` 或 `default` 开头，以阐明该 prop 的新值将被忽略：

```
function Message({ initialColor }) {  // 这个 `color` state 变量用于保存 `initialColor` 的 **初始值**。  // 对于 `initialColor` 属性的进一步更改将被忽略。  const [color, setColor] = useState(initialColor);
```

## 避免重复的 state

考虑下面例子：

```jsx
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}

```

当前，它将所选元素作为对象存储在 `selectedItem` state 变量中。然而，这并不好：**`selectedItem` 的内容与 `items` 列表中的某个项是同一个对象。** <mark style="background: #BBFABBA6;">这意味着关于该项本身的信息在两个地方产生了重复。</mark>

优化后代码：

```jsx
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  // ⭐ 通过计算获得，避免重复的state，因为很难保证两个状态的同步
  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}

```

## 避免深度嵌套的 state