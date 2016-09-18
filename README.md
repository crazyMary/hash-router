#hash router engine base on art-template
========================================
>参数配置：
-container：模块容器（id）
-cacheTmpl：是否缓存模版（Boolean）
>路径配置：
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
    })
