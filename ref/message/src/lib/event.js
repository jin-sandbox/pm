/**
 * @authors       gebilaoxiong
 * @date          2016-11-25 17:47:28
 * @description   事件对象
 */
var Abstract = require('./abstract'),

  util = require('./utils'),

  remptyText = /\s+/g,

  Event;


Event = module.exports = Abstract.extend({

  /**
   * 初始化
   */
  init: function (src) {
    var me = this;

    me.originalEvent = src;
    me.type = src.type;

    me.isDefaultPrevented = src.defaultPrevented || src.returnValue === false ?
      returnTrue : returnFalse;
  },

  /**
   * 是否阻止了默认行为
   */
  isDefaultPrevented: returnFalse,

  /**
   * 是否阻止了事件冒泡
   */
  isPropagationStopped: returnFalse,

  /**
   * 是否立即停止事件冒泡
   */
  isImmediatePropagationStopped: returnFalse,

  /**
   * 阻止事件默认行为
   */
  preventDefault: function () {
    var me = this,
      event = me.originalEvent;

    me.isDefaultPrevented = returnTrue;

    if (event && event.preventDefault) {
      event.preventDefault();
    } else {
      src.returnValue = false;
    }
  },

  /**
   * 停止事件冒泡
   */
  stopPropagation: function () {
    var me = this,
      event = me.originalEvent;

    me.isPropagationStopped = returnTrue;

    if (event && event.stopPropagation) {
      event.stopPropagation();
    } else {
      src.cancelBubble = true;
    }
  },

  /**
   * 立即停止事件冒泡
   */
  stopImmediatePropagation: function () {
    var me = this,
      event = me.originalEvent;

    me.isImmediatePropagationStopped = returnTrue;

    if (event && event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    }

    me.stopPropagation();
  }

});


var props = (
  "attrChange attrName relatedNode srcElement " +
  "altKey bubbles cancelable ctrlKey currentTarget " +
  "eventPhase metaKey relatedTarget shiftKey target " +
  "timeStamp view which").split(remptyText),

  rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,

  // 修复钩子
  fixHooks = {},

  // 鼠标事件修复
  mouseHooks;


/**
 * 鼠标事件修复
 */
mouseHooks = {

  /**
   * 修复的属性
   */
  props: ("button buttons clientX clientY " +
    "fromElement offsetX offsetY pageX " +
    "pageY screenX screenY toElement").split(remptyText),

  /**
   * 修复方法
   */
  fix: function (event, original) {
    var fromElement = original.fromElement,
      button = original.button,
      eventDoc, doc, body;

    if (event.pageX == null && original.clientX != null) {
      eventDoc = event.target.ownerDocument;
      doc = eventDoc.documentElement;
      body = eventDoc.body;

      event.pageX = original.clientX + (doc.scrollLeft || body.scrollLeft);
      event.pageY = original.clientY + (doc.scrollTop || body.scrollTop);
    }

    // relatedTarget
    if (!event.relatedTarget && fromElement) {
      event.relatedTarget = fromElement === event.target ?
        original.toElement : fromElement;
    }

    // 统一鼠标按键
    if (!event.which && button !== undefined) {
      event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
    }

    return event;
  }
};


util.each((
  "blur focus focusin focusout load resize scroll unload click dblclick " +
  "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
  "change select submit keydown keypress keyup error contextmenu"
).split(/\s+/), function (event) {
  if (rmouseEvent.test(event)) {
    fixHooks[event] = mouseHooks;
  }
});

/**
 * 校正浏览器事件对象兼容性
 */
Event.fix = function (original) {
  var event = new Event(original),
    type = event.type,
    hook = fixHooks[type] || {},
    copy = props,
    i, prop;

  // 合并事件的特殊属性
  if (hook.props) {
    copy.concat(hook.props);
  }

  // 复制original上的属性
  for (i = copy.length; i;) {
    prop = copy[--i];
    event[prop] = original[prop];
  }

  // 修复事件源
  if (!event.target) {
    event.target = original.srcElement || document;
  }

  // 如果节点为文本节点
  if (event.target.nodeType === 3) {
    event.target = event.target.parentNode;
  }

  // 特殊事件修复
  if (hook.fix) {
    event = hook.fix(event, original);
  }

  return event;
}


/**
 * 返回 true 值
 */
function returnTrue() {
  return true;
}

/**
 * 返回 false 值
 */
function returnFalse() {
  return false;
}