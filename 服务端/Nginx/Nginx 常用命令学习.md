```shell
nginx -s stop      快速关闭 快速关闭Nginx，可能不保存相关信息，并迅速终止web服务。
nginx -s quit      平稳关闭  平稳关闭Nginx，保存相关信息，有安排的结束web服务。
nginx -s reload    重新加载  因改变了Nginx相关配置，需要重新加载配置而重载。
nginx -s reopen    重新打开日志  重新打开日志文件。
nginx -c filename  指定配置文件  为 Nginx 指定一个配置文件，来代替缺省的。
nginx -t           测试配置文件的合法性 不运行，仅仅测试配置文件。nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件。
nginx -v           显示版本号 显示 nginx 的版本。
nginx -V           显示版本号和其他信息  显示 nginx 的版本，编译器版本和配置参数。
```