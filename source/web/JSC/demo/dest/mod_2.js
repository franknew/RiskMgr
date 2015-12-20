//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["lib","common","$"],function(require,exports,module){

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
//mod_2/src/file/file_node.js
//mod_2/src/file/file_node_ui.js
//mod_2/src/file/utils/all_file_map.js
//mod_2/src/file/utils/file_factory.js
//mod_2/src/file/utils/file_node_from_cgi.js

//js file list:
//mod_2/src/file/file_node.js
//mod_2/src/file/file_node_ui.js
//mod_2/src/file/utils/all_file_map.js
//mod_2/src/file/utils/file_factory.js
//mod_2/src/file/utils/file_node_from_cgi.js
/**
 * 文件树形节点（继承自file_object）
 * 需要注意的是，.get_kid_nodes() 返回null时表示该节点未加载数据，返回[]表示无数据
 * @author jameszuo
 * @date 13-3-4
 */
define.pack("./file.file_node",["lib","common","$","./file.utils.all_file_map","./file.file_node_ui"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),

        File = common.get('./file.file_object'),
        constants = common.get('./constants'),

        all_file_map = require('./file.utils.all_file_map'),
        FileNodeUI = require('./file.file_node_ui'),

        undefined;

    /**
     * 文件节点构造函数
     *  - 继承自File对象的属性
     *    @param {string}  options.id              文件ID
     *    @param {string}  options.name            文件名
     *    @param {boolean} options.is_dir          是否目录
     *    @param {string}  options.create_time     创建时间
     *    @param {string}  options.modify_time     修改时间
     *    @param {String}  options.life_time       剩余有效时间
     *    @param {String}  options.belong_type     文件来源类型
     *    @param {String}  options.uin             文件来源UIN
     *    @param {String}  options.nickname        文件来源nickname
     *    @param {number}  options.size            大小（目录可不指定）
     *    @param {number}  options.cur_size        已上传的大小（目录可不指定）
     *    @param {string}  options.file_ver        文件版本（目录可不指定）
     *    @param {string}  options.file_md5        文件MD5（目录可不指定）
     *    @param {string}  options.file_sha        文件SHA1（目录可不指定）
     *    @param {string}  options.file_note       文件Note（目录可不指定）
     *  - FileNode自身属性
     *    @param {FileNode} options.parent         父目录
     *    @param {boolean} options.is_vir_dir      是否虚拟目录，默认false
     *    @param {Boolean} options.is_super        是否抽象根节点，默认false
     *    @param {Boolean} options.is_qq_disk_dir  是否QQ硬盘目录，默认false
     *    @param {Boolean} options.is_net_fav_dir  是否QQ硬盘目录，默认false
     *    @param {Boolean} options.has_image       目录是否可能包含图片
     *    @param {Boolean} options.has_video       目录是否可能包含视频
     *    @param {Boolean} options.has_text        目录是否可能包含文字
     *    @param {Boolean} options.has_voice       目录是否可能包含语音
     *    @param {Boolean} options.has_article     目录是否可能包含文章
     *    @param {Boolean} options.has_more        目录是否还有更多文件（for 分页）
     *    @param {Number}  options.count           目录下的文件个数（包含未加载到本地的）
     *    @param {Boolean} options.has_newsurl     是否包含来源路径，默认false， file_note中记录的appid判断
     * @constructor
     */
    var FileNode = function (options) {
        var me = this;
        File.apply(me, arguments);

        me._parent = me._kid_nodes = me._kid_map = me._kid_files = me._kid_dirs = null;
        me._is_super = options.is_super === true;
        me._is_vir_dir = !!options.is_vir_dir;
        // 为hash route作准备
        me._route_hash = options.route_hash;
        //是否有文件来源url      目前只需要判断文件是否来源于腾讯新闻  appid=30227

        me._has_newsurl = (options.file_note && (options.file_note.indexOf(constants.OS_TYPES.QQNEWS) > 0)) ? true : false;

        var id_suffix = me.get_id().substr(8);
        // 是QQ硬盘
        me._is_qq_disk_dir = id_suffix === constants.QQDISK_DIR_ID;
        // 是网络收藏夹
        me._is_net_fav_dir = id_suffix === constants.NET_FAV_DIR_ID;

        // 虚拟目录不可
        if (me._is_vir_dir) {
            me._is_downable = false;
            me._is_removable = false;
            me._is_movable = false;
            me._is_renamable = false;
            me._is_draggable = false;
            me._is_droppable = false;
            me._is_selectable = false;
            me.set_modify_time('');
            me.set_create_time('');
        }
        // 破损文件不可
        if (me.is_broken_file()) {
            me._is_downable = false;
            me._is_movable = false;
            me._is_renamable = false;
            me._is_draggable = false;
            me._is_droppable = false;
        }

        me._has_image = !!options.has_image;
        me._has_video = !!options.has_video;
        me._has_text = !!options.has_text;
        me._has_voice = !!options.has_voice;
        me._has_article = !!options.has_article;
        me._ui = new FileNodeUI(me);

        // QQ离线文件相关
        me.qq_offline_props(options);

        // tpmini相关
        me.tpmini_props(options);
    };

    FileNode.prototype = $.extend({}, File.prototype,
        {
            _is_file_node_instance: true,
            class_name: 'FileNode',

            set_parent: function (parent) {
                this._parent = parent;
                this._pid = parent ? parent.get_id() : null;
            },

            // 判断节点是否在树上
            is_on_tree: function () {
                return all_file_map.get(this.get_id()) === this;
            },

            // 判断是否抽象根目录
            is_super: function () {
                return this._is_super;
            },

            // 判断是否是根目录
            is_root: function () {
                return this._parent && this._parent.is_super() && this.is_on_tree();
            },

            // 获取当前节点的hash router path，用于url hash导航
            get_route_hash: function () {
                return this._route_hash;
            },

            // 判断是否是虚拟目录
            is_vir_dir: function () {
                return this._is_vir_dir;
            },

            // 判断是否有跳转到来源URL
            has_newsurl: function () {
                return this._has_newsurl;
            },
            //判断是否 离线文件
            is_offline_node: function () {
                return this.get_parent() && this.get_parent().is_offline_dir();
            },
            // 判断是否是虚拟目录或文件
            is_vir_node: function () {
                var node = this;
                do {
                    if (node.is_vir_dir()) {
                        return true;
                    }
                } while (node = node.get_parent());

                return false;
            },

            // 判断是否QQ硬盘目录
            is_qq_disk_dir: function () {
                return this._is_qq_disk_dir;
            },

            // 判断是否网络收藏夹目录
            is_net_fav_dir: function () {
                return this._is_net_fav_dir;
            },

            // 判断是否包含图片
            has_image: function () {
                return this._has_image
            },
            // 判断是否包含视频
            has_video: function () {
                return this._has_video
            },
            // 判断是否包含文字
            has_text: function () {
                return this._has_text
            },
            // 判断是否包含语音
            has_voice: function () {
                return this._has_voice
            },
            // 判断是否包含文章
            has_article: function () {
                return this._has_article
            },
            // 判断目录下是否有文件
            has_nodes: function () {
                return (!!this._kid_nodes && this._kid_nodes.length > 0) || this.has_more();
            },
            // 判断目录下是否仍有文件未加载
            has_more: function () {
                var kids = this.get_kid_nodes();
                if (kids) {
                    return this.get_kid_count() > kids.length;
                } else {
                    return true;
                }
            },

            // 标记临时新建的节点成功创建，它将成为正常节点，反回修改前的节点id。如果没有变化，则不返回
            mark_create_success: function (data) {
                var old_id, new_id;
                if (this.is_tempcreate()) {
                    old_id = this.get_id();
                    new_id = data.id;
                    this.set_name(data.name);
                    this.set_create_time(data.create_time);
                    this.set_modify_time(data.modify_time);
                    this._is_tempcreate = false;

                    // 当ID发生变化时，需要修正一些数据
                    if (old_id !== new_id) {
                        this._id = new_id;
                        var par = this.get_parent(),
                            par_kid_map = this.get_parent().get_kid_map()

                        // 因为ID变化，所以需要重建父子关系
                        this.set_parent(par);
                        delete par_kid_map[old_id];
                        par_kid_map[new_id] = this;

                        all_file_map.remove(old_id);
                        all_file_map.set(new_id, this);
                        return old_id;
                    }
                }
            },

            /**
             * 获取父节点
             */
            get_parent: function () {
                return this._parent;
            },

            /**
             * 获取子节点
             */
            get_kid_nodes: function () {
                return this._kid_nodes;
            },

            /**
             * 获取子节点map
             */
            get_kid_map: function () {
                return this._kid_map;
            },

            /**
             * 获取目录子节点
             */
            get_kid_dirs: function () {
                return this._kid_dirs;
            },

            /**
             * 获取文件子节点
             */
            get_kid_files: function () {
                return this._kid_files;
            },

            /**
             * 获取目录下总文件个数（包含未加载到本地的文件）
             */
            get_kid_count: function () {
                return this._kid_count || 0;
            },

            /**
             * 获取所有文件的完整路径
             * @returns {FileNode[]}
             */
            get_path_nodes: function () {
                var path = [this],
                    p = this;
                while (p = p.get_parent()) {
                    path.push(p);
                }
                path.reverse();
                return path;
            },

            /**
             * 通过ID获取当前节点的子节点
             * @param {FileNode|String} id
             */
            get_node: function (id) {
                return id && this._kid_map ? this._kid_map[id] : null;
            },

            /**
             * 设置当前节点的子节点(覆盖)
             * @param {Array<FileNode>} files
             * @param {Array<FileNode>} dirs
             */
            set_nodes: function (dirs, files) {
                if (!files && !dirs) {
                    return;
                }

                var me = this;

                me.clear_nodes();


                this._kid_nodes = [];
                this._kid_dirs = [];
                this._kid_files = [];
                this._kid_map = {};

                this.add_nodes(dirs, files);
            },

            /**
             * 添加当前节点的子节点
             * @param {Array<FileNode>} files
             * @param {Array<FileNode>} dirs
             */
            add_nodes: function (dirs, files) {
                if (!files && !dirs) {
                    return;
                }

                var me = this;

                /*!this._kid_nodes && ( this._kid_nodes = []);
                 !this._kid_dirs && (this._kid_dirs = []);
                 !this._kid_files && ( this._kid_files = []);
                 !this._kid_map && (this._kid_map = {});*/

                for (var gi = 0, gl = arguments.length; gi < gl; gi++) {
                    var new_nodes = arguments[gi];
                    if (new_nodes && new_nodes.length) {
                        for (var ni = 0, nl = new_nodes.length; ni < nl; ni++) {
                            var node = new_nodes[ni];
                            me.append_node(node);

                            var kid_dirs = node.get_kid_dirs(),
                                kid_files = node.get_kid_files();

                            if ((kid_dirs && kid_dirs.length) || (kid_files && kid_files.length)) {
                                node.set_nodes(kid_files, kid_dirs);
                            }
                        }
                    }
                }
            },

            /**
             * 添加子节点
             * @param {FileNode} node
             * @param {Boolean/Number/String/FileNode} before 插入到最前方，默认false，表示追加到后方。如果为数字，表示插入的位置。如果为字串，表示NodeId。
             */
            add_node: function (node, before) {
                // 如果已经在全局缓存中, 并且不在当前节点的子节点中, 则表示该节点是由其他位置移动到当前节点下, 需要从原节点中移除
                var id = node.get_id();
                var exists_node = all_file_map.get(id);
                if (exists_node && exists_node.get_parent() !== this) {   // 如果父节点已不再是当前节点, 需要同步节点所在位置
                    exists_node.get_parent().remove_nodes([exists_node]);
                }

                // 写入全局缓存
                all_file_map.set(id, node);

                // 父节点指向当前节点
                node.set_parent(this);

                var kid_nodes = this._kid_nodes || (this._kid_nodes = []),
                    kid_dirs = this._kid_dirs || (this._kid_dirs = []),
                    kid_files = this._kid_files || (this._kid_files = []),
                    kid_map = this._kid_map || (this._kid_map = {});


                // 替换要添加的节点已经在当前节点下了，则替换
                if (kid_map[id]) {
                    replace_node(kid_nodes, node) && replace_node(node.is_dir() ? kid_dirs : kid_files, node);
                }
                // 不存在，则追加或插入
                else {
                    kid_nodes.push(node);

                    var insert_to = node.is_dir() ? kid_dirs : kid_files;
                    // 插入
                    if (insert_to.length > 0) {
                        if (typeof before === 'boolean') {
                            before = before ? 0 : insert_to.length;
                        }
                        if (typeof before === 'string') {
                            before = all_file_map.get(before);
                        }
                        if (FileNode.is_instance(before)) {
                            before = $.inArray(before, insert_to);
                        }
                        before = before >= 0 && before <= insert_to.length ? before : insert_to.length;
                        insert_to.splice(before, 0, node);
                    }
                    // 追加
                    else {
                        insert_to.push(node);
                    }
                }

                kid_map[id] = node;
            },

            /**
             * 在前方插入一个节点
             * @param {FileNode} node
             */
            prepend_node: function (node) {
                this.add_node(node, true);
            },

            /**
             * 在后方追加节点
             * @param {FileNode} node
             */
            append_node: function (node) {
                this.add_node(node, false);
            },

            /**
             * 标记节点是否为已修改
             * @param {Boolean} dirty 是否臧数据
             */
            set_dirty: function (dirty) {
                if (typeof dirty !== 'boolean') {
                    console.error('无效的参数 dirty=', dirty);
                }
                this._is_dirty = !!dirty;
            },

            /**
             * 设置目录下总文件个数
             * @param {Number} count
             */
            set_kid_count: function (count) {
                this._kid_count = count;
            },

            /**
             * 删除自身节点
             */
            remove: function () {
                var parent = this.get_parent();
                if (parent) {
                    parent.remove_nodes(this);
                }
            },

            /**
             * 删除子节点
             * @param {FileNode|Array<FileNode>|Array<String>} rem_kid_nodes
             */
            remove_nodes: function (rem_kid_nodes) {
                if (!rem_kid_nodes) return;

                var kid_nodes = this._kid_nodes,
                    kid_map = this._kid_map;

                if (kid_nodes && kid_nodes.length) {
                    var kid_files = this._kid_files,
                        kid_dirs = this._kid_dirs;

                    if (!(rem_kid_nodes instanceof Array)) {
                        rem_kid_nodes = [rem_kid_nodes];
                    }

                    // 转换array为set提高遍历速度
                    var is_id_arr = typeof rem_kid_nodes[0] === 'string',
                        removal_nodes_set = is_id_arr ? collections.array_to_set(rem_kid_nodes) : collections.array_to_set(rem_kid_nodes, function (node) {
                            return node.get_id();
                        });

                    $.each(rem_kid_nodes, function (i, rem_kid_node) {
                        // 递归清空其子节点
                        // rem_kid_node.clear_nodes(); // james: 取消递归清空子节点，会导致手动创建的FileNode（如微信）的子节点被删除，从而导致一些bug
                        // 断绝旧的父子关系
                        rem_kid_node.set_parent(null);
                        // 从全局缓存中删除
                        rem_kid_node.remove_from_global();
                    });

                    var i;

                    // 从 kid_nodes、kid_map 中删除
                    for (i = kid_nodes.length - 1; i >= 0; i--) {
                        var node = kid_nodes[i];
                        if (node.get_id() in removal_nodes_set) {
                            kid_nodes.splice(i, 1);
                            delete kid_map[node.get_id()];
                        }
                    }

                    // 从 kid_files 中删除
                    if (kid_files && kid_files.length) {
                        for (i = kid_files.length - 1; i >= 0; i--) {
                            if (kid_files[i].get_id() in removal_nodes_set) {
                                kid_files.splice(i, 1);
                            }
                        }
                    }

                    // 从 kid_dirs 中删除
                    if (kid_dirs && kid_dirs.length) {
                        for (i = kid_dirs.length - 1; i >= 0; i--) {
                            if (kid_dirs[i].get_id() in removal_nodes_set) {
                                kid_dirs.splice(i, 1);
                            }
                        }
                    }

                }
            },

            /**
             * 清除当前节点的子节点
             */
            clear_nodes: function () {
                if (this._kid_nodes && this._kid_nodes.length) {
                    $.each(this._kid_nodes, function (i, node) {
                        // 递归清空子节点
                        // node.clear_nodes(); // james: 取消递归清空子节点，会导致手动创建的FileNode（如微信）的子节点被删除，从而导致一些bug
                        node.set_parent(null);
                        node.remove_from_global();
                    });
                    this._kid_nodes = this._kid_map = this._kid_files = this._kid_dirs = null;
                }
            },

            remove_from_global: function () {
                all_file_map.remove(this.get_id());
                var kids = this.get_kid_nodes();
                if (kids && kids.length) {
                    $.each(kids, function (i, kid) {
                        all_file_map.remove(kid.get_id());
                    });
                }
            },

            get_ui: function () {
                return this._ui;
            }
        },

        // QQ离线文件相关
        {
            qq_offline_props: function (options) {
                this._belong_type = options.belong_type || '';
                this._uin = options.uin || '';
                this._nickname = options.nickname || '';
                this.set_life_time(options.life_time);
            },
            set_life_time: function (life_time) {
                if (life_time) {
                    this._life_time = life_time - 0;
                } else {
                    this._life_time = 0;
                }
            },
            get_life_time: function () {
                return this._life_time;
            },
            //获取文件来源类型 数字标示
            get_down_type: function () {
                return this._belong_type === 'recv_list' ? 2 : 1;
            },
            //获取文件来源uin
            get_uin: function () {
                return this._uin;
            },
            //获取文件来源nickname
            get_nickname: function () {
                return this._nickname;
            },
            //离线文件目录
            is_offline_dir: function () {
                return this.is_vir_dir() && constants.OFFLINE_DIR === this.get_id().substr(8);
            }
        },

        // tpmini 相关
        {
            tpmini_props: function (options) {
                this._tpmini_key = options.tp_key;
                this.is_upload_by_tpmini() && this.set_upload_by_tpmini_fail(options.tp_fail);
            },
            is_upload_by_tpmini: function () {
                return parseInt(this._tpmini_key, 10) > 0;
            },
            has_uploaded_by_tpmini: function () {
                return this.get_size() == this.get_cur_size();
            },
            is_upload_by_tpmini_fail: function () {
                return this._is_tpmini_fail;
            },
            set_upload_by_tpmini_fail: function (fail) {
                this._is_tpmini_fail = !!fail;
            }
        }
    );


    /**
     * 判断一个对象是否是FileNode或其子类的实例
     * @param {Object} obj
     * @return {boolean}
     */
    FileNode.is_instance = function (obj) {
        if (!obj)
            return false;

        return obj._is_file_node_instance;
    };

    var replace_node = function (arr, node) {
        var id = node.get_id();
        for (var i = 0, l = arr.length; i < l; i++) {
            if (id === arr[i].get_id()) {
                arr.splice(i, 1, node);
                return true;
            }
        }
        return false;
    };

    return FileNode;
});/**
 * FileNode UI
 * @author jameszuo
 * @date 13-8-1
 */
