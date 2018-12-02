
/**
 * 用于存储全局需要用到的模块
 */
var _global = {
  dom: require('./lib/dom'),

  utils: require('./lib/utils'),

  bees: window.bees,

  Abstract: require('./lib/abstract'),

  Element: require('./lib/element'),

  Emitter: require('./lib/emitter'),

  token: '__BEES__MESSAGE__TOKEN__'
};


/**
 * 使用到的模块
 */
var statusM = require('./status'),

    viewportStatusM = require('./viewport-status'),

    linkmapM = require('./linkmap'),

    keyM = require('./keyboard'),

    tabselectM = require('./tabselect');


// 开始监听全局状态变化
statusM.launch(_global);

// 开始监听键盘事件
keyM.launch(_global);

// 初始化linkmap模块
linkmapM.init(_global);

// 初始化tabselect模块
tabselectM.init(_global);

viewportStatusM.init(_global);

/**
 * 监听message事件，并对父窗口的指示作相应的反应
 */
window.addEventListener('message', function(e) {
  var data = e.data;

  // 未通过验证
  if(data.token !== _global.token) return;

  var action = data.action;

  // action是linkmap相应指示
  if(action.indexOf('linkmap') > -1) {
    linkmapM.handle(e);
  
  // action是tabselect的相应处理
  } else if(action.indexOf('cover') > -1) {
    tabselectM.handle(e);

  // 父窗口传过来的获取视口范围内的状态列表
  } else if(action === 'viewportstatus') {
    viewportStatusM.handle(e);
  }
});

module.exports = {};


