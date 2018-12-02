/**
 * 用于全局的事件注册与触发
 */
var EVENTS = {};      //事件容器
var arraySlice = Array.prototype.slice;

/**
 * @param  {String} event 事件名
 * @param  {Function} handler 回调
 */
exports.on = function(event, handler) {
    var cbs = EVENTS[event] || (EVENTS[event] = []);
    cbs.push(handler);
};
exports.removeListener = function(event, handler) {
    var cbs = EVENTS[event] || (EVENTS[event] = []);
    var idx = cbs.indexOf(handler);
    idx >=0 && cbs.splice(idx,1);
};

/**
 * 手动触发事件
 * @param  {String} event 事件名
 */
exports.emit = function(event) {
    var cbs = EVENTS[event];
    var args = arraySlice.call(arguments, 1);
    // 循环执行事件
    for(var i=0, len=cbs && cbs.length; i<len; i++) {
        var cb = cbs[i];
        cb.apply(null, args);
    }
};
/**
 * 兼容的dom事件注册函数
 */
exports.addEvent = window.addEventListener ? function (target, event, handler) {
    //console.log(arguments);
    return target.addEventListener(event, handler, false);

    //IE8 下需要特殊处理
} : function (target, event, handler) {
    //console.log(target.nodeName,event,handler);
    // IE8 window 绑定click不生效修复
    if (target === window && (event === 'click' || event === 'mousemove' || event === 'keyup')) {
        target = document;
        // IE8 DOMContentLoaded事件修复
    } else if (event === 'DOMContentLoaded') {
        event = 'load';
    }

    return target.attachEvent('on' + event, function () {
        var event = window.event;
        var scrollBox = scroll();
        var eventObj = {
            // 重新构建一个event
            pageX : event.clientX + scrollBox.left,
            pageY : event.clientY + scrollBox.top,
            target : event.srcElement || document
        };
        for(var n in  event){
            eventObj[n] = event[n]
        }
        return handler.call(this, eventObj);
    });
};

exports.pageSize = pageSize;
exports.scroll = scroll;
exports.screen = screen;
exports.viewSize = viewSize;
exports.nextTick = nextTick;
exports.generateId = generateId;
exports.findCookie = findCookie;
exports.setCookie = setCookie;



function scroll() {
    var doc = document.documentElement;
    var body = document.body;
    return {
        left: doc.scrollLeft || body.scrollLeft,
        top: doc.scrollTop || body.scrollTop
    };
};


/**
 * 获取文档高度
 */
function pageSize() {
    var docElem = document.documentElement;
    var body = document.body;
    return {
        width: Math.max(docElem.clientWidth,
            body.scrollWidth, docElem.scrollWidth,
            body.offsetWidth, docElem.offsetWidth),
        height: Math.max(docElem.clientHeight,
            body.scrollHeight, docElem.scrollHeight,
            body.offsetHeight, docElem.offsetHeight)
    };
};

/**
 * 获取屏幕分辨率
 */
function screen() {
    return {
        width: window.screen.width,
        height: window.screen.height
    };
}
/**
 * 获取视口高度
 */
function viewSize() {
    var docElem = document.documentElement;
    return {
        width: docElem.clientWidth,
        height: docElem.clientHeight
    };
}
/**
 * 生成唯一ID
 */
function generateId(len) {
    var buf = [(+new Date()).toString(36)];
    var i = buf[0].length+1;
    len = len|| 16
    while(i<len){
        var item = Math.random().toString(36).slice(2);
        i+=item.length;
        buf.push(item)
    }
    return buf.join('').slice(0,len);//.replace(/\w/g,randomUpper)
}
// function randomUpper(a){
//     //return (i^a.charCodeAt()) &1?a.toUpperCase():a;
//     return Math.random()>.5?a.toUpperCase():a
// }
function findCookie(key){
    return document.cookie.replace(/([^=]+)(?:=([^;]*);?\s*)?/g,function(a,k,v){
        //timestemp-random:inc
        return k == key?v:'';
    });
}
function setCookie(key,value,offsetMS){
    //utils.generateId()+':'+inc;
    document.cookie = key+'='+value+
        '; expires='+new Date(+new Date+offsetMS).toGMTString()+//永久有效
        '; domain='+getRootDomain()+
        '; path=/';
}
/**
 * 获取当前域名的baseURI
 * bees.xidea.org => xidea.org;
 * www.xidea.org => xidea.org;
 * xidea.org=>xidea.org;
 * www.xidea.org.cn=>xidea.org.cn;
 * xidea.org.cn=>xidea.org.cn;
 */
function getRootDomain() {
    var host = location.host;
    var dPattern = /[^\.]+\.(?:(?:net|com|gov|org)\.\w{2}|[^\.]+)$/;
    var matches = dPattern.exec(host);
    if (matches) {
        return matches[0];
    } else {
        return '';
    }
}

/**
 * 将fn推到执行栈末尾执行
 */
function nextTick(fn) {
    var args = arraySlice.call(arguments, 1);
    setTimeout(function() {
        fn.apply(null, args);
    }, 0);
}
