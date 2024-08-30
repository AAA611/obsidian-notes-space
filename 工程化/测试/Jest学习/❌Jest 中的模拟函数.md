
## 模拟函数

模拟函数允许你通过擦除函数的实际实现、捕获对函数的调用（ 以及在这些调用中传递的参数 ）、捕获使用 `new` 来实例化一个函数以及允许测试时配置模拟函数的返回值来测试代码之间的连接。

## 使用模拟函数

假设我们正在测试一个函数的实现`forEach`，该函数为提供的数组中的每个项目调用一个回调

```js
export function forEach(items, callback) {
  for (const item of items) {
    callback(item);
  }
}
```

为了测试上面的 forEach 函数，我们可以使用模拟函数，因为我们并不关心 callback 函数的具体实现，我们关心的是我们 froEach 函数的实现。所以我们可以创建一个模拟函数来作为 callback，进而捕获对 callback 函数的调用信息。

为了测试，我们使用模拟函数，并检查模拟的状态以确保回调按预期调用

```js
import { forEach } from '../forEach.js'
import { jest } from '@jest/globals'

const mockCallback = jest.fn(x => 42 + x)

test('forEach mock function', () => {
    forEach([0, 1], mockCallback)

    // 测试模拟函数调用次数
    expect(mockCallback.mock.calls).toHaveLength(2)

    // 测试模拟函数调用参数
    expect(mockCallback.mock.calls[0][0]).toBe(0)
    expect(mockCallback.mock.calls[1][0]).toBe(1)

    // 测试模拟函数返回值
    expect(mockCallback.mock.results[0].value).toBe(42)
    expect(mockCallback.mock.results[1].value).toBe(43)
})
```
## .mock

所有的模拟函数都一个特殊属性 `.mock`，其中保存了有关函数如何被调用以及函数返回什么数据。该 `.mock` 属性还跟踪每次调用的 `this`，因此也可以检查它。

## 模拟返回值


### 模拟模块 jest. mock

```js
import axios from 'axios';

class Users {
  static all() {
    return axios.get('/users.json').then(resp => resp.data);
  }
}

export default Users;
```

现在，为了在不实际访问 API（ 从而创建缓慢而脆弱的测试 ）的情况下测试此方法，我们可以使用 `jest.mock()` 函数自动模拟 axios 模块。

一旦我们模拟了模块，我们可以提供一个 `mockResolvedValue`

```js
import axios from 'axios';
import Users from './users';

jest.mock('axios');

test('should fetch users', () => {
  const users = [{name: 'Bob'}];
  const resp = {data: users};
  axios.get.mockResolvedValue(resp);

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return Users.all().then(data => expect(data).toEqual(users));
});
```

### 模拟模块部分

