/**
 * 表单生成器
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-19 16:49:41
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		RString = require('risk/unit/string');

	var SelectData = require('risk/data-dictionary');

	var MOD = {
		/**
		 * @param tpl 表单模板
		 * @param conf 配置项：
		 *     data: 表单的数据
		 *     disabled: 是否全局禁用表单
		 */
		make:function(tpl,conf) {
			conf = conf || {};

			var rs = ['<div class="form-horizontal">','','</div>'],
				group = [];

			var i=0,cur,cont='';
			for(;cur=tpl[i++];) {
				cont = '<div class="form-group">';
				cont += this._group(cur,conf);
				cont += '</div>';
				group.push(cont);
			}

			rs[1] = group.join('');
			rs = rs.join('');

			return rs;
		},
		_group:function(groups,conf) {
			var items = [],
				data = conf.data,
				disabled = conf.disabled;

			var i=0,cur,item;
			for(;cur=groups[i++];) {

				//全局disabled
				item = '<div class="col-sm-'+(cur.col||12)+'">';
				item += this._item(cur,data && data[cur.name],conf);
				item += '</div>';

				items.push(item);
			}

			items = items.join('');

			return items;
		},
		_item:function(item,defaultValue,conf) {
			var rs = '',
				type = item.type,
				disabled = type=='hidden'?false:(('disabled' in item)?item.disabled:conf.disabled),
				attr = {
					name:item.name,
					placeholder:item.placeholder,
					required:item.required,
					disabled:disabled,
					class:item.class || 'form-control'
				},
				itemState = {
					attr:attr,
					html:item.html,
					suffix:item.suffix,
					prefix:item.prefix
				},
				html = false;

			switch (type){
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
		}
	};

	return MOD;
});