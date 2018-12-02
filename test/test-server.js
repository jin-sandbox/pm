var http = require('http');
var server = http.createServer(function(req,resp){
    console.log(req.url)
    if(req.url == '/') {
        resp.writeHead(200, {})
        resp.end("<html><body>" + JSON.stringify(req.headers) + '<hr>' +
            "<script>" + test + "</script>" +
            '<a href="javascript:test()">do..</a></body></html>');

    }else{
        var m = req.url.match(/^\/redirect\?(.*)/);
        if(m){
            resp.writeHead(302,{Location:decodeURIComponent(m[1])})
        }else{
            resp.writeHead(200,{})
            resp.write(JSON.stringify({url:req.url,headers:req.headers}));
        }

        resp.end()
    }
})


function test(url){
    // window.onunload = function(){
    //     for(var i = 0;i<10;i++){
    //         var img = new Image();
    //         img.src = i+'test.gif';
    //         img.onload = function(){console.log('img loaded'+this.src);alert(this.src)}
    //     }
    //     //alert(111)
    // }
    url = url||'/redirect?'+encodeURIComponent('http://www.tp.net.cn:3002/')
    req = new XMLHttpRequest();
    req.open('GET',url,true);
    req.onerror = function(e,a){
        console.error('error:',e,a)
    }
    req.onreadystatechange = function(){
        console.log('readyState:','['+req.readyState+']')
        if(req.readyState >=2){
            console.log('readyState:','['+req.readyState+']')
            console.log(req.status,req.getAllResponseHeaders())
            if(req.readyState == 4){
                console.log('status',req.status);
                console.log('content',req.responseText);
                console.log(req)
            }
        }

    }
    req.send('');
}
server.listen(3002);
