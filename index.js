const ww = new (require('webwork'))();
const util = require('./lib/util');
const onVisit = require('./process/on-visit');
const onPerformance = require('./process/on-performance');
const onBehavior = require('./process/on-behavior');
const staticHandler = util.buildResourceHandler(__dirname+'/webroot/static/');

ww.get('/agent.js',staticHandler.bind(this,'js/agent.js'))

/*
 type: type,[0:vist,1:performance,2:behaviors(click,scroll,leave)]
 deviceId: deviceId,
 requestId: requestId,
 //userId:userId,
 path: path,
 v: version,
 time:+new Date,
 data: JSON.stringify(data)
 */
ww.get('/log.gif',function(req,resp){
    var query = req.query;

    var type = +query.type;
    var deviceId = query.deviceId;
    var requestId = query.requestId;
    var path = query.path;
    var version = query.version;
    var time = query.time;
    var data = query.data;

    resp.writeHead(200,{"content-type":"image/gif","cache-control":"no-cache"});
    resp.end(util.emptyGifData);

    switch(type ){
        case 0:
            var ip= req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress;
            console.log(req.connection.remoteAddress ,
                req.socket.remoteAddress ,req.connection == req.socket,
                req.connection.socket
            )
            console.log(req)
            return onVisit(deviceId,requestId,path,data,{ip:ip})
        case 1:
            return onPerformance(deviceId,requestId,path,data)
        case 2://behavior:click scroll leave
            return onBehavior(deviceId,requestId,path,data)
        default:
            console.error('invalid type:',type)
    }
})



//进程分离

const LiteEngine = require('lite');
var engine = new LiteEngine(__dirname+'/webroot/');
ww.resolveView('*.xhtml',function(path,model,req,resp){
    engine.render(path,model,req,resp)
})
ww.get('/',function(req,resp){
    this.url = req.query.url;
    return '/index.xhtml'
})
ww.get('/static/*',function(req,resp){
    var path = req.params[0];
    return staticHandler(path,req,resp);
})
ww.start(8888,function(arg){
    console.log('service start:%d',arg)
})
