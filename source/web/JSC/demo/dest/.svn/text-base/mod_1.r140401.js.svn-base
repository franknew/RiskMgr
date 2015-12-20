(function() {
var e = [], t = parseFloat(seajs.version);
define([ "lib", "common", "$", "./tmpl", "main", "./file_list.file_list", "./file_path.file_path", "./toolbar.tbar", "./view_switch.view_switch", "./file_list.ui" ], function(n, r, i) {
var s = i.uri || i.id, o = s.split("?")[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i), u = o && o[1], a = o && "./" + o[2], f = 0, l = e.length, c, h, p;
a = a.replace(/\.r[0-9]{15}/, "");
for (; f < l; f++) h = e[f], typeof h[0] == "string" && (a === h[0] && (c = h[2]), h[0] = u + h[0].replace("./", ""), t > 1 && define.apply(this, h));
return e = [], n.get = n, typeof c == "function" ? c.apply(this, arguments) : n;
}), define.pack = function() {
e.push(arguments), t > 1 || define.apply(null, arguments);
};
})(), define.pack("./disk", [ "lib", "common", "$", "./tmpl", "main", "./ui", "./file_list.file_list", "./file_path.file_path", "./toolbar.tbar", "./view_switch.view_switch" ], function(e, t, n) {
var r = e("lib"), i = e("common"), s = e("$"), o = r.get("./collections"), u = r.get("./console"), a = r.get("./events"), f = i.get("./module"), l = i.get("./user_log"), c = i.get("./global.global_event"), h = i.get("./constants"), p = i.get("./global.global_event").namespace("add_wy_appbox"), d = e("./tmpl"), v = [].slice, m = e("main"), g = m.get("./ui"), y, b = new f("disk", {
ui: e("./ui"),
params_invoke_map: {
path: "set_path"
},
set_path: function(t) {
e("./file_list.file_list").set_path(t);
},
set_init_data: function(t, n) {
e("./file_list.file_list").set_init_data(t, n);
},
render_sub: function(e, t, n) {
try {
var r = v.call(arguments, 1);
e.render.apply(e, r), this.add_sub_module(e);
} catch (i) {
u.error("disk.js:初始化 " + e.module_name + " 模块失败:\n", i.message, "\n", i.stack);
}
return this;
}
});
return b.on("render", function() {
var t = this.ui, n = e("./file_list.file_list"), r = n.ui, i = e("./file_path.file_path"), s = e("./toolbar.tbar"), o = e("./view_switch.view_switch");
this.render_sub(s, g.get_$bar1()), this.render_sub(i, g.get_$bar2()), this.render_sub(o, s.get_$el()), this.render_sub(n, t.get_$body()), h.IS_APPBOX && e.async("add_wy_appbox", function(e) {
try {
e.get("./add_wy_appbox"), p.trigger("is_wy_in_appbox");
} catch (t) {}
}), this.listenTo(r, "frame_height_changed", function() {
this.trigger("resize");
});
}), b;
}), define.pack("./ui", [ "lib", "common", "$", "./tmpl", "./toolbar.tbar", "main", "./disk", "./view_switch.view_switch", "./file_list.file_list", "./file_list.ui", "./file_path.file_path" ], function(e, t, n) {
var r = e("lib"), i = e("common"), s = e("$"), o = r.get("./collections"), u = r.get("./console"), a = r.get("./text"), f = r.get("./events"), l = r.get("./routers"), c = i.get("./module"), h = i.get("./query_user"), p = i.get("./user_log"), d = i.get("./global.global_event"), v = i.get("./global.global_function"), m = i.get("./global.global_event").namespace("upload2"), g = i.get("./global.global_event").namespace("page"), y = i.get("./constants"), b = i.get("./ui.mini_tip"), w = e("./tmpl"), E = e("./toolbar.tbar"), S = e("main"), x = e("main").get("./main"), T = S.get("./ui"), N, C, k, L, A, O, M = new c("disk_ui", {
render: function() {
N = e("./disk"), C = e("./view_switch.view_switch"), k = e("./file_list.file_list"), L = e("./file_list.ui"), A = e("./file_path.file_path"), this.listenTo(C, "switch sidebar_view_change", function() {
this._update_view();
}).listenTo(h, "error", function(e) {
b.error(e);
}), this.on("activate", function() {
this._update_view(), this.get_$body().show();
var e = x.get_history(), t = e.length;
while (t) {
t -= 1;
if (e[t] === "disk") break;
if (e[t] === "offline") {
k.load_root();
return;
}
}
A.activate();
}).on("deactivate", function() {
this.get_$body().hide(), this.toggle_toolbar(y.DISK_TOOLBAR.HIDE), A.deactivate();
});
},
_update_view: function() {
var e = this.get_$body();
e.toggleClass("ui-thumbview", C.is_grid_view()).toggleClass("ui-listview", C.is_list_view());
},
get_$body: function() {
return this.init_$doms(), this._$body;
},
init_$doms: function() {
this._$body || (this._$body = s("#_disk_body"), this._$body[0] || (this._$body = s(w.body({
module: this
})).appendTo(T.get_$body_box())));
},
get_$toolbar: function() {
return this.init_$doms(), s("#_disk_toolbar_container");
},
last_tbar_type: null,
toggle_toolbar: function(e) {
if (e === this.last_tbar_type) return;
this.last_tbar_type = e;
var t, n;
switch (e) {
case y.DISK_TOOLBAR.NORMAL:
t = !0, n = !1;
break;
case y.DISK_TOOLBAR.HIDE:
t = !1, n = !1;
break;
case y.DISK_TOOLBAR.VIRTUAL_SHOW:
t = !1, n = !0;
}
t ? E.toggle_toolbar("normal") : n ? E.toggle_toolbar("offline") : E.toggle_toolbar(null), N && N.trigger("resize");
},
set_is_empty: function(e) {
this.get_$body().toggleClass("ui-view-empty", e);
},
get_$sidebar: function(e) {
var t = s("#_disk_sidebar");
return !e && !t[0] && (t = s('<div id="_disk_sidebar" class="dbview-nav"></div>'), T.get_$body_box().after(t)), t;
},
toggle_sidebar: function(e) {
this.get_$sidebar().css("display", e ? "" : "none"), T.get_$main_content().toggleClass("dbview-module", e), this._fix_wk_layout();
},
_fix_wk_layout: s.browser.webkit && s.browser.version < "30" ? function() {
this.get_$body().toggle().toggle();
} : s.noop
});
return M.once("render", function() {
var e = !1, t = function(t, n, r) {
var i = t > 1 ? n.split("*") : n.split("\r\n");
if (!i || i.length === 0) return !1;
var s = r === "AIO" || l.get_param("action") === "qq_receive";
if (s) e = !0, setTimeout(function() {
k.enter_qq_receive(!1, function() {
T.get_$bar2().css("opacity", 1), T.get_$main_content().css("opacity", 1), m.trigger("start_upload_from_client", i, !0);
}), p("upload_from_QQClient", O, O, {
os_type: y.OS_TYPES.QQ
});
}, 100); else if (r === "DragDrop") return p("DISK_DRAG_UPLOAD"), m.trigger("start_upload_from_client", i);
}, n = function(e) {
N.is_activated() || l.go({
m: "disk"
}), e === "/" ? (T.get_$bar2().css("opacity", 1), T.get_$main_content().css("opacity", 1), k.load_root(!0, 0, !0)) : (T.get_$bar2().css("opacity", 0), T.get_$main_content().css("opacity", 0), k.enter_qq_receive(!0, function() {
T.get_$bar2().css("opacity", 1), T.get_$main_content().css("opacity", 1);
}), p("view_from_QQClient", O, O, {
os_type: y.OS_TYPES.QQ
}));
}, r = function() {
v.register("WYCLIENT_EnterOfflineDir", n), v.register("WYCLIENT_UploadFiles", t), l.get_param("action") === "qq_receive" && !e ? n() : (T.get_$bar2().css("opacity", 1), T.get_$main_content().css("opacity", 1));
};
h.get_cached_user() ? r() : h.once("load", r);
}), g.on("check_file_upload_draggable", function() {
if (!M.get_$body().is(":visible")) return !1;
}), M;
}), define.pack("./mod_1_tmpl", [], function(e, t, n) {
var r = {
body: function(e) {
var t = [], n = function(e) {
t.push(e);
};
return t.push('    <div id="_disk_body" class="disk-view ui-view" data-label-for-aria="文件列表内容区域">\r\n        <!-- 文件列表 -->\r\n    </div>'), t.join("");
}
};
return r;
});