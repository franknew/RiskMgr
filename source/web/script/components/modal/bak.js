define(function(require, exports, module){
	require('./component.css');
	var $ = require('jquery'),
		tmpl = require('./tmpl'),
		class = require('risk/unit/class');
	
	var CONFIG = {};
	var MOD = {
		show:function(conf) {
			conf = conf || {};
			var modal = $(tmpl.modal(conf));
			$(document.body).append(modal);
			modal.addClass('md-show');
		},
		hide:function() {
		}
	};

	return MOD;
});