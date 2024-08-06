
## 插件背景

### 项目的权限设计

项目的权限类型有下面几种：
- PAGE（页面）：页面权限
- API（接口）：接口权限，接口权限是挂载 PAGE 下面的
- BUTTON（按钮）按钮权限

当一个角色拥有一个 PAGE 的权限之后，就会拥有这个 PAGE 下面的所有的 API 权限。同一个 API 可能在多个页面使用，在配置权限资源的时候可能需要配置多次。并且项目较大，接口的使用比较多，所以手动配置权限资源你消耗时间且容易出错。

## 插件介绍

本插件是一个 Webpack 插件。功能是用于分析页面 PAGE 与 API 接口权限的依赖关系（通常是一个页面对应多个 API 权限资源）。

### 插件实现要点

1、使用 compiler. hooks. compilation. tap
2、使用 compilation. hooks. finishModules. tap
3、使用 module. parser. hooks. program. tap （需要手动调一下 parse 来触发 program hook）
4、各个 module 的过滤操作
- apiModules：resource 路径中有 /api/ 且 dependencies 中的模块的依赖带有 requestModule. resource，就是说这个模块还必须引入了项目中统一封装的请求方法
- routeModules：resource 路径中带有 /router/ （文件扩展名需要是 .js） 且模块的动态依赖模块中 resource 带有 /pages/ （文件扩展名需要是 .vue）
- pageModules：pageModules 是从 routeModules 中获取的，routeModules 中的动态依赖 block. dependencies 中的模块 resource 含有 /pages/ （文件扩展名是 .vue）
- 提取路由信息，通过 routeModule. parser. hooks. program 可以分析模块的 AST 信息，使用 @babel/traverse 库来配合分析得到路由 name 和导入信息 moduleRawImportString。添加到 routesInfo 中。需要注意的是这个操作是在 compilation. hooks. finishedModules 中的，这样写无法触发 program hook。因为 program hook 是在这个阶段之前触发的。我们可以手动调用 parse 方法来实现 program 的触发 ：
	```js
	routeModule.parser.parse(routeModule._source.source(), {
   current: routeModule,
   module: routeModule,
   compilation: compilation,
   options: routeModule.parser.options
 });
	```
- 遍历 pageModules 并对其和其依赖进行递归查找，查找是否有 apiModule 的引入
- 匹配被依赖的 apiFn（用于接口请求的函数）的魔法注释信息。实现这一步的重要步骤是获取某个 apiFn 的函数源代码，然后根据源代码信息使用正则表达式来匹配魔法注释中的信息。如何获取某一个 apiFn 的源代码呢 ？答案是根据 loc. start 、loc. end

### 亮点与难点

亮点：

1、插件逻辑相对比较复杂，项目较大。
2、使用了 webpack 插件的一些 hook，也使用了 traverse 来处理 AST 信息。
3、使用正则匹配魔法注释

难点：

1、难点 1：在 compilation. hooks. finishedModules 中无法触发 parser. hooks （也包括插件中使用的 parser. hooks. program hook）
解决：通过简单查看 webpack 源码找到 hooks. program. call 的调用位置，然后发现使用 parser.parse 可以触发 program hook。（我认为这个也可以直接使用@babel/parser 来根据模块的源码 source 生成 AST，然后分析）

2、难点 2：递归的查找，递归查找 pageModule 中对 apiModule 的依赖信息，vue-loader 的编译结果的过滤。

2、难点 3：获取某个 apiFn 的源码，如何定位某个 apiFn 在其模块源码中的位置

解决：使用 loc. start、loc. end （TODO）

### 做了哪些优化？

1、由于项目较大，模块非常多，通过调试发现，需要分析的模块多达 3w 多个，所以在从列表接口中进行信息查找的时候可以使用 hashMap 来优化（时间换空间）。

2、尝试过.....，最终失败也没关系，最重要的是过程（TODO）

## 这个插件达成的效果

通过这个插件可以自动脚本分析 PAGE 资源=> API 资源的依赖关系。很大程度改善了体验。

具体效果如下：
- 分析过程通过 webpack 插件自动化，降低了开发人员在配置资源上的时间消耗
- 代码分析比人工分析更加高效、可靠，人工配置可能存在遗漏，错乱等。
- 通过在项目中加入权限配置页面（权限配置页面也要打包到生产吗？怎么优化？），可以实现跑一次脚本，多人使用
- 提供了一个兜底方案，插件可以根据最新代码全面分析项目的依赖关系，假如某个环境的资源错乱了或者丢失了，可以很快通过插件来分析出来并添加。这也适用于项目进行大规模重构时，资源改动较多的情况。




