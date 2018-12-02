/**
 * 记录和获取页面状态
 */

var STATUS = {};    //用于存储页面状态的变量

var utils = require('./util');


exports.init = function () {
    //立即启动页面状态监听
    utils.on('pagestatuschange', function (path,value) {
        STATUS[path]= value;
    });

}

exports.get= function getResultStatus() {
    var result = {};
    // 把STATUS中没有在页面上显示的tab id 剔除出去
    for (var key in STATUS) {
        var value = STATUS[key]
        if (value instanceof Function) {
            value = value.call(value);
        }
        if(value!=null){
            result[key] = value;
        }
    }
    return result;
}
