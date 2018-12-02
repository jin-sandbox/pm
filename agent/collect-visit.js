/**
 * 访问数据的采集和上报
 */
var utils = require('./util');

exports.init = function () {
    // 因为需要根据utopia对象来判断新老环境，所以所有数据都必须在DOMContentLoaded事件中进行上报
    utils.addEvent(window, 'DOMContentLoaded', function () {
        var referrer = document.referrer;
        var screen = utils.screen();
        var result = {
            //fromId: from page request ID
            referrer: referrer,
            screen: screen.width + '*' + screen.height,
        };
        utils.emit('access', result);
    });
}


