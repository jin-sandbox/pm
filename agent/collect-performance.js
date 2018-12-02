/**
 * 性能数据搜集
 * @author zhouxuan 2016.12.16
 * @author jindw
 */

var utils = require('./util');

var viewHeight;       // 用于获取首屏时间的变量
var imgEndTime ;
var firstPaint;

exports.init= function () {
    viewHeight = utils.viewSize().height;
    // 单独获取首屏时间，用作备用，在没有外部api进行传值的时候，以备用值作为首屏时间

    //自主通过图片获取首屏时间

    //DOMContentLoaded ie9
    //ie8??
    utils.addEvent(window, 'DOMContentLoaded', function () {
        //domLoadTime = (new Date()).getTime();
        countFirstScreenTime();
    });
    //init onload unload
    var report = 1;
    function reportOnce() {
        if(report){
            utils.nextTick(sendData);
            report = 0;
        }
    }
    utils.addEvent(window, 'load', reportOnce);
    utils.addEvent(window, 'unload',reportOnce );////提前终止上报，开启部分上报
};


/**
 * 判断图片是否在首屏中
 * @param img {dom}
 */
function isInViewport(img) {
    var top = img.getBoundingClientRect().top;
    // 如果top在首屏高度内
    return top < viewHeight;
}
function collectInViewEL(el,result){
    if(isInViewport(el)){
        result.push(el);
        var child = el.firstChild;
        while(child){
            collectInViewEL(child,result);
            child = child.nextSibling;
        }
    }
    return result;
}
/**
 * 通过对传入的图片的load事件进行捕获，计算time;
 */
function countFirstScreenTime() {
    var inViews = collectInViewEL(document.body,[]);   //nodeList
    for (var i = 0, len = inViews.length; i < len; i++) {
        var v = inViews[i];
        if(v.nodeName.toLowerCase() != 'img'){
            var img = getComputedStyle(v,'background-image');
            v = null;
            if(img && img!="none"){
                v = new Image();
                v.src = img.replace(/url\((.+)\)/,'$1')
            }
        }
        v && utils.addEvent(v, 'load', function () {
            imgEndTime = (new Date()).getTime();
        });
    }
}

function sendData() {
    var timing = {}, memory = {}, n;
    try {
        var nativeTiming = performance.timing;
        var nativeMemery = performance.memory;
        for (n in nativeMemery) { memory[n] = nativeMemery[n] }
        for (n in nativeTiming) { timing[n] = nativeTiming[n] }
    }catch (e) {
        console.warn(e);
    }
    try {
        // 非chrome，且非ie9+， 无法获取白屏时间
        firstPaint = Math.round(nativeTiming.msFirstPaint || chrome.loadTimes().firstPaintTime * 1000 || 0);
        // 设置首屏时间
        var firstScreen = initFirstScreenTime();
    } catch (e) {
        console.warn(e);
    }
    var performanceData = {
        firstScreen: firstScreen || 0,
        firstPaint: firstPaint || 0,
        timing: timing ,
        memory: memory
    }

    utils.emit('performance', performanceData)

}


function getComputedStyle(el,key){
    var style = el.currentStyle;
    return style ? style[key]: document.defaultView.getComputedStyle(el,null).getPropertyValue(key);
}

/**
 * 设置首屏时间，用于发送
 * TODO:背景图片载入问题
 */
function initFirstScreenTime() {
    return imgEndTime;
}

