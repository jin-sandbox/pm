/**
 * 用于接收父窗口给予的tab id 然后选中该tab
 */
var Element, utils,

  covers = {};

var CONFIG = {
  SELECT_COLOR: 'rgba(255, 100, 0, 0.5)'
};

var tabM = {
  cover: null,

  init: function (_g) {
    Element = _g.Element;
    utils = _g.utils;
  },

  /**
   * 创建遮罩，有就直接使用
   */
  cover: function (elem, type) {
    var isAppend = true,   //是否是已经被添加到页面中了
      cover = covers[type];

    if (!cover) {
      covers[type] = cover = new Element(document.createElement('div'));
      cover.css('position', 'absolute')
        .css('background', CONFIG.SELECT_COLOR)
        .css('z-index', '999');

      isAppend = false;
    }

    var size = elem.size(true),
      offset = elem.offset(true);

    cover.css('left', offset.left)
      .css('top', offset.top)
      .css('width', size.width)
      .css('height', size.height);

    if (isAppend) {
      cover.css('display', 'block');
    } else {
      cover.appendTo(document.body);
    }
  },

  coverOff: function (type) {
    var me = this;

    if (type === 'all') {
      for (var key in covers) {
        me.coverOffSingle(covers[key]);
      }

    } else {
      me.coverOffSingle(covers[type]);
    }
  },

  /**
   * 隐藏单个遮罩
   */
  coverOffSingle: function (cover) {
    if (cover && cover.getElement().parentNode) {
      cover.css('display', 'none');
    }
  },

  /**
   * 处理message事件相应的回调
   */
  handle: function (e) {
    var me = this,
      info = e.data.info,
      action = e.data.action,
      type = e.data.type || 'hover',      //触发tabselect的类型，默认是hover
      id = info.id,
      target, elem;

    if (action === 'cover') {
      target = document.querySelector(utils.transferSelector(id));

      if (!target) return;

      elem = new Element(target);

      if (me[action] && elem) {
        me[action](elem, type);
      }

    } else {
      me[action](type);
    }
  }
};


module.exports = tabM;