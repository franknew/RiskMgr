//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/route"],function(require,exports,module){

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
//apply-amount/src/index.js
//apply-amount/src/setup.tmpl.html

//js file list:
//apply-amount/src/index.js
/**
 * 申请额度
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define.pack("./index",["jquery","risk/unit/route","./tmpl"],function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			var html = tmpl.setup();
			route.show(html);
		}
	};

	return MOD;
});
//tmpl file list:
//apply-amount/src/setup.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'setup': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="row wizard-row">\n<div class="col-md-12 fuelux">\n<div class="block-wizard">\n	<div id="wizard1" class="wizard wizard-ux">\n		<ul class="steps">\n			<li data-target="#step1" class="active">Step 1<span class="chevron"></span></li>\n			<li data-target="#step2">Step 2<span class="chevron"></span></li>\n			<li data-target="#step3">Step 3<span class="chevron"></span></li>\n		</ul>\n	</div>\n	<div class="step-content">\n		<form class="form-horizontal group-border-dashed" action="#" data-parsley-namespace="data-parsley-" data-parsley-validate="" novalidate=""> \n			<div class="step-pane active" id="step1">\n				<div class="form-group no-padding">\n					<div class="col-sm-7">\n						<h3 class="hthin">User Info</h3>\n					</div>\n				</div>\n				<div class="form-group">\n					<label class="col-sm-3 control-label">User Name</label>\n					<div class="col-sm-6">\n						<input type="text" class="form-control" placeholder="User name">\n					</div>\n				</div>	\n				<div class="form-group">\n					<label class="col-sm-3 control-label">E-Mail</label>\n					<div class="col-sm-6">\n						<input type="text" class="form-control" placeholder="User E-Mail">\n					</div>\n				</div>	\n				<div class="form-group">\n					<label class="col-sm-3 control-label">Password</label>\n					<div class="col-sm-6">\n						<input type="password" class="form-control" placeholder="Enter your password">\n					</div>\n				</div>		\n				<div class="form-group">\n					<label class="col-sm-3 control-label">Verify Password</label>\n					<div class="col-sm-6">\n						<input type="password" class="form-control" placeholder="Enter your password again">\n					</div>\n				</div>	\n				<div class="form-group">\n					<div class="col-sm-offset-2 col-sm-10">\n						<button class="btn btn-default">Cancel</button>\n						<button data-wizard="#wizard1" class="btn btn-primary wizard-next">Next Step <i class="fa fa-caret-right"></i></button>\n					</div>\n				</div>									\n			</div>\n			<div class="step-pane" id="step2">\n				<div class="form-group no-padding">\n					<div class="col-sm-7">\n						<h3 class="hthin">Notifications</h3>\n					</div>\n				</div>\n				<div class="form-group">\n					<div class="col-sm-7">\n						<label class="control-label">E-Mail Notifications</label>\n						<p>This option allow you to recieve email notifications by us.</p>\n					</div>\n					<div class="col-sm-3">\n						<input class="switch" checked="" data-size="small" name="op1" type="checkbox">\n					</div>\n				</div>	\n				<div class="form-group">\n					<div class="col-sm-7">\n						<label class="control-label">Phone Notifications</label>\n						<p>Allow us to send phone notifications to your cell phone.</p>\n					</div>\n					<div class="col-sm-3">\n						<input class="switch" checked="" data-size="small" name="op1" type="checkbox">\n					</div>\n				</div>	\n				<div class="form-group">\n					<div class="col-sm-7">\n						<label class="control-label">Global Notifications</label>\n						<p>Allow us to send notifications to your dashboard.</p>\n					</div>\n					<div class="col-sm-3">\n						<input class="switch" checked="" data-size="small" name="op1" type="checkbox">\n					</div>\n				</div>	\n				<div class="form-group">\n					<div class="col-sm-12">\n						<button data-wizard="#wizard1" class="btn btn-default wizard-previous"><i class="fa fa-caret-left"></i> Previous</button>\n						<button data-wizard="#wizard1" class="btn btn-primary wizard-next">Next Step <i class="fa fa-caret-right"></i></button>\n					</div>\n				</div>	\n			</div>\n			<div class="step-pane" id="step3">\n				<div class="form-group no-padding">\n					<div class="col-sm-7">\n						<h3 class="hthin">Configuration</h3>\n					</div>\n				</div>\n				<div class="form-group">\n					<div class="col-sm-6">\n						<label class="control-label">Buy Credits: <span id="credits">$0</span></label>\n						<p>This option allow you to buy an amount of credits.</p>\n						\n						<input id="credit_slider" type="text" class="bslider form-control" value="0">\n					</div>\n					<div class="col-sm-6">\n						<label class="control-label">Change Plan</label>\n						<p>Change your plan many times as you want.</p>\n						<select class="select2">\n							<optgroup label="Personal">\n								<option value="p1">Basic</option>\n								<option value="p2">Medium</option>\n							</optgroup>\n							<optgroup label="Company">\n								<option value="p3">Standard</option>\n								<option value="p4">Silver</option>\n								<option value="p5">Gold</option>\n							</optgroup>\n						</select>\n					</div>\n				</div>\n				<div class="form-group">\n					<div class="col-sm-6">\n						<label class="control-label">Payment Rate: <span id="rate">0%</span></label>\n						<p>Choose your payment rate to calculate how much money you will recieve.</p>\n						\n						<input id="rate_slider" data-slider-min="0" data-slider-max="100" type="text" class="bslider form-control" value="0">\n					</div>\n					<div class="col-sm-6">\n						<label class="control-label">Keywords</label>\n						<p>Write your keywords to do a successful CEO with web search engines.</p>\n						<input class="tags" type="hidden" value="brown,blue,green">\n					</div>\n				</div>\n				<div class="form-group">\n					<div class="col-sm-12">\n						<button data-wizard="#wizard1" class="btn btn-default wizard-previous"><i class="fa fa-caret-left"></i> Previous</button>\n						<button data-wizard="#wizard1" class="btn btn-success wizard-next"><i class="fa fa-check"></i> Complete</button>\n					</div>\n				</div>	\n			</div>\n		</form>\n	</div>\n</div>\n</div>\n</div>');

return __p.join("");
}
};
return tmpl;
});
