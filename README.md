# 前端轻量级路由框架

> 该框架依赖art-template模版引擎，通过监听hashchange的方式实现SPA。
> 项目中可直接引用art-template与router.js的合并版本spa.min.js。

## 构造函数
> 提供Router构造器生成路由实例，Router方法接受四个参数：
- container: 模版容器id；
- cacheView: 模版是否缓存(Boolean)；
- beforeFn: 模版加载前回调函数(Function)；
- afterFn: 模版及数据加载完成回调函数(Function)；
```js
new Router({
    container: 'routerContainer',
    cacheView: true,
    beforeFn: function() {
        console.log('beforeFn');
    },
    afterFn: function() {
        console.log('afterFn');
    },
});
```
> Router对象上对外提供解析hash的方法Router.parseHash，改方法接收hash参数，返回path（路径）params（参数对象）。

## 原型方法
- when: 配置hash path对应的资源，该方法接受2个参数，路径和资源（接口数据和已有数据M、模版V、控制器C、样式）,前端资源按需加载，无阻塞动态添加js、css。
```js
when('/news', {
	view: 'xx2.html',
	data:{
		existData:{
			name: 'xiaoming',
			age:18
		}
	},
	apis: {
		newsInfo: {
			url: 'http://apis.baidu.com/txapi/tiyu/tiyu?num=10&page=1&word={word}',
			config: {
				apikey: 'b540b1460446d5d645629317c84b714b'
			}
		},
	},
	controllers: ['c1.js'],
	styles: ['s2.css'],
})
```
```html
<p>姓名：{{existData.name}}</p>
<p>年龄：{{existData.age}}</p>
{{each newsInfo.newslist as item}}
<a href="{{item.url}}" class="news">{{item.title}}</a>
{{/each}}
```
- otherwise: 默认路径，接受一个路径参数。
```js
otherwise('/text')
```
- run: 启动路由。
## 测试demo
```shell
npm i
gulp watch
```
