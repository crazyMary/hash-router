!(function(window, template) {
    var aTmpl = template,
        win = window,
        $;
    var Router = function(config) {
        $ = this;
        $.defaultHash = '';
        $.apis = {};
        $.routerConfig = {};
        $.cacheTmpl = config.cacheTmpl || false; //是否缓存模版
        $.container = document.getElementById(config.container);
    };
    // config router
    Router.prototype.when = function(hash, config) {
        var hashSplit = hash.split(':'),
            hash = hashSplit.shift();
        config.paramNames = hashSplit; //get paramsName
        $.routerConfig[hash] = config;
        return $;
    };
    // default router
    Router.prototype.otherwise = function(defaultHash) {
        if (typeof defaultHash === 'string' && defaultHash !== '') {
            $.defaultHash = defaultHash;
        } else {
            throw new Error('defaultHash should be string')
        }
        return $;
    };
    // run router
    Router.prototype.run = function() {
        $.router();
        bind(win, 'hashchange', function() {
            $.router();
        });

    };
    // direct router
    Router.prototype.router = function() {
        var hashSplit = Router.parseURL(location.href).hash.split(':'),
            hash = hashSplit.shift();
        if (!(hash in $.routerConfig) && $.defaultHash !== '') {
            location.hash = '#' + $.defaultHash;
        } else {
            $.routerConfig[hash].params = {};
            for (var i = 0, len = hashSplit.length; i < len; i++) {
                var hashConfig = $.routerConfig[hash],
                    paraName = hashConfig.paramNames[i];
                hashConfig.params[paraName] = hashSplit[i];
            };
            $.hashParams = $.routerConfig[hash].params; //expose current hash params
            $.loadData($.routerConfig[hash]);
        }
    };
    // prepare model
    Router.prototype.loadData = function(tmplConfig) {
        // apis && data 未配置
        if (tmplConfig.apis === undefined && tmplConfig.data === undefined) {
            $.loadTemplate(tmplConfig, {});
        }
        // 只配置data
        if (tmplConfig.apis === undefined && tmplConfig.data !== undefined) {
            $.loadTemplate(tmplConfig, tmplConfig.data);
        }
        // 未配置apis
        if (tmplConfig.apis !== undefined) {
            $.apis = tmplConfig.apis;
            var results = tmplConfig.data || {},
                count = 0,
                len = 0;
            for (var name in $.apis) {
                len++;
                (function(name) {
                    for (var pName in tmplConfig.params) {
                        $.apis[name] = $.apis[name].replace('{' + pName + '}', tmplConfig.params[pName])
                    }
                    ajax($.apis[name], function(res) {
                        results[name] = JSON.parse(res);
                        ++count === len && $.loadTemplate(tmplConfig, results);
                    })
                })(name);
            }
        }
    };
    // prepare view
    Router.prototype.loadTemplate = function(tmplConfig, results) {
        $.view = tmplConfig.view;
        ajax($.view, $.cacheTmpl, function(tmpl) {
            var render = aTmpl.compile(tmpl),
                html = render(results);
            $.container.innerHTML = html;
            $.loadController(tmplConfig.controllers || []);
            $.loadStyle(tmplConfig.styles || []);
            isFunction(tmplConfig.done) && tmplConfig.done();
        })
    };
    // prepare skin
    Router.prototype.loadStyle = (function() {
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
    // prepare conreoller
    Router.prototype.loadController = (function() {
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
    })()

    Router.parseURL = function(url) {
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function() {
                var ret = {},
                    seg = a.search.replace(/^\?/, '').split('&'),
                    len = seg.length,
                    i = 0,
                    s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
    };

    var ajax = (function() {
        var tempCaches = {};
        return function() {
            var args = arguments,
                url = arguments[0],
                isCached, doneCb;
            if (typeof arguments[1] === 'boolean') {
                isCached = arguments[1];
                doneCb = arguments[2];
            } else {
                doneCb = arguments[1];
            }

            if (isCached && (url in tempCaches)) {
                return doneCb(tempCaches[url]);
            }
            var xhr = new XMLHttpRequest;
            xhr.onload = function() {
                doneCb && doneCb(this.response);
                !!isCached && (tempCaches[url] = this.response);
            }
            xhr.open('GET', url, true);
            xhr.send();
        }
    })();

    var removeResource = function(resourceList, pNode) {
        var i = 0,
            r;
        for (; r = resourceList[i++];) {
            pNode.removeChild(document.getElementById(r))
        }
    }

    var isFunction = function(func) {
        return ({}).toString.call(func) === "[object Function]" ? true : false;
    }

    var bind = (function() {
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

    win.Router = Router;
})(window, template)