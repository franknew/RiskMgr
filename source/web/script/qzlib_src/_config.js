/**
 * 打包配置
 */
define(function(require, exports, module){

	return {
		all: {
			//目标文件名
			name: 'index.js',
			//是否生成对应文件
            versionControllKey: '@lib@',
            versionControll:['/version.js','/loader.js', '/meteorLoader.js'],
			//是否生成对应文件
			create: true
		},
		js: {
			name: '',
			//不生成单独js文件
			create: false
		},
		tmpl: {
			name: 'tmpl.js',
			//不生成单独tmpl文件
			create: false
		}

	};

});