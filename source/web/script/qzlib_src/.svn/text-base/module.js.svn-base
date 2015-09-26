/**
 * @fileOverview 全局defer管理 迁移自pengyou网代码
 * @requires jQuery
 */
define(function(require, exports, module){
	var $ = require('jquery');
    /**
     * 自定义模块工厂
     * @author youkunhuang
     * @requires jQuery
     * @exports module
     * @param {String} key
     * @return {deferManager} deferManager对象
     */
	var MOD = function(){

		var module = {};

		function deferFactory(){
			this._defer = {};
		}

        /**
         * Deferred工厂
         * @method module().defer
         * @return {Deferred} $.Deferred对象
         */
		deferFactory.prototype.defer = function(key){
			key && !this._defer[key] && (this._defer[key] = $.Deferred());

			return key ? this._defer[key] : this._defer;
		};

		return function(key){
			key && !module[key] && (module[key] = new deferFactory());

			return key ? module[key] : module;
		};

	}();

	return MOD;
});
