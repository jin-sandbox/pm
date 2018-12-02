/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-11-23 09:50:33
 * @description   元素操作
 */

var Abstract = require('./abstract'),

  events = require('./events'),

  dom = require('./dom'),

  Element;


/**
 * 元素操作
 */
Element = module.exports = Abstract.extend({

	/**
	 * 元素
	 */
  elem: undefined,

	/**
	 * 初始化,只支持单个元素选择
	 */
  init: function (elem) {
    var me = this;

    if(isDOM(elem)) {
      me.elem = elem;
    } else if(typeof elem === 'string') {
      me.elem = document.querySelector(elem);
    } else {
      throw new Error('初始化参数有误，请传入选择器或者dom对象');
    }
  },

  getElement: function() {
    return this.elem;
  },

  
  /*
   * 是否是Element类
   */
  isElement: function(elem) {
    return elem instanceof Element;
  },

	/**
	 * 订阅事件
	 */
  bind: function (types, handler, scope) {
    var elem = this.elem;

    events.bind(elem, types, handler, scope);
  },

  /**
   * 取消订阅事件
   */
  unbind: function(type, handler) {
    var elem = this.elem;

    events.unbind(elem, type, handler);
  },

  
  /**
   * 类似jq CSS 操作
   * @param  {} key
   * @param  {} value
   */
  css: function(key, value) {
    var elem = this.elem,
        len = arguments.length,
        _this = this,
        style;
    
    if(len === 1) {
      if(window.getComputedStyle) {
        style = window.getComputedStyle(elem,null);
      } else {
        style = elem.currentStyle;
      }

      return style[key];

    } else if(len === 2) {
      style = elem.style;
      style[key] = value;

      return _this;
    }
  },


  appendTo: function(target) {
    var parent = this.isElement(target) ? target.getElement() :
                                             target; 
                                              
    parent.appendChild(this.getElement());

    return this;
  },


  append: function(target) {
    var child = this.isElement(target) ? target.getElement() :
                                         target;

    this.getElement().append(child);

    return this;
  },


  
  /**
   * 添加类名
   * 注意：没有对IE8作兼容，考虑到本方法只会在数据查看页使用
   * @param  {string} className  类名
   */
  addClass: function(className) {
    var elem = this.getElement();

    elem.classList.add(className);

    return this;
  },


  /**
   * 判断该元素是否含有className
   * 注意：没有兼容IE8
   * @param  {string} className
   * @return {Boolean} 
   */
  hasClass: function(className) {
    var elem = this.getElement();

    return elem.classList.contains(className);
  },


  /*
   *获取元素自身的宽高
   *@param {Boolean} hasUnit 是否需要单位
   */
  size: function(hasUnit) {
    var elem = this.getElement(),
        size = dom.getOwnSize(elem);  //无单位

    return {
      width: hasUnit ? (size.width + 'px') : size.width,
      height: hasUnit ? (size.height + 'px') : size.height
    };
  },

  /*
   *获取元素相对于左上角的偏移量
   *@param {Boolean} hasUnit 是否需要单位
   */
  offset: function(hasUnit) {
    var elem = this.getElement(),
        offset = dom.offset(elem);    //无单位

    return {
      left: hasUnit ? (offset.left + 'px') : offset.left,
      top: hasUnit ? (offset.top + 'px') : offset.top
    };
  },


  text: function(text) {
     var elem = this.getElement();

     elem.innerHTML = text;

     return this;
  },

  /**
   * 判断元素是否可见,直接通过自身size来判断
   */
  isHidden: function() {
    var size = this.size();

    return (size.width === 0 || size.height === 0) || this.css('visibility') === 'hidden';
  }

});


/**
 * 判定obj是否为dom对象
 */
function isDOM(obj) {
  return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}



