/**
 * 监听子窗口键盘事件然后上报，因为父窗口无法获取子窗口的键盘事件
 */
var token;


var keyM = {
  
  launch: function(_g) {
    var me = this;
    
    token = _g.token;

    me.listenKeyup();
  },

  listenKeyup: function() {
    var me = this;

    window.addEventListener('keyup', function(e) {
      me.message({
        keyCode: e.keyCode
      })
    });
  },

  message: function(msg) {

    window.parent.postMessage({
      token: token,
      action: 'keyboard',
      info: msg
    }, '*');
  }
};


module.exports = keyM;