
## 重复设置

如果有一些操作要对许多测试重复执行，则可以使用 `beforeEach` 和 `afterEach` 挂钩。

```js
beforeEach(()=>{
	init() // 获取一些城市信息
})

afterEach(()=>{
	clear() // 测试后清理一些东西
})

test('test1',()=>{
	expect(isCity('Vienna')).toBeTruthy()
})

test('test1',()=>{
	expect(isCity('San Juan')).toBeTruthy()
})
```



`beforeEach` 并且可以处理异步代码

```js
beforeEach(()=>{
	return fetchData() // fetchData 返回的是一个 Promise，Jest 也可以处理 Promise
})
```

## 一次性设置

