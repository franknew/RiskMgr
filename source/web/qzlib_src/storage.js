/**
 * @fileOverview 存储通用组件, 支持单独调用其中每一个容器, 也可以使用global方法自动选择容器
 * @requires jquery
 * @requires ./cookie
 */
define(function(require,exports,module){
    var $ = require('jquery'),
        cookie = require('./cookie');

    var storage = {};

    storage.cookie = cookie;

    storage.localStorage = {
        name: 'localStorage',
        isSupported: !!window.localStorage,
        init: function() {},
        set: function(key, val) {
            localStorage.setItem(key, val);
        },

        get: function(key) {
            return localStorage.getItem(key);
        },

        del: function(key) {
            localStorage.removeItem(key);
        },

        clear: function() {
            localStorage.clear();
        }
    };

    storage.globalStorage = {
        name: 'globalStorage',
        isSupported: !!window.globalStorage,
        db: null,
        init: function() {
            this.db = globalStorage[document.domain];
        },
        set: function(key, val) {
            try {
                this.db.setItem(key, val);
                return 1;
            } catch(e) {
                return 0;
            }
        },

        get: function(key) {
            var res;
            try {
                res = this.db.getItem(key);
                res = res && res.value || res;
            } catch(e) {}
            return res;
        },

        del: function(key) {
            try {
                this.db.removeItem(key);
            } catch(e) {}
        },

        clear: function() {
            try {
                for(var key in this.db) {
                    this.db.removeItem(key);
                }
            } catch(e) {}
        }
    };

    storage.userData = {
        name: 'userData',
        isSupported: !!window.ActiveXObject,
        db: null,
        _DB_NAME : 'MALLV8_LOCAL_STORAGE',
        init: function() {
            this.db = document.documentElement || document.body;
            this.db.addBehavior('#default#userdata');
            this.db.load(this._DB_NAME);
        },
        set: function(key, val) {
            var expires = this.db.expires.toString();
            if(expires !== '' && expires.indexOf('1983') !== -1) {//fix for clear
                this.db.expires = new Date(+new Date() + 365 * 86400000).toUTCString();
            }
            try {
                this.db.setAttribute(key, val);
                this.db.save(this._DB_NAME);
                return 1;
            } catch(e) {
                return 0;
            }
        },

        get: function(key) {
            this.db.load(this._DB_NAME);
            return this.db.getAttribute(key);
        },

        del: function(key) {
            this.db.removeAttribute(key);
            this.db.save(this._DB_NAME);
        },

        clear: function() {
            this.db.expires = new Date(417628800000).toUTCString();//Sun, 27 Mar 1983 16:00:00 GMT
            this.db.save(this._DB_NAME);
        }
    };

    storage._default = {
        name: '_default',
        isSupported: true,
        init: function(){},
        set: function(){},
        get: function(){},
        del: function(){},
        clear: function(){}
    };
    /**
     * 通用存储接口，按照支持优先顺序选择合适容器
     * @type {Object}
     */
    storage.global = {
        _priority: ['localStorage','globalStorage','userData','cookie','_default'],
        _inited: false,
        _db : null,
        _init: function(){
            for(var key in this._priority){
                var _key = this._priority[key];
                if(storage[_key].isSupported){
                    this._db = storage[_key];
                    this._db.init();
                    break;
                }
            }
            this._inited = true;
        },
        set: function(name, value) {
            if(!this._inited){
                this._init();
            }
            this._db.set(name,value, 'qq.com', '/',24*30);
        },
        get: function(key){
            if(!this._inited){
                this._init();
            }
            return this._db.get(key);
        },
        del: function(key){
            if(!this._inited){
                this._init();
            }
            this._db.del(key);
        },
        clear: function(){
            if(!this._inited){
                this._init();
            }
            this._db.clear();
        }
    };

    $.extend(storage, storage.global);

    return storage;
})