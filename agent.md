# 用户行为统计基础规范V1.0

用户行为数据分为以下几部分

1. 访问数据:pv、uv、页面来源、ua、硬件设备信息、当前页面路径、归属地
2. 性能数据:白屏、首屏、可操作时间、总加载时间、内存用量，自定义资源加载时间
3. 行为数据:鼠标点击量、链接点击量、滚屏停留、鼠标轨迹
4. 用户属性:业务角色...

## 接口规范

### 请求接口

http://localhost/log

### 数据格式

`?deviceId=xxxx&requestId=xxxxx&type=0&path=www.test.com/home.html&v=1&data={....}`

### 基础数据

```js
    type:0, //上报数据类型
    deviceId: "xxxx-xxx",  // 设备唯一id
    requestId: "0",  // 每个请求inc（各个用户当前浏览器访问次数从1 递增）
    path: "www.xidea.org/index.html?query#hash", //统计页面路径
    v: 1  //统计规范版本
```

### 第一时间上报数据-访问数据(type=0)


```js
data:{
    referer: "http://baidu.com/?search=zbj", //页面访问来源
    fromId:  '2', //来源页面的请求唯一id
    screen: "1440x900" //屏幕分辨率，
    userTag:{...}
    ga: {}
}
```

### onload上报数据-性能数据(type=1)

```js
data: {
    timing: {...}	,
    memory: {...}//chrome 下能取到
    firstScreen: timestamp,//time to first screen loaded(img,bg...)
    firstPaint: timestamp,  //time to white screen ending
    ...
```

### 用户事件上报数据-行为数据(type=2)

```js
data: {
    click:[{
        x: number,//pageWidth/2 偏移量
        y: number,
        scrollTop,scrollLeft,
        innerWidth,innerHeight,//可视区域大小
        pageWidth:750,pageHeight:1400,
        
        href: "xxx",//连接地址（optional如果有）
        
        focusArea:{
            name: "tools-menu",//命名区域, data-focus-area=“name”
            //selector: "#tools-menu",
            //position: fixed, //(optional)
            //x:xx,//元素左上角位置
            //y:xx,
        },
        pageStatus:{
           tab1: "xxx",
           tab2: "xx"
        }
    }],
    scroll: [{
        info: {
            top: 111,
            bottom: 888,
            time: 4.6 //有交互的持续时间
        },
        pageStatus: {
            '#tab1': 1,
            '#tab2': 2
        }
    }]
}
```

### pageStatus 同步

```
beehive.emit('pagestatuschange','#tab1','1')
