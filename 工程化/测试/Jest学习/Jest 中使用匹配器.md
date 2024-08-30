
## 常见匹配器

测试值最简单的方法是完全相等

```js
test('tow plus two is four',()=>{
	expect(2+2).toBe(4)
})
```

`toBe` 用于 `Object.is` 测试精确相等性。如果要检查对象值，请使用 `toEqual`：

```js
test('object assignment',()=>{
	const data={ one:1 }
	data['two'] = 2
	expect(data).toEqual({one:1,two:2})
})
```

`toEqual` 递归检查对象或数组。

## 匹配真假值

- `toBeNull`
- `toBeUndefined`
- `toBeDefined`
- `toBeTruthy`
- `toBeFalsy`

## 匹配数字

- `toBeGreaterThan`
- `toBeGreaterThanOrEqual`
- `toBeLessThan`
- `toBeLessThanOrEqual`
- `toEqual`
- `toBe`

## 匹配字符串

- `toMatch`

使用示例：

```js
// match
test('there is no I in team',()=>{
	expect('team').toMatch(/I/)
})

// not match
test('there is no I in team',()=>{
	expect('team').not.toMatch(/I/)
})
```

## 数组和可迭代对象

- `toContain`

```js
const shoppingList=[
	'diapers',  
	'kleenex',  
	'trash bags',  
	'paper towels',  
	'milk',
]

test('the shopping list has milk on it',()=>{
	// 数组
	expect(shoppingList).toContain('milk')
	// 集合
 	expect(new Set(shoppingList)).toContainer('milk')
})
```

## 其他

如果你想测试某个函数在调用时是否会引发错误，请使用 `toThrow`。

```js
function errorFunc(){
	throw new Error('error')
}

test('test',()=>{
	expect(()=>errorFunc()).toThrow()
	expect(() => compileAndroidCode()).toThrow(Error);
	
	// You can also use a string that must be contained in the error message or a regexp  
	expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');  
	expect(() => compileAndroidCode()).toThrow(/JDK/);

	// Or you can match an exact error message using a regexp like below  
	expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/); // Test fails  
	expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK!$/); // Test pass
})
```
