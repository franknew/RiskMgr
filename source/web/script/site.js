/**
* seajs-config
* @date    2015-07-08 21:54:42
*/

(function  () {

	var CDN = location.origin+location.pathname.replace(/\/.*\..*/,'/');;
	seajs.config({
		alias:{
			'jquery':CDN+'script/lib/jquery-2.1.4/jquery.js',
			'bootstrap':CDN+'script/lib/bootstrap.js'
		},
		paths:{
			'risk':CDN+'script',
			'cdn':CDN
		}
	});

	seajs.use(['jquery','bootstrap','risk/unit/route','risk/components/user/index','risk/page/frame/index']);

})();