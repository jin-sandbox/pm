/**
 * 数据的发送
 */
var utils = require('./util');
var behaviorData;
/**
 * 用于存储数据的队列
 */
var BEHAVIOR_BUF_SIZE = 4;

var version, url;

var deviceId ;
var requestId ;
var fromId;
var behaviorCount =0;
var sendedBehaviorCount = 0;
var initTime = new Date;
var visitFromKey = '__BEEHIVE_FROM'
var idStroageKey = '__BEEHIVE_ID';

initRequestId();
/**
 * 初始化设备ID和请求计数，没有就生成一个
 */
function initRequestId() {
    var v= decodeURIComponent(utils.findCookie(idStroageKey)).split(':');
    requestId = ++v[1]||0;//首次 ==0
    deviceId = requestId?v[0]:utils.generateId();
    fromId = utils.findCookie(visitFromKey);

    // deviceId = deviceId.replace(/\w/g,function replacer(c,i){
    //     return (((c.charCodeAt() + i) ^ requestId) & 4)?c.toUpperCase():c;
    // });
    utils.setCookie(idStroageKey,deviceId+':'+requestId,0xFFFFFFFFFFF);

}
exports.init =function(reportURL,agentVersion){
    // 在queue满了之后会触发behaviorSend事件，这个时候进行数据发送
    // utils.on('behavior', handleBehaviorData);
    url = reportURL;
    version = agentVersion;
    //queue.init();
    resetBehaviorData();
    registerEvent();
}



/**
 * 注册各个搜集数据对应的事件
 */
function registerEvent() {
    //　访问数据 access 的处理
    utils.on('access', handleAccessData);
    // performance数据的处理
    utils.on('performance', handlePerformanceData);
    // click ,scroll 数据的处理
    //report rate check
    utils.on('behavior', handleBehaviorData);
    utils.addEvent(window,'unload',onCloseReport)
}
/**
 * 重置behavior 数据
 */
function resetBehaviorData(){
    behaviorData = {
        click: [],
        scroll: []
    }
}
/**
 * 处理访问数据
 * @param data
 */
function handleAccessData(data) {
    //add from id
    data.fromId = fromId;
    send(data, 0);
}
/**
 * 处理性能数据
 */
function handlePerformanceData(data) {
    send(data, 1);
}

/**
 * 统一处理行为数据(click和scroll)
 * @param {String} type 'click' | 'scroll'
 * @param {Object} data 数据
 * @param {Boolean} immediate 是否是立即发送
 */
function handleBehaviorData(type,data, immediate) {
    //update from id
    //console.log('handleBehaviorData:',data,type,immediate)
    if(data && addBehaviorItem(type,data)-sendedBehaviorCount>BEHAVIOR_BUF_SIZE || immediate) {
        utils.setCookie(visitFromKey,requestId,300);//300 毫秒有效（click=>immediate）
        sendBehaviorData();
    }
}

/**
 * 添加行为数据到队列
 * @param  {String} type 'click' | 'scroll'
 * @param  {Object} data
 */
function addBehaviorItem(type,data) {
    //console.log(type,data,behaviorData)
    var list = behaviorData[type];
    list.push(data);
    //如果队列满了，触发behaviorSend事件
    return ++behaviorCount;
}

/**
 * 发送行为数据
 */
function sendBehaviorData() {
    //行为数据统一转为json
    send(behaviorData, 2);
    sendedBehaviorCount = behaviorCount;
    resetBehaviorData();
}
function onCloseReport(){
    behaviorData.leave = {
        time:new Date()-initTime,
        action: behaviorCount
    }
    sendBehaviorData();
}
/**
 * 发送数据的基础方法
 * @param type 0:访问数据 1:性能数据 2:行为数据
 */
function send(data, type) {
    // var api = buildURL(url,type,data);
    // //发送数据，以image加载的方式
    // var img = new Image();
    // img.src = api;
    new Image().src = buildURL(url,type,data);
}


/**
 * 设置基础参数(deviceId, type, path)
 */
function buildURL(url,type,data) {
    //var userId = cookie.get('userid');
    return [url,url.match(/\?/)?'&':'?',
        'type=',type,
       '&deviceId=',deviceId,
       '&requestId=',requestId,
       '&path=',encodeURIComponent(getPath()),
       '&version=',version,
       '&time=',+new Date,
       '&data=',encodeURIComponent(JSON.stringify(data)),
        ].join('');
};


/**
 * 获取页面路径
 */
function getPath() {
    return location.href;
}

