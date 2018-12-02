/**
 * @authors       gebilaoxiong
 * @date          2016-11-30 11:14:39
 * @description   DOM 操作
 */
var dom = exports;


/**
 * 计算元素相对于文档左上角偏移量
 */
dom.offset = function(elem) {
  var docElem, win,
    box = { top: 0, left: 0 },
    doc = elem && elem.ownerDocument,
    win;
  
  if(!doc) {
    return;
  }

  docElem = doc.documentElement;

  if (typeof elem.getBoundingClientRect !== 'undefined') {
    box = elem.getBoundingClientRect();
  }

  // 获取window对象
  win = doc.defaultView || window;

  return {
    top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
    left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
  };
}


/**
 * 计算元素自身的宽高
 */
dom.getOwnSize = function(elem) {
  return {
    width: elem.offsetWidth,
    height: elem.offsetHeight
  };
};


/**
 * 计算元素的scrollTop和scrollLeft
 */
dom.scroll = function(elem) {
  if(!elem) {
    return {
      top: document.body.scrollTop || document.documentElement.scrollTop, 
      left: document.body.scrollLeft || document.documentElement.scrollLeft
    }
  } else {
    return {
      top: elem.scrollTop,
      left: elem.scrollLeft
    }
  }
}


/**
 * 返回元素的href属性
 */
dom.getHref = function(elem) {
  return elem.href ? elem.href : '';
};


/**
 * 递归获取元素自身或者父辈（如果他们是a标签的话）的href
 */
dom.getAlinkHref = function(elem) {
  //如果该标签为body或者html直接返回''
  var nodeName = elem.nodeName.toLowerCase(); 
  if (nodeName === 'body'|| nodeName === 'html') 
    return '';

  if (dom.isTag(elem,'a')) {  //该标签就是a标签
    return dom.getHref(elem);
  } else {      //该标签不是a标签，递归判断其父元素
    var parent = elem.parentNode;
    if (parent) {
      return dom.getAlinkHref(parent);
    }
    return '';
  }
};


/**
 * 判断elem是否为tag标签
 * @param  {[dom]} elem [要判断的dom元素]
 * @param  {[String]} tag [匹配的标签名字]
 */
dom.isTag = function(elem, tag) {
  return elem.nodeName.toLowerCase() === tag.toLowerCase(); 
};


// 是否是标准兼容模式
var isCompatMode = document.compatMode === 'CSS1Compat';


/**
 * 获取可视区域尺寸
 */
dom.viewSize = function() {
  var docElem = document.documentElement,
    body = document.body,
    size = {};
  
  // 非标准兼容模式
  if (!isCompatMode && body) {
    size.width = body.clientWidth
    size.height = body.clientHeight;
  }
  // 标准兼容模式
  else {
    size.width = docElem.clientWidth;
    size.height = docElem.clientHeight;
  }

  return size;
}


/**
 * 获取页面尺寸
 */
dom.pageSize = function() {
  var docElem = document.documentElement,
    body = document.body;
  
  return {
    width: Math.max(docElem.clientWidth, body.scrollWidth, docElem.scrollWidth, 
      body.offsetWidth, docElem.offsetWidth),
    height: Math.max(docElem.clientHeight, body.scrollHeight, docElem.scrollHeight, 
      body.offsetHeight, docElem.offsetHeight)
  };
}


/**
 * 获取屏幕分辨率
 */
dom.screenSize = function() {
  return {
    width: window.screen.width,
    height: window.screen.height
  };
};


/**
 * 获取页面缩放比例
 */
dom.getPixelRatio = function() {

  if(window && window.devicePixelRatio) { //在现代浏览器下
    return window.devicePixelRatio.toFixed(2);
  } else if(window && window.screen.deviceXDPI) {   //IE浏览器下
    return parseFloat(window.screen.deviceXDPI / window.screen.logicalXDPI).toFixed(2);
  }

  return 1;
}


/**
 * @param  {dom} context 上下文环境
 * @param  {string} selector 选择器
 * 注意：本方法不兼容IE8，因为考虑到本方法只会在数据查看页面触发message事件的时候调用 
 */
dom.query = function(context, selector) {
  if(!context || !context.querySelector ) return null;

  return context.querySelector(selector);
}


/**
 * @param  {dom} context 上下文环境
 * @param  {string} selector 选择器
 * 注意：本方法不兼容IE8，因为考虑到本方法只会在数据查看页面触发message事件的时候调用
 */
dom.queryAll = function(context, selector) {
  if(!context || !context.querySelectorAll ) return null;

  var list = context.querySelectorAll(selector);

  return list ? Array.prototype.slice.call(list) : []; 
}