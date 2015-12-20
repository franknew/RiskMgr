/**
 * 打包配置默认选项
 */
define(function(require, exports, module){

	return {
		
		dir: './',					//重新指定合并后文件的存放目录,
		uglify: false,				//开启代码压缩
		
		all: {
			name: 'index.js',		//重新指定合并后的文件名
			create: true,			//生成
            versionControllKey:'@mainjs@', //同时生成一份同名+md5值的文件，示例中的 @mainjs@ 为改文件的key，最好选择不常用字符
            versionControll:['../../index.html'] //引用了该文件的文件路径。相对路径
		},
		
		js: {
			name: 'js.js',			//重新指定合并后的文件名
			create: false,			//不生成
			sort: function(arr){	//自定义排序
				return arr;
			},
            versionControllKey:'@mainjs@', //同时生成一份同名+md5值的文件，示例中的 @mainjs@ 为改文件的key，最好选择不常用字符
            versionControll:['../../index.html'] //引用了该文件的文件路径。相对路径
		},
		
		tmpl: {
			name: 'tmpl.js',		//重新指定合并后的文件名
			create: false,			//不生成
            versionControllKey:'@mainjs@', //同时生成一份同名+md5值的文件，示例中的 @mainjs@ 为改文件的key，最好选择不常用字符
            versionControll:['../../index.html'] //引用了该文件的文件路径。相对路径
		}
		
	};
	
});