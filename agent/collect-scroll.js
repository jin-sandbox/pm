/**
 * 滚屏数据搜集
 */
var utils=require('./util')    // 工具集合
var status = require('./status') // 页面状态

var DEACTIVE_TIME = 8000;


// 用户是否为激活状态（文档可见）
var active=true;

// 用于定时将用户状态设置为非激活
var deactiveTimer;


/**
 * 开始滚屏时间
 */
var scrollBeginTime=0;
// 是否在滚动中
var scrolling = false;

//in updating action(startScrolling || endScrolling)
//var newAction=false;


// 用于判断scrolling的计时器
var scrollingTimer;

// 用户上次触发mousemove时候鼠标的位置（设置这个是因为chrome每隔几秒会手动触发mousemove）
var latestMousePos;

// 开始监听状态变化
exports.init= function startWatch() {
    // 监听body的scroll事件，用于设置scrolling
    utils.addEvent(window, 'scroll', function() {
        scrollHandler();
    });

    // 绑定mousemove
    utils.addEvent(window, 'mousemove', function(e) {
        var pos = e.pageX + '-' + e.pageY;
        if(latestMousePos === pos)  return;
        latestMousePos = pos;
        activeUser();
    });

    // 绑定keyup
    utils.addEvent(window, 'keyup', function() {
        activeUser();
    });


    // 监听scrolling变化，在这个状态变化的时候搜集数据
    utils.on('scrollchange', function(scrolling) {
        update(!scrolling);
    });




    // 检测用户是否为active状态(文档可见)
    // 绑定visibilitychange
    /*
     Feature	Chrome (Webkit)	Firefox (Gecko)	Internet Explorer	Opera	Safari (WebKit)
     Basic support	13 webkit	10 (10) moz
     18 (18)	10 ms	12.10[*]	未实现
     */
    utils.addEvent(window, 'visibilitychange', function() {
        if(document.hidden) {
            deactiveUser();
        } else {
            activeUser();
        }
    });
    // 监听active变化,在这个状态变化的时候搜集数据
    utils.on('activechange', function(active) {
        update(active);
    });
    // 用于检测用户的激活状态, 设置active
    // 初始化的时候进行一次触发
    utils.emit('activechange', active);
    // utils.emit('scrollingchange', scrolling);

}


/**
 * 激活用户状态
 */
function activeUser() {
    // 如果原来的状态是非激活，直接置为激活
    if(!active) {
        active = true;
        utils.emit('activechange', active);
    }

    // 定时将用户状态切换为deactive
    if(deactiveTimer) {
        window.clearTimeout(deactiveTimer);
    }

    deactiveTimer = setTimeout(function() {
        deactiveUser();
    }, DEACTIVE_TIME);
}

function deactiveUser() {
    if(active ) {
        active = false;
        utils.emit('activechange', active);
    }
}


function scrollHandler() {
    // 如果不是滚动状态，立刻置为滚动状态

    if(!scrolling){
        scrolling = true;
        utils.emit('scrollchange', scrolling);
        activeUser();
    }
    //如果有计时器，短路，避免频繁刷新
    scrollingTimer = scrollingTimer || setTimeout(function() {
        scrollingTimer = null;
        if(scrolling) {
            scrolling = false;
            utils.emit('scrollchange', scrolling);
        }
    }, 1000);
}
/**
 * 当condition为true的时候开启计时，false关闭计时
 * 在同一条执行栈上不会重复触发
 */
function update(enabledOrScrolled) {
    //console.log('update:', enabledOrScrolled,newAction)
    var action = enabledOrScrolled?startScrolling:endScrolling;
    utils.nextTick(action);
}

/**
 * 开始计时
 */
function startScrolling() {
    if(scrollBeginTime) return;
    scrollBeginTime = +new Date();
}
/**
 * 结束计时
 */
function endScrolling() {
    //console.log('endScrolling:', scrollBeginTime)
    if(scrollBeginTime) {

        var end = +new Date();
        var time = end - scrollBeginTime;
        scrollBeginTime = 0;
        collect(time);
    }
}


/**
 * 搜集滚屏数据然后触发事件
 */
function collect(time) {
    if(time === '0.0') return;
    var top = utils.scroll().top;
    var bottom = top + utils.viewSize().height;

    var pageStatus = status.get();
    var result = {
        top:top,
        bottom:bottom,
        pageStatus:pageStatus,
        time: time
    };

    // 行为数据会进行统一转换json

    utils.emit('behavior', 'scroll',result);
}





