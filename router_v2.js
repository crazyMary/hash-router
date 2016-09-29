/**
 * [hash router engine based on art-template]
 * @param  {[type]} window   
 * @param  {[type]} template 
 * @return {[type]} Router  
 */
!(function(window, template) {
    var bindEvent,
        isFunction,
        deepCopy,
        fetchData,
        removeResource,
        self,
        Router;

    deepCopy = function(source) {
        var ret = {};
        for (var key in source) {
            ret[key] = typeof source[key] === 'object' ? arguments.callee(source[key]) : source[key];
        }
        return ret;
    };
    // 是否为function
    isFunction = function(func) {
        return ({}).toString.call(func) === "[object Function]" ? true : false;
    };
    // 事件绑定
    bindEvent = (function() {
        if (window.addEventListener) {
            return function(obj, ev, fn) {
                obj.addEventListener(ev, fn, false);
            }
        } else {
            return function(obj, ev, fn) {
                obj.attachEvent('on' + ev, function() {
                    fn.call(obj);
                })
            }
        }
    })();

    // ajax获取数据
    fetchData = function(api, doneCb) {
        var xhr = new XMLHttpRequest;
        xhr.onload = function() {
            doneCb && doneCb(this.response);
        }
        xhr.open('GET', api['url'], true);
        for (var name in api.config) {
            xhr.setRequestHeader(name, api['config'][name]);
        }
        xhr.send();
    };
    removeResource = function(resourceList, pNode) {
            var i = 0,
                r;
            for (; r = resourceList[i++];) {
                pNode.removeChild(document.getElementById(r))
            }
        }
        // Router constructor
    Router = function(config) {
        self = this;
        self.cacheView = config.cacheView || false; //是否缓存模版
        self.container = document.getElementById(config.container);
        if (config.beforeFn) {
            self.beforeFn = isFunction(config.beforeFn) ? config.beforeFn : console.error('beforeFn is not function');
        }
        if (config.afterFn) {
            self.afterFn = isFunction(config.afterFn) ? config.afterFn : console.error('afterFn is not function')
        }
        self.configObj = {};
        self.path = '';
    }
    Router.prototype.when = function(path, config) {
        self.configObj[path] = config;
        return self;
    }
    Router.prototype.otherwise = function(hash) {
        if (typeof hash === 'string' && hash !== '') {
            self.defaultHash = hash;
        } else {
            throw new Error('defaultHash should be string')
        }
        return self;
    }
    Router.prototype.run = function() {
        bindEvent(window, 'hashchange', function() {
            startRouter();
        });
        startRouter();
    }

    function startRouter() {
        var path = Router.parseHash(location.hash).path;
        if (!(path in self.configObj) && self.defaultHash !== '') {
            location.hash = '#' + self.defaultHash;
        } else {
            self.beforeFn && self.beforeFn();
            loadModel(self.configObj[path]);
        }
    }

    function loadModel(config) {
        // 未配置apis && data 
        if (config.apis === undefined && config.data === undefined) {
            loadView(config, {});
        }
        // 只配置data
        if (config.apis === undefined && config.data !== undefined) {
            loadView(config, config.data);
        }
        // 配置了apis
        if (config.apis !== undefined) {
            var initData = deepCopy(config.data),
                originApis = deepCopy(config.apis),
                count = 0,
                len = 0,
                paramObj = Router.parseHash(location.hash).params,
                api = {};
            for (var name in config.apis) {
                len++;
                (function(name) {
                    api = originApis[name];
                    for (var param in paramObj) {
                        api['url'] = originApis[name]['url'].replace('{' + param + '}', paramObj[param]);
                    }
                    fetchData(api, function(res) {
                        initData[name] = JSON.parse(res);
                        ++count === len && loadView(config, initData);
                    })
                })(name);
            }
        }
    }

    function loadView(config, initData) {
        var xhr = new XMLHttpRequest;
        xhr.onload = function() {
            // render view
            var render = template.compile(this.response),
                view = render(initData);
            self.container.innerHTML = view;
            // 执行渲染完成回调afterFn
            self.afterFn && self.afterFn();
            // 加载样式和控制器
            loadController(config.controllers || []);
            loadStyle(config.styles || []);
        }
        xhr.open('GET', config.view, true);
        xhr.send();
    }

    var loadStyle = (function() {
        var sJson = [];
        return function(styles) {
            var i = 0,
                s;
            removeResource(sJson, document.head)
            sJson = [];
            for (; s = styles[i++];) {
                link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = s;
                link.id = s;
                document.head.appendChild(link);
                sJson.push(s);
            }
        }
    })();

    var loadController = (function() {
        var cJson = [];
        return function(controllers) {
            var i = 0,
                c;
            removeResource(cJson, document.body);
            cJson = [];
            for (; c = controllers[i++];) {
                var s = document.createElement('script');
                s.src = c;
                s.id = c;
                document.body.appendChild(s);
                cJson.push(c);
            }
        }
    })();

    // 解析hash
    Router.parseHash = function(hash) {
        return {
            path: hash.split('?').shift().substr(1),
            params: (function() {
                var ret = {},
                    aParams = [];
                if (hash.split('?').length === 1) {
                    return ret;
                } else {
                    aParams = hash.split('?').pop().split('&');
                    for (var i = 0; i < aParams.length; i++) {
                        ret[aParams[i].split('=').shift()] = aParams[i].split('=').pop();
                    };
                    return ret;
                }
            })()
        }
    };

    window.Router = Router;
})(window, template)