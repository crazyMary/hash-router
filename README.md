#hash router engine base on art-template
========================================
##参数配置：
container：模块容器（id）
cacheTmpl：是否缓存模版（Boolean）
beforeFn: 模版加载前方法回调(function),
afterFn: 模版加载完成方法回调(function)
##路径配置：
        router.when('/a/:size:more', {
                view: 't1.html',
                data: {
                    data1: {
                        name: 'liuxiang',
                        age: 18
                    }
                },
                apis: {
                    api1: 'http://api.1-blog.com/biz/bizserver/news/list.do?max_behot_time=&size={size}',
                    api2: 'http://api.1-blog.com/biz/bizserver/weather/list.do?more={more}',
                },
                controllers: ['c1.js'],
                styles: ['s1.css'],
            }).when('/b', {
                view: 't2.html',
                apis: {
                    api1: 'http://api.1-blog.com/biz/bizserver/news/list.do?max_behot_time=&size=20',
                    api2: 'http://api.1-blog.com/biz/bizserver/weather/list.do?more=2',
                },
                controllers: ['c2.js','c3.js'],
                styles: ['s2.css','s3.css'],
                done:function(){
                    alert('t2 loaded')
                }
            }).when('/c', {
                view: 't3.html',
                data: {
                    data1: {
                        name: 'liuxiang',
                        age: 18
                    }
                },
                controllers: ['c4.js'],
            }).otherwise('/a/:20:1').run()
### when方法@param1:hash路径（:参数）
### when方法@param2:路径资源配置:  
 -view:视图模版  
 
 -data:全局数据  
 
 -apis:当前模版初始化请求的数据资源
 
 -controllers:js控制器
 
 -styles:css样式
 
 -done:加载成功回调
 
### otherwise配置默认路径
### run启动路由
 
