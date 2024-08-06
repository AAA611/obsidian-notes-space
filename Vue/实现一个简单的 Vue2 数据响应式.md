## 实现

代码如下：

```js
const data = {
  name: 'zs',
  age: 17,
  books: {
    a: 1,
    b: 2
  }
}

const _toString = Object.prototype.toString
const isObject = (v) => _toString.call(v) === '[object Object]'

const reactive = (data) => {
  if (isObject(data)) {
    const keys = Object.keys(data)
    keys.forEach(key => {
      let val = data[key] // ⭐ 这里的一个变量的定义是核心,一定要注意。
      if (isObject(val)) {
        reactive(val)
      } else {
        Object.defineProperty(data, key, {
          get() {
            console.log('get');
            return val // 返回的是上面定义的变量
          },
          set(newVal) {
            val = newVal // 改变的是上面定义的那个变量，否则会无限递归调用
          }
        })
      }
    })
  }
}

reactive(data)
console.log(data.name);
console.log(data.books.a);
data.name = 3
console.log(data.books.b);
```