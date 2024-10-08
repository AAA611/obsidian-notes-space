
## 区别总结

CommonJS（以下简称 CJS） 与 ESM 主要有以下几点区别：

- 加载时机
	- CJS：同步加载，模块在运行时加载，更加灵活
	- ESM：静态加载，依赖关系不运行代码就可以分析出来
- 语法不同
	- CJS：module. exports、exports、require
	- ESM：import、export
- 代码执行顺序
	- CJS：遇到 require 加载某个模块，则进入模块中执行，执行完之后再回来继续执行 require 的下一行代码
	- ESM：深度优先的顺序执行，限制性处于依赖关系的底层的模块代码，这样底层的代码运行完、变量初始化好了就可以被上层引入的模块使用了。
- 导入导出原理
	- CJS：基于拷贝的导入、导出。基础类型时拷贝，引用类型是拷贝引用地址
	- ESM：导入导出共享同一块内存，内存中数据在代码运行后被填充
- 静态分析
	- CJS：CJS 基于运行时，无法进行静态分析
	- ESM：可以进行静态分析，利用这一点特性可以做代码的静态分析优化如 [[Tree-Shaking]]
- 全局共享
	- CJS：每个模块都有自己的作用域，不会污染全局作用域
	- ESM：模式默认是严格模式，变量不会污染全局作用域，模块内部的变量不会被提升。