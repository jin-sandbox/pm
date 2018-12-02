const fs = require('fs');
const crypto = require("crypto");
const emptyGifData = new Buffer('R0lGODlhAQABAIAAAAAAAP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==','base64');
const contentTypeMap = {
    js:'text/javascript',
    css:'text/css',
    svg:'text/svg',
    ttf:'application/x-font-ttf',
    woff:'application/font-woff',
}
exports.emptyGifData = emptyGifData
exports.buildResourceHandler = buildResourceHandler;

function buildResourceHandler(dir,maxage){
    var fileCacheMap = {};
    return function(path,req,resp){
        var file = require('path').join(dir,path);
        var stat = fs.statSync(file);
        var fileCache = fileCacheMap[path];
        var ext = path.replace(/.*\./,'').toLowerCase();
        var contentType = contentTypeMap[ext]||'application/'+ext;
        if(!fileCache || fileCache.mtime != +stat.mtime){//过期
            fileCache = fileCacheMap[path] = {
                mtime:+stat.mtime,
                data : fs.readFileSync(file)
            };
            var md = crypto.createHash('md5').update(fileCache.data).digest('base64');
            fileCache.headers = {etag:md,'content-type':contentType};
            if(maxage){
                //maxage 单位为妙
                //fileCache.headers["cache-control"]= "max-age="+maxage+",s-maxage="+maxage
            }
        }
        console.log(fileCache.data+'')
        //设置协商缓存
        if (fileCache.md === req.headers['if-none-match']) {
            //本地缓存60妙，共享缓存60妙。
            resp.writeHead(304,fileCache.headers);
            resp.end();
        }else{
            //本地缓存60妙，共享缓存60妙。
            resp.writeHead(200,fileCache.headers);
            resp.end(fileCache.data);
        }
        console.log(fileCache.headers)
    }

}

