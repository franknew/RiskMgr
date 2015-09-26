/**
 * router.js
 * 约定：hash规则 #!/{pageName}?param1=XXX&param2=YYY
 */
define(function (require, exports, module) {
    var $ = require('jquery'),
    	util = require('./util'),
        stat = require('./stat');

    var running = false,
        hasHashChangeEvent = 'onhashchange' in window,
        documentMode = document.documentMode,
        supportHashChange = hasHashChangeEvent && ( documentMode === void 0 || documentMode > 7 ),
        hasAddEventListener = 'addEventListener' in window,
        defaultPage, lastPage,
        basePath = (module.uri || module.id).match(/^[^\/]*\/\/[^\/]*/)[0] + location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1),
        splitTag = '&';


    var _oldURL, _newURL;

    /**
     * 启动路由
     * @param  {string} page 默认页面
     * @return {null}
     */
    exports.start = function (page) {
        if (!running) {
            if(!supportHashChange) {
            } else if (hasAddEventListener) {
                window.addEventListener('hashchange', hashChangeHandler, false);
            } else if (hasHashChangeEvent) {
                window.onhashchange = hashChangeHandler;
            }
            running = true;
            defaultPage = page;
            hashChangeHandler();
        }
    };
	
	/** 全局配置路由
	 * @param config
	 */
	exports.setting = function (config) {
		config = config || {};
		basePath = config.basePath || basePath;
        splitTag = config.splitTag || '&';
	};

    /**
     * 设置路径
     * @param path
     * @param type
     */
    exports.go = function(path, type) {
        if (!path) {return;}
        path = '#!/' + path;

        switch(type) {
            case 'replace':
                location.replace(path);
                //兼容不支持hashchange事件
                if(!supportHashChange) {
                    hashChangeHandler();
                }
                break;
            case 'popover':
                _newURL = location.href.split('#')[0] + path;
                hashChangeHandler();
                break;
            default :
                location.hash = path;
                //兼容不支持hashchange事件
                if(!supportHashChange) {
                    hashChangeHandler();
                }
        }
    };

    function hashChangeHandler(e) {
        //_newURL与_oldURL可以根据需要在手动调用该方法之前设置
        _newURL = _newURL || window.location.href;

        if (!running) return;
        var oldCtx = parseURL(_oldURL || e && e.oldURL);
        var newCtx = parseURL(_newURL);

        _oldURL = _newURL;
        _newURL = undefined;

        changePage(oldCtx, newCtx);
    }

    /**
     * 将URL解析成page和state
     * @param  {string} url 原始url地址
     * @return {object}    解析后的上下文，包括url、page、state三个属性
     */
    function parseURL(url) {
        url = url || '';
        var decode = window.decodeURIComponent;
        var hashIndex = url.indexOf('#!/'),
            hash = (hashIndex >= 0) ? url.slice(hashIndex + 3) : '';
        var searchIndex = hash.indexOf('?'),
            search = (searchIndex >= 0) ? hash.slice(searchIndex + 1) : '';
        var page = (searchIndex >= 0) ? hash.slice(0, searchIndex) : hash;

        var pairs = search.split(splitTag),
            state = {};
        for (var j = 0; j < pairs.length; j++) {
            var pair = pairs[j].replace(/\+/g, '%20'),
                i = pair.indexOf('='),
                key = ~i ? pair.slice(0, i) : pair,
                value = ~i ? pair.slice(i + 1) : '';
            try {
                key = decode(key);
                value = decode(value);
            } catch (e) {
                console.log(e);
            }
            
            state[key] = util.encodeHtml(value);
        }

        return {
            'url': url,
            'page': page,
            'state': state
        };
    }

    /**
     * 切换页面
     * @param {object} oldCtx  旧页面对象
     * @param {object} newCtx 新页面对象
     */
    function changePage(oldCtx, newCtx) {

        if (lastPage && oldCtx.page === newCtx.page) {//hash中同页面，不同参数模式
            lastPage.show(newCtx.state);
        } else if (newCtx.page === '') {//跳转到默认页面
            exports.go(defaultPage, 'replace');
        } else {
            var pathName = basePath + newCtx.page;
            seajs.use(pathName, function (newPage) {
                if (newPage) {
                    if (lastPage && lastPage.hide) lastPage.hide();

                    if (newPage.show) {
                        newPage.show(newCtx.state);
                        stat.reportPV('', pathName.replace('#!', '__').replace(splitTag, '_'));
                    }

                    lastPage = newPage;
                } else {
                    exports.go(defaultPage, 'replace');
                }
            });
        }
    }
});