/**
 * @authors       gebilaoxiong
 * @date          2016-11-23 11:01:13
 * @description   工具函数
 */

var toString = Object.prototype.toString,

  hasOwnProperty = Object.prototype.hasOwnProperty,

  arraySlice = Array.prototype.slice;


/**
 * 空函数
 */
exports.noop = function () { };


/**
 * foreach
 */
exports.each = function (obj, iterator, context) {
  var i, len, item;

  // 不处理 null 和 undefined
  if (obj == null) {
    return;
  }

  // 处理数组
  if (obj.length !== undefined) {
    for (i = 0, len = obj.length; i < len; i++) {
      item = obj[i];
      iterator.call(context || item, item, i, obj);
    }
  }
  // 处理对象
  else {
    for (i in obj) {
      if (!hasOwnProperty.call(obj, i)) {
        continue;
      }
      item = obj[i];
      iterator.call(context || item, item, i, obj);
    }
  }
};


/**
 * 浅度复制
 */
exports.extend = function (target) {
  var partial = arraySlice.call(arguments, 1),
    i, len, prop, source;

  // each 浅度复制
  for (i = 0, len = partial.length; i < len; i++) {
    source = partial[i];

    for (prop in source) {
      if (!hasOwnProperty.call(source, prop)) {
        continue;
      }

      target[prop] = source[prop];
    }
  }

  return target;
}


/**
 * 类型判断
 */
exports.each({
  // 数组
  'Array': Array.isArray,
  // 对象
  'Object': undefined,
  // 字符串
  'String': undefined,
  // 函数
  'Function': undefined
}, function (native, typeName) {
  // 名称
  var name = 'is' + typeName;

  // 如果提供了原生方法使用原生方法
  // 木有就自己造
  exports[name] = native || function (obj) {
    return toString.call(obj) === '[object ' + typeName + ']';
  }
});


/**
 * nextTick 简单版本
 */
exports.nextTick = function (func) {
  setTimeout(func, 0);
};


var rbracket = /\[\]$/;

/**
 * 将对象解析为QueryString
 */
exports.param = function (input, traditional) {
  var ret = [],
    add, prefix, i;

  // 将名键值对添加到输出数组中
  add = function (prop, value) {
    if (value !== undefined) {
      value = value === null ? '' : value;
      ret.push(encodeURIComponent(prop) + '=' + encodeURIComponent(value));
    }
  };

  // 数组
  //[{name:key,value:value},{name:key,value:value}...]
  if (exports.isArray(input)) {
    for (i = 0; i < input.length; i++) {
      add(input[i].name, input[i].value);
    }
  }
  // 对象
  else {
    for (prefix in input) {
      buildParams(prefix, input[prefix], traditional, add);
    }
  }

  return ret.join('&').replace(/%20/g, '+');
}


/**
 * 转换 [class=j-a] => .j-a
 */
exports.transferSelector = function (selector) {
  var pattern = /\[class=(\S+)\]/,
    matches;

  matches = pattern.exec(selector);

  if (matches) {
    return '.' + matches[1];
  } else {
    return selector;
  }
}


/**
 * 构建参数
 */
function buildParams(prefix, input, traditional, add) {
  var name;

  // 数组
  if (exports.isArray(input)) {
    exports.each(input, function (value) {
      if (traditional || rbracket.test(prefix)) {
        add(prefix, value);
      } else {
        buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", value, traditional, add);
      }
    })
  }
  // 对象
  else if (!traditional && exports.isObject(input)) {
    // Serialize object item.
    for (name in input) {
      buildParams(prefix + "[" + name + "]", input[name], traditional, add);
    }
  }
  // 一般对象
  else {
    // Serialize scalar item.
    add(prefix, input);
  }
}