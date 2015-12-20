define(function () {
    return {

        // 重新指定合并后文件的存放目录
        // #1
        dir: '../../dest/',

        // 合并JS、HTML模板文件
        all: {
            // 重新指定合并后的文件名
            name: 'mod_1.js',
            // 替换引用文件(../index.html)中的引用，请参考 index.html 中相应示例
            versionControllKey: '@mod_1@',
            // 将文件版本号输出到该文件中(相对 #1 处指定dir的的路径 )
            versionControll: ['../index.html'],
            // 手动指定版本号（不写则使用当前系统时间作为文件版本）
            ver: '140401',
            // 是否启用代码压缩
            uglify: true,
            create: true
        },

        // 合并JS文件（可选）
        js: {
            name: 'mod_1_js.js',
            create: true
        },

        // 合并模板文件（可选）
        tmpl: {
            name: 'mod_1_tmpl.js',
            versionControllKey:'@mod_1_tmpl@',
            versionControll:['../index.html'],
            create: true
        }
    }
});
