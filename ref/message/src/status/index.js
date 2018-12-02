/**
 * 在页面状态发生改变时向父窗口上报状态
 */
var bees, token;  


var statusM = {
  /**
   * 对外的启动函数
   */
  launch: function(_g) {
    var me = this;

    bees = _g.bees;
    token = _g.token;

    bees.events.on('pagestatuschange', me.statusHandler, me);
    // 在onload的时候向父窗口发送状态信息
    me.postInitStatus();
  },

  postInitStatus: function() {
    var me = this;

    window.addEventListener('load', function() {
      me.message({
        pageStatus: bees.pageStatus.get()
      });
    });
  },

  statusHandler: function(e) {
    var me = this;

    // 向父窗口发送数据
    me.message({
      id: e.id,
      index: e.index,
      pageStatus: e.status
    });
  },

  message: function(msg) {
    window.parent.postMessage({
      token: token,
      action: 'status',
      info: msg
    }, '*');
  }
};


module.exports = statusM;