define.pack("./file.file_node_ui",["lib","common","$"],function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        events = lib.get('./events'),

        file_list_event = common.get('./global.global_event').namespace('disk/file_list'),

        undef;


    var FileNodeUI = function (file) {
        // is_selectable 是否可选中
        // is_selected 是否已选中
        // is_rendered 是否已渲染
        this._file = file;
    };

    FileNodeUI.prototype = {

        /**
         * 选中、取消选中文件
         * @param {Boolean} sel
         */
        set_selected: function (sel) {
            if (this.is_selectable() === false || this._is_selected === sel) {
                return false;
            }

            this._is_selected = sel;

            file_list_event.trigger('file_select_change', this._file, sel);

            return true;
        },

        /**
         * 判断文件是否已选中
         * @return {Boolean}
         */
        is_selected: function () {
            return !!this._is_selected;
        },

        /**
         * 标记文件是否已渲染
         * @param {Boolean} rend
         */
        set_rendered: function (rend) {
            this._is_rendered = rend;
        },

        /**
         * 判断文件是否已渲染
         * @return {Boolean}
         */
        is_rendered: function () {
            return this._is_rendered;
        },

        is_selectable: function () {
            var file = this._file;
            return file.is_selectable();
        },

        get_file: function () {
            return this._file;
        }
    };

    $.extend(FileNodeUI.prototype, events);

    return FileNodeUI;
});/**
 * 文件全局映射
 * @author jameszuo
 * @date 13-6-26
 */
