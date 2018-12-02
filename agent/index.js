/*
jsi m -o ../agent.js index.js#init \
 collect-click.js util.js transport.js collect-scroll.js collect-performance.js collect-visit.js status.js\
 && jsi a ../agent.js\
 && ls -l ../
*/
// 数据搜集模块
var collect_visit = require('./collect-visit')
var collect_performance = require('./collect-performance')
var collect_click = require('./collect-click');
var collect_scroll = require('./collect-scroll');
// 数据发送模块
var transfer = require('./transport');
// 页面状态监听模块
var status = require('./status');
var utils = require('./util');
var version = '0.0.1';
var agentScript = document.getElementsByTagName('script');
agentScript = agentScript[agentScript.length-1]
exports.init = function(reportURL){
    try {
        // 启动页面状态监听模块
        status.init();

        if (window === window.parent) {//only on top
            // 启动发送模块
            transfer.init(reportURL,version);
            // 启动搜集模块
            collect_visit.init();
            collect_performance.init();
            collect_click.init();
            collect_scroll.init();
        }else{
            // 如果当前页面是被嵌套在别的页面中
            // 启动ui 监听函数
            //utopia-bees-message
            //监听message事件，并对父窗口的指示作相应的反应

            var scriptBase = agentScript.src.replace(/[^\/\\]*$/,'');
            function addScriptEvent(e) {
                if(e.type == 'keyup'){
                    //'O'.charCodeAt() == 79
                    var script = e.ctrlKey && e.keyCode == 79 && 'ui.js';
                }else if(e.type == 'message'){
                    var script = e.data.action =='addScript' && e.data.src || '';
                }

                if(scriptBase && script && script.match(/^[\w\-]+\.js$/)){
                    script = scriptBase +script;
                    var node = agentScript.cloneNode(false);
                    node.src=script;
                    agentScript.parentNode.appendChild(node)
                }
            }
            utils.addEvent(window,'message', addScriptEvent);
            utils.addEvent(window,'keyup',addScriptEvent)
        }
    } catch (e) {
        console.log(e);
    }
    return utils.on;
}
exports.version = version;


