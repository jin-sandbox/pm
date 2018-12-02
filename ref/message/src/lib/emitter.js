/**
 * @authors       gebilaoxiong
 * @date          2016-11-24 14:22:05
 * @description   观察者模式
 */
var Abstract = require('./abstract'),

  util = require('./utils'),

  arraySlice = Array.prototype.slice,

  Emitter;


Emitter = module.exports = Abstract.extend({

  /**
   * 初始化
   */
  init: function (config) {
    var me = this,
      events;
    
    config = config || {}

    // 事件缓存
    me.events = {};
    events = config.events;

    if (events) {
      me.bind(events);
    }
  },

  /**
   * 绑定事件
   */
  bind: function (eventNames, handler, context) {
    var me = this,
      cache = me.events,
      event, i, len,
      handlers;

    // 如果是对象
    if (util.isObject(eventNames)) {
      // 上下文
      context = eventNames.context;
      delete eventNames.context;

      for (event in eventNames) {
        me.bind(event, eventNames[event], context);
      }
      return;
    }

    // 如果是字符串 拆开
    if (util.isString(eventNames)) {
      eventNames = eventNames.split(/\s+/);
    }

    // 依次绑定
    for (i = 0, len = eventNames.length; i < len; i++) {
      event = eventNames[i];
      handlers = cache[event] || (cache[event] = []);

      handlers.push({
        handler: handler,
        context: context || me
      });
    }
  },

  /**
   * 解除绑定
   */
  unbind: function (eventName, handler) {
    var me = this,
      handlers = me.events[eventName],
      handleObj, index;

    if (!handlers) {
      return;
    }

    // 如果传入了handler
    if (handler) {
      index = handlers.length;

      while (index--) {
        handleObj = handlers[index];
        // 从数组中移除
        if (handleObj.handler === handler) {
          handlers.splice(index);
        }
      }
      
    }
    // 移除所有事件
    else {
      handlers.length = 0;
    }

    // 如果数组为空
    if (!handlers.length) {
      delete me.events[eventName];
    }
  },

  /**
   * 触发事件
   */
  emit: function (eventName) {
    var me = this,
      handlers = me.events[eventName],
      args, i, len,
      handleObj, context;

    if (!handlers) {
      return;
    }

    args = arraySlice.call(arguments, 1);

    for (i = 0, len = handlers.length; i < len; i++) {
      handleObj = handlers[i];
      context = handleObj.context || me;
      handleObj.handler.apply(context, args);
    }
  }
});