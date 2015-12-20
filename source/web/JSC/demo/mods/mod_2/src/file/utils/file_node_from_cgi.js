/**
 *  从CGI返回结果中获取文件信息转换为文件对象
 * @author jameszuo
 * @date 13-6-27
 */
define(function (require, exports, module) {

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