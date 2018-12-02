/**
 * 点击数据 搜集
 */
var utils=require('./util')    // 工具集合
var status = require('./status') // 页面状态



exports.init= function() {
    utils.addEvent(window, 'click', clickHandler);
}


function clickHandler(e) {
    var pageSize = utils.pageSize();
    var scroll = utils.scroll();
    var inner = utils.viewSize();
    var href = getAlinkHref(e.target);
    var pageStatus = status.get();
    //连接点击需要立即发送
    var immediate = !!href;


    // 填装要发送的数据
    var result = {
        // 点击的坐标距离中轴的偏移量
        x: Math.round(e.pageX - pageSize.width/2),
        // 点击的元素距离文档顶部的偏移量
        y: Math.round(e.pageY),
        // 滚动纵轴偏移量
        scrollTop: Math.round(scroll.top),
        // 滚动横轴偏移量
        scrollLeft: Math.round(scroll.left),
        // 视口宽度
        innerWidth: Math.round(inner.width),
        // 视口高度
        innerHeight: Math.round(inner.height),
        // 文档宽度
        pageWidth: Math.round(pageSize.width),
        // 文档高度
        pageHeight: Math.round(pageSize.height),

        pageStatus: pageStatus,
    };
    // focusArea 处理 todo
    // var focusArea = ？？;
    // 如果是a标签或者是包含在a标签中的标签，加传href
    if(href) {
        result.href = href;
    }
    //命名区域, data-focus-area=“name”
    //if(focusArea){
    //    result.focusArea = focusArea;
    //}
    // 触发数据搜集事件
    //　行为数据会进行统一转json
    utils.emit('behavior', 'click', result,immediate);
}

//exports.getHref = getHref
/**
 * 递归获取元素自身或者父辈（如果他们是a标签的话）的href
 */
exports.getAlinkHref =getAlinkHref
/**
 * 返回指定元素所在连接地址
 */
function getAlinkHref(elem) {
    //如果该标签为body或者html直接返回''
    var nodeName = elem.nodeName.toLowerCase();
    if (nodeName =='input') {  //该标签就是a标签
        //
    }else if (nodeName =='a') {  //该标签就是a标签
        return getHref(elem);
    } else if(nodeName === 'body' || nodeName === 'html'){      //该标签不是a标签，递归判断其父元素
        var parent = elem.parentNode;
        if (parent) {
            return getAlinkHref(parent);
        }
    }
}

function getHref(elem) {
    var href = elem.getAttribute('href');
    // 过滤掉 href='javascript:void(0)' 或者 href='###'
    //if (href.indexOf('javascript') > -1 || /#$/.test(href)) {
    //    return '';
    //}
    return href;
}

