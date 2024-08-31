
## __esModule 的作用

假设有一个 CJS 模块如下：

```js
// CJS mod.js  
function foo () {}  
function bar () {}  
module.exports = foo  
module.exports.bar = bar // foo.bar === bar
```

接下来在 ESM 模块使用它：

```js
// ESM index.js  
import { bar } from './mod.js'  
import foo from './mod.js'  // 这里无法知道 mod.js 是什么规范的模块
  
console.log(bar)  
console.log(foo)  
console.log(foo())
```

`import foo from './mod.js'` 这个语句中无法知道 `mod.js` 是 CJS 还是 ESM。这有很大区别：

如果 `mod.js` 是 CJS，那么 foo 应该对应的是这个模块的 `exports`
如果 `mod.js` 是 ESM，那么 foo 应该对应的是模块的默认导出，也就是 `export default ...`

所以引入标识 `__esModule` 标识，如果一个模块是 ESM 的话，模块信息中含有 `esModule:true`，如果不是则没有，那么在使用的时候就可以通过 `esModule` 标识来正确对应了。

## webpack 中一些相关源码

```js
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
*/

"use strict";

const RuntimeGlobals = require("../RuntimeGlobals");
const Template = require("../Template");
const HelperRuntimeModule = require("./HelperRuntimeModule");

/** @typedef {import("../Compilation")} Compilation */

class CompatGetDefaultExportRuntimeModule extends HelperRuntimeModule {
	constructor() {
		super("compat get default export");
	}

	/**
	 * @returns {string | null} runtime code
	 */
	generate() {
		const compilation = /** @type {Compilation} */ (this.compilation);
		const { runtimeTemplate } = compilation;
		const fn = RuntimeGlobals.compatGetDefaultExport;
		return Template.asString([
			"// getDefaultExport function for compatibility with non-harmony modules",
			`${fn} = ${runtimeTemplate.basicFunction("module", [
				"var getter = module && module.__esModule ?",
				Template.indent([
					`${runtimeTemplate.returningFunction("module['default']")} :`,
					`${runtimeTemplate.returningFunction("module")};`
				]),
				`${RuntimeGlobals.definePropertyGetters}(getter, { a: getter });`,
				"return getter;"
			])};`
		]);
	}
}

module.exports = CompatGetDefaultExportRuntimeModule;

```
## 参考

[\_\_esModule 的作用 | Toyo](https://toyobayashi.github.io/2020/06/29/ESModule/)