define.pack("./file.utils.all_file_map",[],function (require, exports, module) {

    var map = {};

    module.exports = {

        /**
         * 通过文件ID获取文件实例
         * @param {String} id
         * @returns {FileObject|FileNode} FileObject的子类
         */
        get: function (id) {
            return map[id];
        },

        /**
         * 通过文件ID数组批量获取文件实例
         * @param {Array<String>} ids
         */
        get_all: function (ids) {
            var arr = [];
            if (ids && ids.length) {
                for (var i = 0, l = ids.length; i < l; i++) {
                    var f = this.get(ids[i]);
                    if (f) {
                        arr.push(f);
                    }
                }
            }
            return arr;
        },

        /**
         * 写入map
         * @param {String} id
         * @param {FileObject|FileNode} f
         */
        set: function (id, f) {
            map[id] = f;
            return f;
        },

        /**
         * 从map中删除
         * @param {String} id
         */
        remove: function (id) {
            var f = map[id];
            delete map[id];
            return f;
        }

    };

});/**
 * 文件工厂，用于生成各种类型的文件实例，并维持一个全局的缓存
 * @author jameszuo
 * @date 13-6-26
 */
define.pack("./file.utils.file_factory",["$","./file.utils.all_file_map","./file.file_node"],function (require, exports, module) {
    var $ = require('$'),

        all_file_map = require('./file.utils.all_file_map'),

        FileNode = require('./file.file_node'),

        classes = {
            FileNode: FileNode
        },

        undef;

    module.exports = {

        /**
         * 生成指定类型的文件实例
         * @param {String} Class
         * @param {OBject} options
         * @returns {Class}
         */
        create: function (Class, options) {
            return new classes[Class](options);
        },

        /**
         * 通过CGI响应结果生成文件实例
         * @param {String|Function} type
         * @param {Object} data
         */
        create_from_cgi: function (type, data) {
            var Class = typeof type === 'string' ? classes[type] : type;
            return Class.from_cgi(data);
        }

    };

});/**
 *  从CGI返回结果中获取文件信息转换为文件对象
 * @author jameszuo
 * @date 13-6-27
 */
