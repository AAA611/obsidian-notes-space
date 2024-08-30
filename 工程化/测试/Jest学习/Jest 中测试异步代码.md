
## 测试 Promise

```js
test('test',()=>{
	return fetchData().then(data=>{
		expect(data).toBe('peanut butter')
	})
})
```

## 测试 async/await

```js
test('test',async ()=>{
	const data=await fetchData()
	expect(data).toBe('peanut butter')
})
```

使用 `.resolves` 、`.rejects` 来测试异步：

```js
test('test',()=>{
	await expect(fetchData()).resolves.toBe('peanut butter')
})

test('test',()=>{
	await expect(fetchData()).rejects.toBe('error')
})
```

也可以使用 `.catch` 方法：

```js
test('the fetch fails with an error', () => {  
expect.assertions(1);  
	return fetchData().catch(error => expect(error).toMatch('error'));  
});
```

