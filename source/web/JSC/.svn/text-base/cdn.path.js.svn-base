
/**
 * jsc：把模板转换成js，合并js
 * @author youkunhuang
 *
 */


var logger		= require('./logger')(__filename),
	config		= require('./config.js'),
	dependent	= require('./dependent.js'),
	fs			= require("fs"),
	path		= require('path'),
	cdnPathCache	= {},
	cdnPathIdCache	= {},
	undefined;


//读cdn-path文件id转换器 
this.readCdnPathId = function(file){
	
	if(cdnPathIdCache[file] === undefined){
		cdnPathIdCache[file] = this.readModule(file);
	}
	
	return cdnPathIdCache[file];
}

//读模块 
this.readModule = function(file){
	
	var str = null;
	
	try{
		str = require(file);
	}catch(e){
	}
	
	return str;
}

//取某个文件的cdn映射路径转换器
this.cdnPathId = function(file){
	
	var arr = [],
		res	= [],
		str,
		isFind = false,
		len,i,tmp,curr;
	
	file = path.normalize(file).replace(/\\/g,'/');
	
	arr = file.split('/');
	
	i = arr.length;
	
	while(i-- > 1){
		curr = arr.slice(0,i);
		curr.push('cdn-path-id.js');
		tmp = curr.join('/');
		str = this.readCdnPathId(tmp);
		
		if(str === ''){
			break;
		}
		
		if(str !== null){
			isFind = true;
			break;
		}
	}
	
	if(isFind === false){
		return null;
	}
	
	return str;
}








//读cdn-path文件 
this.readCdnPath = function(file){
	
	if(cdnPathCache[file] === undefined){
		cdnPathCache[file] = this.readFile(file);
	}
	
	return cdnPathCache[file];
}



//读普通文件 
this.readFile = function(file){
	
	var str = null;
	
	try{
		str = fs.readFileSync(file,'UTF-8');
	}catch(e){
	}
	
	if(str){
		//去除utf-8文件头的BOM标记
		//str = str.replace(/[\ufeff\ufffe]/g,'');
		//str = str.replace(/\r\n|\r|\n/g,"\r\n");
	};
	
	return str;
}

//取某个文件的cdn映射路径
this.cdnPath = function(file){
	
	var arr = [],
		res	= [],
		str,
		isFind = false,
		len,i,tmp,curr;
	
	file = path.normalize(file).replace(/\\/g,'/');
	
	arr = file.split('/');
	
	i = arr.length;
	
	while(i-- > 1){
		curr = arr.slice(0,i);
		curr.push('cdn-path.txt');
		tmp = curr.join('/');
		str = this.readCdnPath(tmp);
		
		if(str === ''){
			break;
		}
		
		if(str !== null){
			isFind = true;
			break;
		}
	}
	
	if(isFind === false){
		return null;
	}
	
	res = arr.slice(i);
	
	res = path.normalize(str + '/' +res.join('/')).replace(/\\/g,'/');
	
	return res;
}

this.modify = function(file){
	
	var that	= this,
		text,
		res,
		cid,
		cpath;
	
	setTimeout(function(){
		
		var dependentArr = [];
		var done = false;
		
		cpath	= that.cdnPath(file);
		
		cid		= that.cdnPathId(file);
		
		if(typeof cid === 'function'){
			cpath = cid(cpath);
		}
		
		if(!cpath) return;
		
		text = that.readFile(file);
		
		if(text.indexOf('define.pack(') === -1){
			dependentArr = dependent.getDependent(text);
		}
		
		if (!done) {
			res = text.replace(/\bdefine\((?:[^\[\]]+,)??(null,)\b/gmi, function($0, dep){
				done = true;
				return 'define\x28' + JSON.stringify(cpath.replace(/\.js$/, '')) + ',' + ((JSON.stringify(dependentArr) + ','));
			});
		}
		
		if (!done) {
			res = res.replace(/\bdefine\((?:[^\[\]]+,)??(\[[^\[\]]*?\],)??\b/gmi,function($0,dep){
				done = true;
				return 'define\x28' + JSON.stringify(cpath.replace(/\.js$/,'')) + ',' + (dep || (JSON.stringify(dependentArr) + ','));
			});
		}
		
		if(text.indexOf('define.pack(') === -1){
			res = res.replace(/\bdefine\(.*?\bfunction\b/gmi,function($0,dep){
				return 'define\x28' + JSON.stringify(cpath.replace(/\.js$/,'')) + ',' + ((JSON.stringify(dependentArr) + ',function') || dep);
			});
		}
		
		//去除utf-8文件头的BOM标记+windows换行
		res = res.replace(/[\ufeff\ufffe]/g,'');
		res = res.replace(/\r\n|\r|\n/g,"\r\n");
		
		if(res !== text){
			fs.writeFileSync(file,res,'UTF-8');
			logger.info('modify: ${file}',{
				file: file
			});
		}
	},0);
}


this.parseFile = function(){
	
}
