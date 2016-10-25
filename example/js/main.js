!(function() {
    // config router
    var router = new Router({
        container: 'routerContainer',
        cacheView: true,
        beforeFn: function() {
            console.log('beforeFn');
        },
        afterFn: function() {
            console.log('afterFn');
        },
    });
    router.when('/dream', {
        view: './view/xx1.html',
        apis: {
            dreamInfo: {
                url: 'http://apis.baidu.com/txapi/dream/dream?word={word}',
                config: {
                    apikey: 'b540b1460446d5d645629317c84b714b'
                }
            },
        },
        controllers: ['./js/c1.js'],
        styles: ['./css/s1.css'],
    }).when('/news', {
        view: './view/xx2.html',
        data: {
            existData: {
                name: 'xiaoming',
                age: 18
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
        controllers: ['./js/c2.js'],
        styles: ['./css/s2.css'],
    }).when('/text', {
        view: './view/xx3.html',
        styles: ['./css/s3.css'],
    }).otherwise('/text').run();


    // click bind
    searchAthleteBtn.onclick = function() {
        window.location.hash = '#/news?word=' + searchAthlete.value;
    }
    searchDearmBtn.onclick = function() {
        window.location.hash = '#/dream?word=' + searchDearm.value;
    }
})();