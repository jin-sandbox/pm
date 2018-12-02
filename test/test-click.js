var doc = require('./test-boot');
var utils = require('../agent/util');
setTimeout(function(){
    //utils.on('behaver', function(){console.log('behaver test:',arguments)});

    event.srcElement =doc.links[0];
    utils.trigger('#document_onclick')


    event.srcElement=doc.body
    utils.trigger('#document_onclick')

    utils.on('scrollchange', function () {
        console.log('scrollchange test:', arguments)
    })
    utils.trigger('window_onscroll')
    setTimeout(function(){
        utils.trigger('window_onscroll')
        setTimeout(function(){
            utils.trigger('window_onscroll')
            setTimeout(function(){
                utils.trigger('window_onscroll')
                utils.trigger('window_onscroll')
                utils.trigger('window_onscroll')
                utils.trigger('pagestatuschange','test_key',Math.random);

                setTimeout(function(){
                    utils.trigger('window_onscroll')
                    setTimeout(function(){
                        utils.trigger('window_onscroll')

                        setTimeout(function(){
                            utils.trigger('window_onunload');



                            console.log('pageSize:',utils.pageSize())
                            console.log('screen:',utils.screen())
                            console.log('scroll:',utils.scroll())
                            var event = Object.create(window.event);
                            event.srcElement = String(event.srcElement)
                            console.log('window.event:',event)
                        },200);
                    },1000)
                },1000)
            },1200)
        },900)
    },1000)

},1000)
