
## 区别

### 兼容性

Object. defineProperty 相比于 Proxy 有更好的兼容性

参考：["Proxy" | Can I use... Support tables for HTML5, CSS3, etc](https://caniuse.com/?search=Proxy)

**Proxy**

![[image-20240806155539257.png]]

**Object. defineProperty**

![[image-20240806155652411.png]]

### 功能

1. Proxy 可以拦截更多操作，不限于 set、get
2. Proxy 可以拦截对数组的操作

### 性能差异

**Proxy的性能通常较Object.defineProperty要慢。**

这是因为Proxy代理了整个对象，每个对属性的访问都需要经过代理的拦截器。这会导致Proxy的操作相对较慢，特别是在频繁访问属性的情况下。

相比之下，Object.defineProperty仅拦截单个属性的读取和赋值操作，不会对整个对象进行代理。因此，在性能方面，Object.defineProperty通常比Proxy更高效。

然而，**性能差异在实际应用中可能并不明显**，并且会受到具体的应用场景和浏览器的影响。对于大多数情况，性能差异不是决定使用哪个的主要因素。相反，功能需求和兼容性更可能影响选择Proxy或Object.defineProperty。


## 总结

|方面|Proxy|Object.defineProperty|
|---|---|---|
|语法|使用 `new Proxy(target, handler)` 创建代理对象|直接在对象上使用 `Object.defineProperty(obj, prop, descriptor)`|
|监听属性变化|支持监听整个对象的变化，通过 `get` 和 `set` 方法拦截|只能监听单个属性的变化，通过 `get` 和 `set` 方法拦截|
|功能拦截|可以拦截并重写多种操作，如 `get`、`set`、`deleteProperty` 等|只能拦截属性的读取和赋值操作|
|可迭代性|支持迭代器，可以使用 `for...of`、`Array.from()` 等进行迭代|不支持迭代器，无法直接进行迭代操作|
|兼容性|部分浏览器不支持，如 IE|相对较好的兼容性，支持大多数现代浏览器|
|性能|相对较低，因为每次操作都需要经过代理|相对较高，因为直接在对象上进行操作|
|扩展性|可以通过添加自定义的 handler 方法进行扩展|不支持扩展，只能使用内置的 `get` 和 `set` 方法拦截|



