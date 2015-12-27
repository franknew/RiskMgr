//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/string","risk/data-dictionary"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	    name = name.replace(/\.r[0-9]{15}/,"");
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//former/src/index.js

//js file list:
//former/src/index.js
/**
 * 表单生成器
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-19 16:49:41
 */

define.pack("./index",["jquery","risk/unit/string","risk/data-dictionary"],function(require, exports, module){
	var $ = require('jquery'),
		RString = require('risk/unit/string');

	var SelectData = require('risk/data-dictionary');

	var GROUP_CACHE = {};

	var MOD = {
		_CONFIG:{
			groupCanAdd:true,
			onlyRequired:false
		},
		/**
		 * @param tpl 表单模板
		 * @param conf 配置项：
		 *     data: 表单的数据
		 *     disabled: 是否全局禁用表单
		 *     [onlyRequired=false] 只输出必填项
		 *     [groupCanAdd=true] group类型是否显示添加按钮
		 *     [tplFilter] {Function} 重新修饰模板数据，必须要返回新的模板数据，返回false的话就不渲染这条
		 */
		make:function(tpl,conf) {
			conf = $.extend({},MOD._CONFIG,conf);

			var rs = ['<div class="form-horizontal">','','</div>'],
				group = [];

			var i=0,cur,cont='';
			for(;cur=tpl[i++];) {
				cont = this._makeForm(cur,conf);
				if (cont) {	//因为onlyRequired功能，防止生成空div
					cont = '<div class="form-group">'+cont+'</div>';
					group.push(cont);
				}
			}

			rs[1] = group.join('');
			rs = rs.join('');

			return rs;
		},
		//生成group整体
		_makeGroup:function(groupList,groupInfo,conf) {
			var rs = '';
			var groupName = groupInfo.name,
				groupData = conf&&conf.data&&conf.data[groupName];

			//有数据时，以数据为模板循环生成多个group
			//没数据时，默认生成一个group
			if (groupData && groupData.length>0) {
				rs = [];
				var i=0,len=groupData.length,
					curData,curRS,
					transConf = $.extend({},conf);

				for(;curData=groupData[i++];) {
					transConf.data = curData;

					if (conf.groupCanAdd) {
						if (i>=len) {
							transConf.groupCanAdd = true;
						}else{
							transConf.groupCanAdd = false;
						}
					}

					curRS = this._makeGroupItem(groupList,groupInfo,transConf);
					rs.push(curRS);
				}

				rs = rs.join('');
			}else{
				rs = this._makeGroupItem(groupList,groupInfo,conf);
			}

			return rs;
		},
		//生产单组group
		_makeGroupItem:function(groupList,groupInfo,conf) {
			groupInfo = groupInfo || {};
			conf = conf || {};

			GROUP_CACHE[groupInfo.name] = groupInfo;	//缓存起来，新增事件会去取。先这样吧

			var groupName = groupInfo.name;

			var rs = ['<div class="panel panel-default clearfix" style="border-color:#EFEFEF;" data-group-box="'+groupName+'">','','</div>'],
				group = [];

			var i=0,cur,cont='';
			for(;cur=groupList[i++];) {
				cont = this._makeForm(cur,conf,groupName);
				if (cont) {	//因为onlyRequired功能，防止生成空div
					cont = '<div class="col-sm-12" style="padding:5px 0;">'+cont+'</div>';
					group.push(cont);
				}
			}

			rs[1] = (group.join(''));

			if (groupInfo.addText && conf.groupCanAdd) {
				rs.push('<div class="col-sm-12 text-center"><button class="btn btn-default btn-sm" style="padding:4px 35px;" data-hook="former-group-add" data-group-name="'+groupName+'"><i class="fa fa-plus"></i>'+groupInfo.addText+'</button></div>');
			}
			rs = rs.join('');

			return rs;
		},
		/**
		 * @param groupName 传了的话就表示是一个group
		 */
		_makeForm:function(formItems,conf,groupName) {
			var items = [],
				data = conf.data,
				disabled = conf.disabled;

			var tplFilter = conf&&conf.tplFilter;
			var i=0,cur,item;
			for(;cur=formItems[i++];) {
				if (tplFilter) {
					cur = tplFilter($.extend({},cur));
					if (cur==false) {
						continue;
					}else if (!cur) {
						throw "tplFilter返回错误信息："+cur;
					}
				}

				if (conf.onlyRequired && !cur.required && cur.type!='hidden') {	//onlyRequired仅仅是展示上的需求，而hidden的一般都是ID类型，所以hidden需要输出
					continue;
				}

				if (cur.type=='group') {
					items.push(this._makeGroup(cur.groups,cur,conf));

					this._initGroupEvent();
					continue;
				}

				item = '<div class="col-sm-'+(cur.col||12)+' '+(cur.colClass||'')+'">';
				item += this._item(cur,data && data[cur.name],conf,groupName);
				item += '</div>';

				items.push(item);
			}

			items = items.join('');

			return items;
		},
		_item:function(item,defaultValue,conf,groupName) {
			var rs = '',
				type = item.type,
				disabled = type=='hidden'?false:(('disabled' in item)?item.disabled:conf.disabled),
				attr = $.extend({},item,{
					col:undefined,	//过滤
					html:undefined,
					suffix:undefined,
					prefix:undefined,
					attr:undefined
				},{	//合并自定义属性
					name:item.name,
					placeholder:item.placeholder,
					required:item.required,
					disabled:disabled,
					class:item.class || 'form-control',
					'data-group':groupName
				}),
				itemState = {
					attr:attr,
					html:item.html,
					suffix:item.suffix,
					prefix:item.prefix
				},
				html = false;

			switch (type){
				case 'button':
					itemState.tag = 'button';
					attr.class = 'btn btn-default '+item.class;
					break;
				case 'label':
					itemState.tag = 'label';
					attr.class = 'control-label media-object';

					if (item.required && itemState.html) {	//required加红星
						itemState.html = '<span class="text-danger">*</span> '+itemState.html;
					}

					delete attr.required;
					delete attr.name;
					break;
				case 'select':
					itemState.tag = 'select';
					itemState.sub = (function(o) {
						var items = o;
						if (typeof(items) == 'string') {
							items = (SelectData[o] || []).concat([]);	//concat防止原始数据被修改
							items.unshift({
								name:(item.required?'* ':'')+(item.remark||'请选择'),
								value:''
							});
						}
						var rs = [];
						var i=0,cur;
						for(;cur=items[i++];) {
							rs.push({
								tag:'option',
								html:cur.name,
								attr:{
									value:cur.value,
									selected:cur.selected?'selected':undefined
								}
							});
						}
						return rs;
					})(item.options);
					break;
				case 'textarea':
					itemState.tag = 'textarea';
					break;
				case 'submit':
				case 'button':
					attr.type = type;
					itemState.tag = 'button';
					break;
				case 'checkbox':
					itemState.tag = 'input';
					attr.type = 'checkbox';
					attr.class = '';
					attr.checked = item.checked;
					attr.value = item.value;
					html = '<div class="checkbox"><label>'+this._createInput(itemState,defaultValue)+' '+(item.placeholder||'')+'</label></div>';
					break;
				case 'date':
					if (defaultValue && /^\d{13}$/.test(defaultValue)) {	//如果是纯13位的数字，标示为时间戳进行转化
						defaultValue = RString.date(defaultValue,'yyyy-MM-dd');
					}
				/*--
				case 'color':
				case 'date':
				case 'datetime':
				case 'datetime-local':
				case 'email':
				case 'month':
				case 'week':
				case 'time':
				case 'number':
				case 'password':
				case 'tel':
				case 'url':
				case 'text':
				 --*/
				default://默认input
					itemState.tag = 'input';
					attr.type = type;
			}

			rs = html || this._createInput(itemState,defaultValue);

			return rs;
		},
		_createInput:function(item,defaultValue) {
			var that = this;
			var tag = item.tag,
				attr = item.attr,
				subs = item.sub;
			var ele = $(document.createElement(item.tag));

			defaultValue = defaultValue || item.value;

			ele.attr(item.attr);//jq会自动过滤空的属性

			//需要填充html内容
			if (item.html) {
				ele.html(item.html);
			}


			//增加子元素
			if (subs) {
				ele.append((function(s) {
					var i=0,cur;
					var rs = [];
					for(;cur=s[i++];) {
						rs.push(that._createInput(cur));
					}
					return rs.join('');
				})(subs));
			}
			//设置默认值，必须要在子元素生成完后再设置
			this._setDefault(ele,item,defaultValue);

			//补上前缀、后缀
			if (item.suffix || item.prefix) {
				ele = $('<div class="input-group"></div>').append(ele);
				if (item.suffix) {	//后缀
					ele.append('<div class="input-group-addon">'+item.suffix+'</div>');
				}
				if (item.prefix) {	//前缀
					ele.prepend('<div class="input-group-addon">'+item.prefix+'</div>');
				}
			}

			ele =ele.get(0).outerHTML;

			return ele;
		},
		_setDefault:function(ele,item,val) {
			ele = $(ele);
			var eleOri = ele.get(0);

			if(val===undefined || val===null)return;

			var tagName = eleOri.tagName.toLocaleLowerCase();

			switch(tagName){
				case 'select':
					ele.find('option').each(function(){
						this.removeAttribute('selected');
					});
					ele.find('option[value="' + val + '"]').attr('selected','selected');
					break;
				case 'radio':
					ele.each(function(){
						var checked = this.value == val ?  true :false;
						this.defaultChecked	= checked;
					});
					break;
				default: //checkbox, textarea, input
					ele = ele.get(0);
					ele.defaultValue = val;
					ele.value = val;
			}
		},
		//初始化group的新增事件
		_initGroupEvent:function() {
			var key = '__initevent__',
				done = GROUP_CACHE[key];
			if (done) {
				return ;
			}

			//标记进行过初始化，不需要重复
			GROUP_CACHE[key] = true;

			$(document.documentElement).on('click','[data-hook="former-group-add"]',function(ev) {
				ev.preventDefault();
				var elem = $(ev.currentTarget),
					name = elem.data('group-name'),
					data = GROUP_CACHE[name];
				if (!data) {
					alert('没有找到对应的分组缓存，请联系开发人员');
					return ;
				}
				var html = MOD._makeGroupItem(data.groups,data,{groupCanAdd:false});

				elem.parent().before(html);
			});
		}
	};

	return MOD;
});