define.pack("./file.utils.file_node_from_cgi",["lib","common","./file.utils.file_factory"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),
        constants = common.get('./constants'),

        collections = lib.get('./collections'),

        file_factory = require('./file.utils.file_factory'),
        parse_file = common.get('./file.parse_file'),
        parse_int = parseInt,

        e = [],

        /**
         * CGI响应数据适配器
         */
            cgi_file_adapters = {
            FileNode: function (obj, p_node) {
                if ('file_id' in obj || 'dir_key' in obj || 'dir_attr' in obj || 'file_attr' in obj) {

                    var par_is_vir_dir = p_node.is_vir_dir(),
                        is_dir = 'dir_key' in obj || 'dir_attr' in obj;

                    // 父目录如果是虚拟目录，则其子目录均为虚拟目录
                    if (par_is_vir_dir && is_dir) {
                        return file_node_from_cgi.vir_dir_from_cgi(obj);
                    }
                    // 普通目录
                    else if (is_dir) {
                        return file_node_from_cgi.dir_from_cgi(obj);
                    }
                    // 普通文件
                    else {
                        return file_node_from_cgi.file_from_cgi(obj);
                    }
                }
            }
        };

    var route_hash_map;
    // 通过virtual_dir_id获取它的 route hash name
    function get_route_hash(id){
        var recursive;
        // 将constants中定义的各虚拟目录的id取出来，生成快查map
        if(!route_hash_map){
            route_hash_map = {};
            recursive = function(map){
                var name, node, children;
                for(name in map){
                    if(map.hasOwnProperty(name)){
                        node = map[name];
                        route_hash_map[node.id] = name;
                        children = node.children;
                        if(children){
                            recursive(children);
                        }
                    }
                }
            };
            recursive(constants.VIRTUAL_DIRS);
        }
        
        var common_id = id.substring(8);
        if(route_hash_map.hasOwnProperty(common_id)){
            return route_hash_map[common_id];
        }
    }

    var file_node_from_cgi = {

        /**
         * CGI 返回的内容格式如下：
         *   {
         *       articles: [
         *          {
         *              ...
         *          }
         *       ],
         *       texts: [
         *          {
         *              ...
         *          }
         *       ],
         *       ...
         *   }
         * @param {Object} body CGI响应body
         * @param {FileNode} p_node 父目录
         */
        from_cgi: function (body, p_node) {
            var files = [];

            for (var p in body) {  // 遍历分组
                var arr = body[p] || e;

                if (arr instanceof Array) {
                    // window.console.log($.map(arr, function (a) { return a.msgid; }).join(', '));
                    for (var i = 0, l = arr.length; i < l; i++) {   // 遍历数据

                        for (var type in cgi_file_adapters) {              // 遍历适配器
                            var file = cgi_file_adapters[type](arr[i], p_node);    // 使用所有适配器尝试适配该文件
                            if (file) {
                                files.push(file);                   // 适配成功
                                break;                              // 退出适配器遍历
                            }
                        }
                    }
                }
            }
            return files;
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Object} obj CGI响应数据
         */
        vir_dir_from_cgi: function (obj) {
            var id = obj.dir_key;
            var options = {
                is_dir: true,
                is_vir_dir: true,
                route_hash : obj.route_hash || get_route_hash(id),
                id: id,
                name: obj['dir_name'],
                create_time: obj['dir_ctime'],
                modify_time: obj['dir_mtime'],
                icon: obj['dir_icon'],
                is_sortable: false
            };

            // 临时修复腾讯新闻显示为列表模式的bug - james
            if (options.name === '腾讯新闻') {
                obj['dir_data_type'] = 'picture';
            }

            var cgi_types = obj['dir_data_type'];
            if (cgi_types) {
                if (cgi_types.indexOf('picture') > -1) { // 包含图片
                    options.has_image = true;
                }
                if (cgi_types.indexOf('video') > -1) { // 包含视频
                    options.has_video = true;
                }
                if (cgi_types.indexOf('audio') > -1) { // 包含语音
                    options.has_voice = true;
                }
                if (cgi_types.indexOf('text') > -1) { // 包含文字
                    options.has_text = true;
                }
                if (cgi_types.indexOf('article') > -1) { // 包含文章w
                    options.has_article = true;
                }
            }
            return file_factory.create('FileNode', options);
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Object} obj CGI响应数据
         */
        vir_dir_from_cgi2: function (obj) {
            return this.vir_dir_from_cgi(obj);
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Array} arr CGI响应数据
         */
        vir_dirs_from_cgi: function (arr) {
            return map(arr, function (obj) {
                return this.vir_dir_from_cgi(obj);
            }, this);
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Array} arr CGI响应数据
         */
        vir_dirs_from_cgi2: function (arr) {
            return map(arr, function (obj) {
                return this.vir_dir_from_cgi2(obj);
            }, this);
        },

        /**
         * 将cgi返回的目录数据转换为FileNode实例
         * @param {Object} obj CGI响应数据
         */
        dir_from_cgi: function (obj) {
            var is_plain = !('dir_attr' in obj || 'file_attr' in obj);

            if (is_plain) {
                obj = {
                    is_dir: true,
                    id: obj['dir_key'],
                    name: obj['dir_name'],
                    create_time: obj['dir_ctime'],
                    modify_time: obj['dir_mtime']
                }
            } else {
                var attr = obj['dir_attr'];
                obj = {
                    is_dir: true,
                    id: obj['dir_key'],
                    name: attr['dir_name'],
                    create_time: obj['dir_ctime'],
                    modify_time: obj['dir_mtime']
                };
            }

            return file_factory.create('FileNode', obj);
        },

        /**
         * 将cgi返回的目录数据转换为FileNode实例
         * @param {Object} obj CGI响应数据
         */
        dir_from_cgi2: function (obj) {
            return file_factory.create('FileNode', {
                is_dir: true,
                id: obj['dir_key'],
                name: obj['dir_name'],
                create_time: obj['dir_ctime'],
                modify_time: obj['dir_mtime']
            });
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Array} arr CGI响应数据
         */
        dirs_from_cgi: function (arr) {
            return map(arr, function (obj) {
                return this.dir_from_cgi(obj);
            }, this);
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Array} arr CGI响应数据
         */
        dirs_from_cgi2: function (arr) {
            return map(arr, function (obj) {
                return this.dir_from_cgi2(obj);
            }, this);
        },


        /**
         * 将cgi返回的文件数据转换为FileNode实例
         * @param {Object} obj CGI响应数据
         */
        file_from_cgi: function (obj) {
            var is_plain = !('dir_attr' in obj || 'file_attr' in obj);

            if (is_plain) {
                obj = {
                    is_dir: false,
                    is_vir_dir: false,
                    id: obj['file_id'],
                    name: obj['file_name'],
                    size: parse_int(obj['file_size']) || 0,
                    cur_size: parse_int(obj['file_cur_size']) || 0,
                    create_time: obj['file_ctime'],
                    modify_time: obj['file_mtime'],
                    life_time:obj['file_life_time'],
                    belong_type:obj['belong_type'],
                    uin:obj['uin'],
                    nickname:obj['nickname'],
                    file_md5: obj['file_md5'],
                    file_sha: obj['file_sha'],
                    file_ver: obj['file_ver'],
                    file_note:obj['file_note']
                }
            } else {
                var attr = obj['file_attr'];
                obj = {
                    id: obj['file_id'],
                    name: attr['file_name'],
                    size: parse_int(obj['file_size']) || 0,
                    cur_size: parse_int(obj['file_cur_size']) || 0,
                    create_time: obj['file_ctime'],
                    modify_time: attr['file_mtime'],
                    life_time:obj['file_life_time'],
                    belong_type:obj['belong_type'],
                    uin:obj['uin'],
                    nickname:obj['nickname'],
                    file_md5: obj['file_md5'],
                    file_sha: obj['file_sha'],
                    file_ver: obj['file_ver'],
                    file_note:obj['file_note']
                };
            }

            return file_factory.create('FileNode', obj);
        },


        /**
         * 将cgi返回的文件数据转换为FileNode实例
         * @param {Object} obj CGI响应数据
         */
        file_from_cgi2: function (obj) {
            return file_factory.create('FileNode', {
                is_dir: false,
                is_vir_dir: false,
                id: obj['file_id'],
                name: obj['file_name'],
                size: parse_int(obj['file_size']) || 0,
                cur_size: parse_int(obj['file_curr_size']) || 0,
                create_time: obj['file_ctime'],
                modify_time: obj['file_mtime'],
                life_time:obj['file_life_time'],// 离线文件剩余时间
                belong_type:obj['belong_type'], // 离线文件 - 来自Ta - Ta类型
                uin:obj['uin'],                 // 离线文件 - 来自Ta - Ta的uin
                nickname:obj['nickname'],       // 离线文件 - 来自Ta - Ta的昵称
                file_md5: obj['file_md5'],
                file_sha: obj['file_sha'],
                file_ver: obj['file_ver'],
                file_note:obj['file_note'],
                tp_key: obj['tp_key'],
                tp_fail: obj['tp_fail']
            });
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Array} arr CGI响应数据
         */
        files_from_cgi: function (arr) {
            return map(arr, function (obj) {
                return this.file_from_cgi(obj);
            }, this);
        },

        /**
         * 将cgi返回的虚拟目录数据转换为FileNode实例
         * @param {Array} arr CGI响应数据
         */
        files_from_cgi2: function (arr) {
            return map(arr, function (obj) {
                return this.file_from_cgi2(obj);
            }, this);
        }
    };

    var map = function (arr, fn, context) {
        var ret = [], l;
        if (arr && (l = arr.length)) {
            for (var i = 0; i < l; i++) {
                var obj = fn.call(context, arr[i]);
                if (obj != null) {
                    ret[i] = obj;
                }
            }
        }
        return ret;
    };

    return file_node_from_cgi;
});