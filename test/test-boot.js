
var doc = require('./browser-mock')
        ("<html><script src='agent.js'/><body><a href='test.html'></a></body></html>");

var utils = require('../agent/util');

var reportURL = 'http://test/report'

//window.event = {srcElement:links[0]}
doc.scripts[0].src = 'agent.js';
function attachEvent(event,fn){
    var node = this;
    if(node == global){
        var tagName = 'window';
    }else{
        var tagName = node.nodeName;
    }
    var newEvent = tagName+'_'+event;
    //eventMap[newEvent] = [node,fn]
    utils.on(newEvent,fn.bind(node));
    //console.log(tagName,newEvent,String(fn).replace(/(function\s+\w+.*|(?:.*[\r\n]+){1,2})[\s\S]*/,'$1'))
}
window.attachEvent = attachEvent;
doc.attachEvent =attachEvent;


utils.on('test:image_loaded',function(img){
    var src = img.src;
    var map = {};
    var data
    if(src.startsWith(reportURL)){
        src.replace(/[\?&](\w+)=([^&]+)/g,function(a,k,v){
            v = decodeURIComponent(v);
            if(k == 'data'){
                data = v;//JSON.parse(v);
            }else{
                map[k] = v;
            }
        })
        console.log('report',map,data)
        utils.tigger('test:image_load/ed_data',map,data);
    }else{
        console.log(src)
    }


})



var init = require('../webroot/static/js/agent').init;

var initon =init(reportURL);
console.assert(utils.on === initon,'init returned utils.on!!')
utils.trigger('window_onload');
module.exports  = doc;


