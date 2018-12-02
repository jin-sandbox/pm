/**
 * 用于与父窗口交换关于linkmap的信息
 */
var Element, dom,

  PREFIX = '_BEES_LINK_BLOCK_',

  PERCENT_CLASS = PREFIX + 'PERCENT',

  CLICK_CLASS = PREFIX + 'CLICK',

  CONFIG = {

    color: {
      normal: {
        '#8eb6f3': [0.00, 1.00],
        '#6591d5': [1.00, 10.00],
        '#4a78bf': [10.00, 20.00],
        '#3262ac': [20.00, 50.00],
        '#1b4c9a': [50.00, 100.00]
      },

      order: {
        '#b19aec': [0.00, 1.00],
        '#9278d5': [1.00, 10.00],
        '#775cbb': [10.00, 20.00],
        '#5a3ea1': [20.00, 50.00],
        '#3b217c': [50.00, 100.00]
      }
    },

    defaultColor: '#d4c9f2',

    //色块透明度
    opacity: '0.85'
  };

var cover, styleTag;

var linkmapM = {

  init: function (_g) {
    Element = _g.Element;
    dom = _g.dom;
  },

  /**
   * 当接受到父窗口关于linkmap相应指示时相应的处理
   */
  handle: function (e) {
    var me = this,
      action = e.data.action,
      color = e.data.color;

    if (me[action]) {
      me[action](e);
    }
  },

  /**
   * 创建遮罩
   */
  createCover: function () {
    var body = new Element(document.body),
      cover = new Element(document.createElement("div"));

    cover.css('position', 'fixed')
      .css('left', '0')
      .css('top', '0')
      .css('background', 'rgba(0 ,0 , 0, 0.3)')
      .css('width', body.css('width'))
      .css('height', body.css('height'))
      .css('z-index', '1000');

    return cover;
  },

  /**
   * 创建链接色块
   * @param  {dom} linkDom  链接的dom元素
   * @param  {number} clickAmount  点击次数
   * @param  {number} clickSum 所有链接的点击总和
   * @return {Element} 创建好的色块Element
   */
  createLinkBlock: function (linkDom, clickAmount, clickSum, type) {
    var me = this;
    var block = new Element(document.createElement('div')),
      link = new Element(linkDom),
      offset = link.offset(true),
      size = link.size(true),
      percent = (parseFloat(clickAmount / clickSum) * 100).toFixed(2),
      color = me.getColorByPercent(percent, type);

    //如果长宽和位置信息全部为0，说明是隐藏的元素
    if (size.width === '0px' &&
      size.height === '0px' &&
      offset.left === '0px' &&
      offset.top === '0px') {
      return null;
    }

    //添加独有的样式名，便于识别
    block.addClass(PREFIX);

    //样式设置
    block.css('position', 'absolute')
      .css('left', offset.left)
      .css('top', offset.top)
      .css('min-width', size.width)
      .css('height', size.height)
      .css('background', color)
      .css("cursor", 'pointer')
      .css('line-height', size.height)
      .css('text-align', 'center')
      .css('color', '#fff')
      .css('opacity', CONFIG.opacity);

    //内容填充
    // 为订单转化的情况
    if (type === 'order') {
      block.text(percent + '%');

      // 为链接点击图的默认情况
    } else if (type === 'normal') {
      var clickNumber = new Element(document.createElement('span')),
        percentNumber = new Element(document.createElement('span'));

      percentNumber.text(percent + '%');
      percentNumber.addClass(PERCENT_CLASS);
      clickNumber.text(clickAmount);
      clickNumber.addClass(CLICK_CLASS);
      block.append(percentNumber);
      block.append(clickNumber);
    }

    return block;
  },

  /**
   * 创建style标签，这个是因为需要伪类，内联样式无法写伪类
   */
  createStyleTag: function () {
    var style;

    style = document.createElement('style');
    style.innerHTML = ' '
      + '.' + PERCENT_CLASS + '{'
      + 'display:inline;'
      + '}'
      + '.' + CLICK_CLASS + '{'
      + 'display:none;'
      + '}'
      + '.' + PREFIX + ':hover' + ' ' + '.' + PERCENT_CLASS + '{'
      + 'display:none;'
      + '}'
      + '.' + PREFIX + ':hover' + ' ' + '.' + CLICK_CLASS + '{'
      + 'display:inline;'
      + '}';

    return style;
  },

  /**
   * 根据百分比 返回对应等级的颜色
   * @param {Number} percent 取值0-100,不含%
   */
  getColorByPercent: function (percent, type) {
    var color, item,
      COLOR = CONFIG.color[type];

    for (color in COLOR) {
      item = COLOR[color];

      if (percent > item[0] && percent <= item[1]) {
        return color;
      }
    }

    return CONFIG.defaultColor;
  },

  /**
   * type === normal 情况下处理数据
   */
  handleNormal: function (data) {
    var me = this, 
      info = data.info,    //e 是被封装过的event对象
      links = info.links,
      clickSum = info.sum,
      i, len, item, href, linkList, block, clickAmount;

    cover = me.createCover();

    //通过后端传过来的href，创建遮挡a标签的色块
    for (i = 0, len = links.length; i < len; i++) {
      item = links[i];
      href = item.href;
      clickAmount = item.value;

      linkList = dom.queryAll(document, 'a[href="' + href + '"]');

      if (linkList && linkList.length > 0) {
        linkList.forEach(function (link) {
          //创建色块
          block = me.createLinkBlock(link, clickAmount, clickSum, 'normal');

          if (block) {
            //将色块加入cover元素中
            cover.append(block);
          }
        });
      }
    }

    //将遮罩和遮罩内部的所有色块添加到body中
    cover.appendTo(document.body);

    // 创建style标签，加入head
    if (!styleTag) {
      styleTag = me.createStyleTag();
      document.head.appendChild(styleTag);
    }
  },

  /**
   * type === 'order' 情况下处理数据
   */
  handleOrder: function (data) {
    var me = this, 
      links = data.info,
      clickSum, //总点击数
      clickAmount, //点击数
      i, len, item, href, linkList, block;

    cover = me.createCover();

    //通过后端传过来的href，创建遮挡a标签的色块
    for (i = 0, len = links.length; i < len; i++) {
      item = links[i];
      href = item.href;
      clickAmount = item['order_num'];
      clickSum = item.pv;

      linkList = dom.queryAll(document, 'a[href="' + href + '"]');

      if (linkList && linkList.length > 0) {
        linkList.forEach(function (link) {
          //创建色块
          block = me.createLinkBlock(link, clickAmount, clickSum, 'order');

          if (block) {
            //将色块加入cover元素中
            cover.append(block);
          }
        });
      }
    }

    //将遮罩和遮罩内部的所有色块添加到body中
    cover.appendTo(document.body);
  },

  /**
   * 处理message中中的data
   */
  linkmap: function (e) {
    var me = this;

    me.linkmapOff();

    var data = e.data,
      type = data.type || 'normal';

    if (type === 'normal') {
      me.handleNormal(data);

    } else if (type === 'order') {
      me.handleOrder(data);
    }

  },

  /**
   * 移除遮罩
   */
  linkmapOff: function () {
    if (cover && cover.getElement().parentNode) {
      var elem = cover.getElement();
      elem.parentNode.removeChild(elem);
    }
  }
};


module.exports = linkmapM;