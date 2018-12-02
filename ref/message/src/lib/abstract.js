/**
 * @authors       gebilaoxiong
 * @email         gebilaoxiong@gmail.com
 * @date          2016-11-23 09:50:33
 * @description   抽象类型
 */

var util = require('./utils'),

  hasOwnProperty = Object.hasOwnProperty,

  Abstract;


Abstract = module.exports = function () { };


/**
 * 继承扩展
 */
Abstract.extend = function (extendOptions) {
  var Base = this,
    proto;

  // 派生类型构造函数
  function klass() {
    var me = this;
    me.init && me.init.apply(me, arguments);
  }

  // 定义派生类原型
  if (!Object.create) {
    util.noop.prototype = Base.prototype;
    proto = new util.noop();
  } else {
    proto = Object.create(Base.prototype);
  }

  proto.constructor = klass;
  klass.prototype = proto;


  // 扩展原型
  if (extendOptions) {
    extendPrototype(proto, extendOptions);
  }

  // api
  klass.extend = Base.extend;

  return klass;
};


/**
 * 扩展原型
 */
function extendPrototype(proto, extendOptions) {
  var prop, propValue;

  for (prop in extendOptions) {

    // hasOwnProperty
    if (!hasOwnProperty.call(extendOptions, prop)) {
      continue;
    }

    propValue = extendOptions[prop];

    // 特殊处理函数
    if (
      util.isFunction(proto[prop]) &&
      util.isFunction(propValue)
    ) {
      // 包裹一下
      proto[prop] = (function (source, parent) {
        return function () {
          var me = this,
            temp = me.parent,
            result;

          me.parent = parent;
          result = source.apply(me, arguments);
          me.parent = temp;

          return result;
        };
      })(propValue, proto[prop]);
    }
    // 处理属性
    else {
      proto[prop] = extendOptions[prop];
    }

  }
};