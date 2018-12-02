/**
 * @authors       gebilaoxiong
 * @date          2016-11-25 15:50:20
 * @description   DOM事件封装
 */

var Event = require('./event'),

  util = require('./utils'),

  cache = {},

  elemProp = 'bees_' + (new Date()).valueOf(),

  uid = 0,

  events = {},
  
  addEvent, removeEvent;



/**
 * 订阅元素事件
 */
events.bind = function (elem, types, handler, context) {
  var me = this,
    elemUid = getElementUid(elem),
    elemCache, eventHandler, i,
    len, type, handlers;

  // 获取元素的缓存
  if (!(elemCache = cache[elemUid])) {
    elemCache = cache[elemUid] = {};
  }

  // 事件委托
  if (!(eventHandler = elemCache.eventHandler)) {
    eventHandler = elemCache.eventHandler = function () {
      events.dispatch.apply(elem, arguments);
    }
  }

  // 拆分事件名称
  if (util.isString(types)) {
    types = types.split(/\s+/);
  }

  // 注册事件
  for (i = 0, len = types.length; i < len; i++) {
    type = types[i];
    handlers = elemCache[type] || (elemCache[type] = []);

    handlers.push({
      type: type,
      handler: handler,
      context: context || elem,
    });

    addEvent(elem, type, eventHandler);
  }
};


/**
 * 解除事件绑定
 */
events.unbind = function(){

};


/**
 * 事件派发
 */
events.dispatch = function (event) {
  var elem = this,
    elemUid = getElementUid(elem),
    elemCache, handlers, i,
    len, handlerObj;

  // 缓存不存在 不处理
  if (!(elemCache = cache[elemUid])) {
    return;
  }

  // 没有订阅过事件
  if (!(handlers = elemCache[event.type])) {
    return;
  }

  // 修复事件对象
  event = Event.fix(event || window.event);

  // 依次调用缓存中的事件
  for (
    i = 0, len = handlers.length;
    i < len && !event.isImmediatePropagationStopped();
    i++
  ) {
    handlerObj = handlers[i];
    handlerObj.handler.call(handlerObj.context, event);
  }
};

/**
 * 绑定dom事件
 */
addEvent = document.addEventListener ?

  function (elem, event, handler) {

    elem.addEventListener(event, handler, false);
  } :

  function (elem, event, handler) {
    // 单独处理IE8 下click的绑定问题，只能绑在document上
    if(elem === window && event === 'click') {
      document.attachEvent('on' + event, handler);
      return;
    }
    elem.attachEvent('on' + event, handler);
  };


/**
 * 解除事件绑定
 */
removeEvent = document.removeEventListener ?

  function (elem, event, handler) {
    elem.removeEventListener(event, handler, false);
  } :

  function (elem, event, handler) {
    elem.detachEvent('on' + event, handler);
  };


/**
 * 获取元素的唯一ID
 * @param {any} elem
 * @returns
 */
function getElementUid(elem) {

  if (!(elemProp in elem)) {
    elem[elemProp] = uid++;
  }

  return elem[elemProp];
}

module.exports = events;