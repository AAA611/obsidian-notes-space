
## 介绍

`npm install` 和 `npm ci` 都是用来安装项目依赖包的命令。但他们有一些重要的区别。

### 基本功能

- `npm install`：安装项目中声明的依赖包。他根据 `package.json` 中定义的依赖项下载并安装包，同时更新 `package-lock.json` 文件。
- `npm ci`：安装依赖包时严格遵循 `package-lock.json` 文件中的内容，而不是根据 `package.json` 中的版本范围进行安装，没有分析 `package.json` 这个步骤，所以更加快。如果项目中不存在 `package-lock.json` 或者 `npm-shrinkwrap.json` ，那么 `npm ci` 命令会直接报错。

### 主要区别

- **npm install**：
	- 如果 node_modules 文件夹不存在或者依赖包未安装，它会根据 package. json 的版本范围安装依赖并更新 package. lock. json
	- 如果依赖已存在，npm install 会检查 package. json 和 package. lock. json，并根据需要添加、删除、更新依赖，同时更新 package-lock. json
	- 可以安装项目中的所以依赖包，也可以单独安装某一个
- **npm ci**：
	- 如果 node_modules 已存在，会首先删除 node_modules 文件夹，然后完全根据 package-lock. json 重新安装依赖
	- 不会更新 package-lock. json
	- 适用于持续集成环境或者需要快速安装已锁定依赖的场景
	- 只能一次性安装项目中的所有依赖包