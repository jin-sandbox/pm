/**
 * 获取视口范围内的pagestatus id
 */

var Element, utils, token;


var vStatus = {
  init: function(_g) {
    Element = _g.Element;
    utils = _g.utils;
    token = _g.token;
  },

  handle: function(e) {
    var info = e.data.info,
        me = this,
        tabIds;

    tabIds = me.getTabInRange(info.range);
    tabIds = me.sortByTop(tabIds);

    me.message(tabIds);
  },

  /**
   * 获取所有在视口中能看到的tab组件的id
   * @param {Array} range [0,100]
   */
  getTabInRange: function(range) {
    var tabAll = window.bees.pageStatus.get(),
        me = this,
        tabs = [];

    Object.keys(tabAll).forEach(function(selector) {
      if(me.isInRange(selector, range)) {
        tabs.push(selector);
      }
    });

    return tabs;
  },

  /**
   * 检测selector对应的元素是否在range范围内
   * @param {String} selector #a3
   * @param {Array} range [0,100]
   */
  isInRange: function(selector, range) {
    var elem = new Element(utils.transferSelector(selector)),
        top, bottom, //元素所占的高度范围
        diff;        // 视口修正，缩小范围，以视线为准
   
    // 如果当前元素不可见，返回false
    if(elem.isHidden()) return false;

    top = elem.offset().top;
    bottom = top + elem.size().height;
    diff = parseInt((bottom-top)/5);

    top = top + diff;
    bottom = bottom - diff;

    if((top < range[0] && bottom > range[0]) 
        || (top < range[1] && bottom > range[1])
        || (top > range[0] && bottom < range[1])
    ) {
      return true;
    }

    return false;
  },

  /**
   * 根据到文档顶部的高度进行排序(升序排列)
   * @param {Array} selectors []
   */
  sortByTop: function(selectors) {
    var result = selectors.sort(function(s1, s2) {
      var top1 = new Element(utils.transferSelector(s1)).offset().top;
      var top2 = new Element(utils.transferSelector(s2)).offset().top;

      return top1 - top2;
    });

    return result;
  },

  message: function(msg) {
    window.parent.postMessage({
      token: token,
      action: 'viewportstatus',
      info: msg
    }, '*');
  }
};


module.exports = vStatus;

