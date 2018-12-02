var xmldom = require('xmldom');
var window = global;
window.Image =Image
window.location = {hostname:'localhost',hostname:'localhost:8080',pathname:'index.js',href:'http://localhost:8080/index/js'}
window.window = window;
window.parent = window;//Math.random()>.5?global : null;

window.performance = {timing:{
        msFirstPaint:1,
        connectEnd: 1501656773393,
        connectStart: 1501656773393,
        domComplete: 1501656785033,
        domContentLoadedEventEnd: 1501656775936,
        domContentLoadedEventStart: 1501656775893,
        domInteractive: 1501656775893,
        domLoading: 1501656773395,
        domainLookupEnd: 1501656773393,
        domainLookupStart: 1501656773393,
        fetchStart: 1501656773393,
        loadEventEnd: 1501656785034,
        loadEventStart: 1501656785033,
        navigationStart: 1501656773393,
        redirectEnd: 0,
        redirectStart: 0,
        requestStart: 1501656773393,
        responseEnd: 1501656773394,
        responseStart: 1501656773604,
        secureConnectionStart: 0,
        unloadEventEnd: 0,
        unloadEventStart: 0,
    },memory:{
        jsHeapSizeLimit:2190000000,
        totalJSHeapSize:14300000,
        usedJSHeapSize:11200000
    }

}
window.event = {srcElement:null,clientX:0,clientY:0}

var utils = require('../agent/util');
//console.log(scripts.length)
function getBoundingClientRect(){
    return {left:1,top:1,width:10,height:10};
}
function Image(){
    this.getBoundingClientRect = getBoundingClientRect;
    var me = this;

    setTimeout(function(){
        utils.trigger('test:image_loaded',me);
        //me.onload && me.onload();
    },1000)
};
Image.prototype.getBoundingClientRect = getBoundingClientRect;


module.exports = function(html){
    var doc = new xmldom.DOMParser().parseFromString(html,'text/html');//"<html><script src='agent.js'/><body><a href='test.html'></a></body></html>");
    var scripts = doc.getElementsByTagName('script');
    var links = doc.getElementsByTagName('a');
    doc.scripts = scripts;
    doc.links = links;
    doc.body = doc.getElementsByTagName('body')[0];
    doc.cookie = ''
    window.document = doc;
    window.screen = {width:800,height:700};


    var Element = doc.body.constructor;
    var elProto = Element.prototype;
    var Node = elProto.__proto__.constructor;
    elProto.getBoundingClientRect = getBoundingClientRect
    elProto.scrollLeft = 0;
    elProto.scrollTop = 0;
    defineDefault(elProto,'offsetWidth',(self)=>self.toString().length>>1)
    defineDefault(elProto,'offsetHeight',(self)=>self.toString().length)

    defineDefault(elProto,'scrollWidth',(self)=>self.offsetWidth)
    defineDefault(elProto,'scrollHeight',(self)=>self.offsetHeight)

    defineDefault(elProto,'clientWidth',(self)=>self.offsetWidth)
    defineDefault(elProto,'clientHeight',(self)=>self.offsetHeight);


    doc.defaultView = {
        getComputedStyle(el,ps){
            var style = {};
            el.getAttribute('style').replace(/([\w\-]+)\s*\:\s*([^;]+)[;|$]/,function(a,k,v){
                style[k]=value;
            })
            return {
                getPropertyValue(key){return style[key]}
            }
        }
    }



    return doc;
}
function defineDefault(p,key,getter){
    var storeKey = key+'$';
    Object.defineProperty(p,key,{get:function(){

        if(this[storeKey] == null){
            this[storeKey] = getter(this)
        }
        return this[storeKey];
    },set:function(v){
        this[storeKey] = v;
    }});
}
//console.log(Element,Node);

