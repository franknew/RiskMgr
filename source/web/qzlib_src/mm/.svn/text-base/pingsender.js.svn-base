/**
 * Created with JetBrains WebStorm.
 * User: jinjingcao
 * Date: 13-3-22
 * Time: 下午3:39
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
	var commonInfo = require("./mm.commonInfo");
	var tasks = [], _ticker = 2500;

	var execute = function(url){
		if(!url) return;
		if(url.length>2000) {
			execute.post(url);
		}else{
			execute.get(url);
		}
	};
	execute.post=function(url){
		var iframe = document.createElement("iframe");
		iframe.name="mm_stat_idx_"+(execute.post.sq++);
		iframe.style.cssText="position:absolute; top:-100px; width:1px; height:1px;";
		iframe.onload=function(){
			var frm;
			if(!iframe.src)return;
			if(frm=document.getElementById("frm_")+iframe.name){
				frm.parentNode.removeChild(frm);
			}
			iframe.parentNode && iframe.parentNode.removeChild(iframe);
		};

		var form = document.createElement("form");
		form.style.cssText="position:absolute; top:-100px; width:1px; height:1px;";
		form.id = "frm_"+iframe.name;
		form.target=iframe.name;
		var temp1 = url.split("?");
		var act = temp1[0];
		form.action=act+"?r="+Math.random();
		var kvs = temp1[1].split("&");
		for(var i=0;i<kvs.length;i++){
			var temp2=kvs[i].split("=");
			var ipt = document.createElement("input");
			ipt.name=temp2[0];
			ipt.value = decodeURIComponent(temp2[1]);
			form.appendChild(ipt);
		}

		document.body.appendChild(iframe);
		document.body.appendChild(form);

		form.submit();
	};
	execute.post.sq=1000;
	execute.get=function(url){
		var img = new Image();
		var tmp = url.indexOf("?")>-1?"&":"?";
		img.src = url+tmp+"r="+Math.random();
	};

	window.onbeforunload=function(){
		flush();
	};

	/**
	 * 将参数对象转换为字符串
	 * @param obj
	 */
	var parseParam = function(obj){
		var ret = [];
		for(var i in obj){
			ret.push(i+"="+encodeURIComponent(obj[i]));//encodeURIComponent 这里不需要编码
		}
		return ret.join("&");
	};

	var flush = function(){
		var tmp = {}, task, len=tasks.length;
		if(len<=0) return;

		var base = commonInfo.getInfo()||{};//合并上报追加基础信息

		while(task = tasks.shift()){
			var type = task["type"], urlObj = task["urlObj"];

			for(var i in urlObj){//report中的字段可以覆盖基础信息中的字段
				if(urlObj[i]){
					delete base[i];
				}
			}

			var cType = tmp[type]||(tmp[type]=[]);
			cType.push(parseParam(urlObj));
		}

//		base.test=1;//for test

		var baseStr = parseParam(base);
//		execute('http://hw.qzone.com/client/report'
		execute('http://mmspeed.qq.com/client/report'
				+ '?report_data='+encodeURIComponent(JSON.stringify(tmp))
				+ '&comm_data='+encodeURIComponent(baseStr)
		);
//		len&&execute('http://ttest.m.qzone.com/client/report?report_data='+encodeURIComponent(JSON.stringify(tmp)));
	};

	var start = function(timeout){
		clearInterval(start._tmr);
		start._tmr = setInterval(function(){
			flush();
		}, timeout);
	};
	start.clear = function(){
		clearInterval(start._tmr);
		start._tmr = null;
	},
	start._tmr = null;
	start.check = function(){
		if(tasks.join(",").length>1000) {
			flush();
		}
	};

	return {
		parseParam : parseParam,
		send:function (url, timeout) {
			timeout=~~timeout||0;
			if(url) {
				setTimeout(function(){
					execute(url);
				}, timeout);
			}
		},
		queue:function(urlObj, type){
			if(urlObj && type) {
				tasks.push({urlObj:urlObj, type:type});

				if(!start._tmr){
					start(_ticker);
				}else{//防止url溢出
					start.check();
				}
			}
		},
		flush : function(){flush();},
		/**
		 * 复写心跳定时器时长
		 * @param ticker
		 */
		setTick : function(ticker){
			_ticker = ~~ticker||2500;
			if(!start._tmr){
				start.clear();
				start(_ticker);
			}
		}
	}
});
