var wlConfig = (function (param) {
    return {
    	//url:"https://zsj.natappvip.cc/dfb/"
        //url: "http://100.39.8.197:8080/",//本地
        //url: "http://100.39.8.174:8080/dfb/"//测试
    	url:"https://apitest.wanlianjin.com/dfb/"
    };
})(wlConfig);
/**
 * @method post 异步提交
 * @param {string} url url
 * @param {object} data 参数
 * @param {function} callback 成功回调
 * @param {function} error 错误回调
 * @param {object} isAsync 是否异步 不传默认为异步
 * @return {null}
 */
function PostAsyncData(url, data, callback, error, isAsync) {
	
    $.ajax({
        async: !isAsync,
        url: wlConfig.url + url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        success: function (backData) {
            callback(backData);
        },
        error: function (x, y, z) {
            console.log("error!");
            if (typeof error == 'function') {
                error(x, y, z);
            }
        }
    });
}

/**
 * @method 获取页面url后面参数的值
 * @param {String} name  参数名
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
/**
 * @method 去掉字符串头尾空格
 * @param {String} str  字符串
 */
function trim(str) {
    if (str != undefined && str != null)
        return str.replace(/(^\s*)|(\s*$)/g, "");
}

var wlScreen = {
    minHeight: '',
    currentHeight: '',
    currentWidth: '',
    landscape: true,
    orientation: '0'
};

/**
 * @method 屏幕宽度自适应
 * @param {int} scale  比例  默认100
 */
function autoSize(scale, callback) {
    /**
     * 保存进入页面是的宽度高度和方向
     */
    wlScreen.currentHeight = window.innerHeight;
    wlScreen.currentWidth = window.innerWidth;
    wlScreen.minHeight = wlScreen.currentHeight - 150;//弹起软键盘之后的屏幕阈值  屏幕高度小于该值
    wlScreen.landscape = (window.orientation == '0');
    wlScreen.orientation = window.orientation;

    callback = typeof callback == 'function' ? callback : function () {
        };
    //屏幕旋转事件 重新获取方向和数值
    window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', function (e) {

        //判断是否为旋转屏幕 只有屏幕旋转才重新记录
        if (wlScreen.orientation != window.orientation) {
            wlScreen.landscape = (window.orientation == '0');
            wlScreen.orientation = window.orientation;
            //由于安卓和ios 事件和数值更改的顺序不一样，有可能先触发事件后更改参数，所以增加延时保证新的数据正确
            setTimeout(function () {
                wlScreen.currentHeight = window.innerHeight;
                wlScreen.currentWidth = window.innerWidth;
                wlScreen.minHeight = wlScreen.currentHeight - 150;
                callback();
            }, 1500);
        } else {
            callback();
        }
    }, false);
    var docEle = document.documentElement;
    var initWidth = 640, initSize = 100;
    if (!isNaN(scale) && scale > 0)
        initSize = scale;
    var minWidth = window.screen.width < window.screen.height ? window.screen.width : window.screen.height;
    var devicePixelRatio = window.devicePixelRatio;
    //部分安卓手机 window.screen.width的实际数值是   window.innerWidth*window.devicePixelRatio
    if (window.screen.width / window.innerWidth >= 2) {
        var actualWidth = window.screen.width / devicePixelRatio;
        var actualHeight = window.screen.height / devicePixelRatio;
        minWidth = actualWidth < actualHeight ? actualWidth : actualHeight;
    }
    if (isPC()) {
        var w = minWidth > 640 ? 640 : minWidth;
    } else {
        w = minWidth;
    }
    docEle.style.fontSize = w / initWidth * initSize + 'px';

    //移除隐藏body 的hide class
    var reg = new RegExp('(\\s|^)' + 'hide' + '(\\s|$)');
    document.body.className = document.body.className.replace(reg, ' ');

}

/**
 * @method 百度统计
 */
function baiduCollection() {
    var _hmt = _hmt || [];
    (function () {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?" + wlConfig.baiduVal;
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
}

/**
 *  @method 微信自定义分享 朋友和朋友圈
 *  @param {object} data 标题 文字 图片地址等
 *  @param {function} callback 回调
 */
function weixinShare(data, callback) {
    if (data.onlyWeixin == undefined) {
        data.onlyWeixin = true;
    }
    if (data.closeTimeLine == undefined) {
        data.closeTimeLine = false;
    }
    if (data.onlyWeixin) {
        var urlLeft = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wlConfig.appIdValue + '&redirect_uri=';
        var urlRight = '&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect';
    } else {
        urlLeft = '';
        urlRight = '';
    }
    var shareList = [
        'menuItem:share:qq',
        'menuItem:share:QZone',
        'menuItem:share:weiboApp',

        'menuItem:share:appMessage',
        'menuItem:share:timeline'
    ];
    if (typeof callback != 'function') {
        callback = function () {
        };
    }
    //var test =
    //{
    //    shareUrl: '', 分享的地址
    //    shareIcon: '', 分享的图标
    //    shareIcon: '', 分享到朋友的标题
    //    shareText: '', 分享到朋友的文本 如果不填写shareTimelineText 也是分享到朋友圈的文本
    //    shareTimelineText:'' 分享到朋友圈的文本
    //    onlyWeixin:''  分享的链接是否只允许在微信端打开,即用微信的那个长连接授权再回调的形式(redirect_uri)
    //    isNeedRecord: '',   判断是否需要调用1008接口记录

    //    openId: '',
    //    activityId: '',      用于车险标识不同活动(车险用的三位 1开头)   寿险该字段传的产品代码 也可用于标识不同穿品的分享
    //    typeAppMessage: '',  1008接口记录分享到朋友 可以定义不同的来标志不同页面或者不同活动
    //    typeTimeline: '',    1008接口记录分享到朋友圈 可以定义不同的来标志不同页面或者不同活动
    //    isGiveCoin:''  Y/N   是否给万金币  目前用于寿险产品分享页面送万金币
    //}
    //图标默认
    if (!hasVal(data.shareIcon)) {
        data.shareIcon = wlConfig.shareRootUrl + wlConfig.shareUrl + '/o2o/image/logo' + wlConfig.enSign + '.jpg';
    }
    //分享到朋友 标题默认
    if (!hasVal(data.shareTitle)) {
        data.shareTitle = wlConfig.weChatSubscript;
    }
    //分享到朋友圈的文本  不存在会取 shareText
    if (!hasVal(data.shareTimelineText)) {
        data.shareTimelineText = data.shareText;
    }

    PostAsyncData("weixinbase/1043", {"url": window.location.href.split('#')[0]},
        function (backData) {
            //alert("(c)"+data.code+"(t)"+data.timestamp+"(n)"+data.nonceStr+"(s)"+data.signature)
            var jsApiList = [
                'checkJsApi',
                'onMenuShareAppMessage',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem'
            ];
            if (!data.closeTimeLine) {
                jsApiList.push('onMenuShareTimeline')
            }
            wx.config({
                debug: false,
                appId: wlConfig.appIdValue,
                timestamp: backData.timestamp,
                nonceStr: backData.nonceStr,
                signature: backData.signature,
                jsApiList: jsApiList
            });
        }
    );

    wx.ready(function () {
        var hideMenuList = [
            'menuItem:share:qq',
            'menuItem:share:QZone',
            'menuItem:share:weiboApp',
            'menuItem:share:email',
            'menuItem:openWithSafari',
            'menuItem:openWithQQBrowser',
            'menuItem:readMode',
            'menuItem:originPage',
            'menuItem:copyUrl'
        ];
        var showMenuList = [
            'menuItem:share:appMessage',
            'menuItem:profile',
            'menuItem:addContact'
        ];
        data.closeTimeLine ? hideMenuList.push('menuItem:share:timeline') : showMenuList.push('menuItem:share:timeline');

        wx.hideMenuItems({menuList: hideMenuList});
        wx.showMenuItems({menuList: showMenuList});
        wx.onMenuShareAppMessage({
            title: data.shareTitle,
            desc: data.shareText, // 分享描述
            link: urlLeft + data.shareUrl + urlRight,
            imgUrl: data.shareIcon,
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                callback('appMessage');
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
            }
        });

        if (!data.closeTimeLine) {
            wx.onMenuShareTimeline({
                title: data.shareTimelineText,
                link: urlLeft + data.shareUrl + urlRight,
                imgUrl: data.shareIcon,
                success: function () {
                    callback('timeline');
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                }
            });
        }

        wx.error(function (res) {
            //alert('wx.error: ' + JSON.stringify(res));
        });
    });

}

/**
 *  @method 关闭微信所有可以关闭的菜单
 *  @return {undefined}
 */
function weixinCloseMenu() {
    PostAsyncData("weixinbase/1043", {"url": window.location.href.split('#')[0]},
        function (data) {
            // alert("(c)"+data.code+"(t)"+data.timestamp+"(n)"+data.nonceStr+"(s)"+data.signature)
            wx.config({
                debug: false,
                appId: wlConfig.appIdValue,   // wx0017a3384b9df4f0
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: [
                    'checkJsApi',
                    'hideMenuItems',
                    'hideAllNonBaseMenuItem',
                    'hideOptionMenu'
                ]
            });
        });
    wx.ready(function () {
        wx.hideMenuItems({
            menuList: [
                'menuItem:share:qq',
                'menuItem:share:appMessage',
                'menuItem:share:timeline',
                'menuItem:share:QZone',
                'menuItem:share:weiboApp',
                'menuItem:share:email',
                'menuItem:openWithSafari',
                'menuItem:openWithQQBrowser',
                'menuItem:readMode',
                'menuItem:originPage',
                'menuItem:copyUrl',
                'menuItem:favorite'
            ]
        });
        // wx.hideOptionMenu();
        wx.error(function (res) {
            //alert('wx.error: ' + JSON.stringify(res));
        });
    });
}

/**
 *  滚动条相关函数
 * @property getScrollTop 获取滚动条当前的位置
 * @property getClientHeight 获取当前可视范围的高度
 * @property getScrollHeight 获取文档完整的高度
 */
var scroll = {
    getScrollTop: function () {
        var st = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            st = document.documentElement.scrollTop;
        }
        else if (document.body) {
            st = document.body.scrollTop;
        }
        return st;
    },
    getClientHeight: function () {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
        }
        else {
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
    },
    getScrollHeight: function () {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }
};

/**
 *  @method 判断PC 或者是手机平板
 *  @return {boolean}
 */
function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "Linux", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/**
 * @method 一屏
 * @return {int} 一屏的高度
 */
function getBgHeight() {
    var html = document.getElementsByTagName('html')[0];
    var fs = html.style.fontSize.substr(0, html.style.fontSize.length - 2);
    var minHeight = window.innerWidth < window.innerHeight ? window.innerHeight : window.innerWidth;
    if (!isPC()) {
        return minHeight;
    } else {
        if ((window.innerHeight / 6.4 / fs) > 1.8 || ( window.innerHeight / 6.4 / fs) < 1.4) {
            return 10.96 * fs;
        } else {
            return window.innerHeight;
        }
    }
}

/**
 * 输入控制
 */
var onlyNumber = {
    /***
     * 输入控制 带小数点
     * @param input
     */
    decimal: function (input) {
        var pos = input.selectionStart, oVal = input.value, nVal = '';
        for (var i = 0; i < oVal.length; i++) {
            var ch = oVal.substr(i, 1);
            ch.match(/^[0-9.]+$/) ? nVal += ch : '';
        }
        input.value = nVal;
        input.selectionStart = pos - (oVal.length - nVal.length);
        input.selectionEnd = pos - (oVal.length - nVal.length);
    },
    /**
     * 输入控制 纯数字
     * @param input
     */
    integer: function (input) {
        var pos = input.selectionStart, oVal = input.value, nVal = '';
        for (var i = 0; i < oVal.length; i++) {
            var ch = oVal.substr(i, 1);
            ch.match(/^[0-9]+$/) ? nVal += ch : '';
        }
        input.value = nVal;
        input.selectionStart = pos - (oVal.length - nVal.length);
        input.selectionEnd = pos - (oVal.length - nVal.length);
    },
    /**
     * 输入控制 带大小写X 用于身份证
     * @param input
     * @param isUpper 是否强制大写
     */
    andX: function (input, isUpper) {
        var pos = input.selectionStart, oVal = input.value, nVal = '';
        for (var i = 0; i < oVal.length; i++) {
            var ch = oVal.substr(i, 1);
            ch.match(/^[0-9Xx]+$/) ? nVal += ch : '';
        }
        input.value = isUpper ? nVal.toUpperCase() : nVal;
        input.selectionStart = pos - (oVal.length - nVal.length);
        input.selectionEnd = pos - (oVal.length - nVal.length);
    },
    /***
     * 输入控制 带所有英文字母
     * @param input
     * @param isUpper 是否强制大写
     */
    andChar: function (input, isUpper) {
        var pos = input.selectionStart, oVal = input.value, nVal = '';
        for (var i = 0; i < oVal.length; i++) {
            var ch = oVal.substr(i, 1);
            ch.match(/^[0-9a-zA-Z]+$/) ? nVal += ch : '';
        }
        input.value = isUpper ? nVal.toUpperCase() : nVal;
        input.selectionStart = pos - (oVal.length - nVal.length);
        input.selectionEnd = pos - (oVal.length - nVal.length);
    }
};

/**
 * @method 获取本地文件的路径  用于选取图片的预览
 * @param {object} obj  input
 * @return {String}
 */
function getLocalFilePath(obj) {
    var $file = $(obj);
    var fileObj = $file[0];
    var windowURL = window.URL || window.webkitURL;
    var dataURL;
    if (fileObj && fileObj.files && fileObj.files[0]) {
        dataURL = windowURL.createObjectURL(fileObj.files[0]);
    } else {
        dataURL = $file.val();
    }
    return dataURL;
}

/**
 * 字段 非undefined 非空 长度非0
 * @param val
 * @returns {boolean}
 */
function hasVal(val) {
    return (val != undefined && val != null && val.length != 0 && val != 'undefined' && val != 'null');
}

/**
 *  获取当前文件名
 */
function getFileName(){
	var str=location.pathname;
	urlStr = str.substr(str.lastIndexOf("/")+1)
	return urlStr;

}

/**
 *  时间戳转换
 */
/** 
 * 时间戳格式化函数 
 * @param  {string} format    格式 
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间 
 * @return {string}           格式化的时间字符串 
 * date('Y-m-d','1350052653');//很方便的将时间戳转换成了2012-10-11 
 * date('Y-m-d H:i:s','1350052653');//得到的结果是2012-10-12 22:37:33
 */
function date(format, timestamp){  
    var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date()); 
    var pad = function(n, c){ 
        if((n = n + "").length < c){ 
            return new Array(++c - n.length).join("0") + n; 
        } else { 
            return n; 
        } 
    }; 
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
    var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"}; 
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];  
    var f = { 
        // Day 
        d: function(){return pad(f.j(), 2)}, 
        D: function(){return f.l().substr(0,3)}, 
        j: function(){return jsdate.getDate()}, 
        l: function(){return txt_weekdays[f.w()]}, 
        N: function(){return f.w() + 1}, 
        S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'}, 
        w: function(){return jsdate.getDay()}, 
        z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0}, 
        
        // Week 
        W: function(){ 
            var a = f.z(), b = 364 + f.L() - a; 
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1; 
            if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){ 
                return 1; 
            } else{ 
                if(a <= 2 && nd >= 4 && a >= (6 - nd)){ 
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31"); 
                    return date("W", Math.round(nd2.getTime()/1000)); 
                } else{ 
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0); 
                } 
            } 
        }, 
        
        // Month 
        F: function(){return txt_months[f.n()]}, 
        m: function(){return pad(f.n(), 2)}, 
        M: function(){return f.F().substr(0,3)}, 
        n: function(){return jsdate.getMonth() + 1}, 
        t: function(){ 
            var n; 
            if( (n = jsdate.getMonth() + 1) == 2 ){ 
                return 28 + f.L(); 
            } else{ 
                if( n & 1 && n < 8 || !(n & 1) && n > 7 ){ 
                    return 31; 
                } else{ 
                    return 30; 
                } 
            } 
        }, 
        
        // Year 
        L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0}, 
        //o not supported yet 
        Y: function(){return jsdate.getFullYear()}, 
        y: function(){return (jsdate.getFullYear() + "").slice(2)}, 
        
        // Time 
        a: function(){return jsdate.getHours() > 11 ? "pm" : "am"}, 
        A: function(){return f.a().toUpperCase()}, 
        B: function(){ 
            // peter paul koch: 
            var off = (jsdate.getTimezoneOffset() + 60)*60; 
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off; 
            var beat = Math.floor(theSeconds/86.4); 
            if (beat > 1000) beat -= 1000; 
            if (beat < 0) beat += 1000; 
            if ((String(beat)).length == 1) beat = "00"+beat; 
            if ((String(beat)).length == 2) beat = "0"+beat; 
            return beat; 
        }, 
        g: function(){return jsdate.getHours() % 12 || 12}, 
        G: function(){return jsdate.getHours()}, 
        h: function(){return pad(f.g(), 2)}, 
        H: function(){return pad(jsdate.getHours(), 2)}, 
        i: function(){return pad(jsdate.getMinutes(), 2)}, 
        s: function(){return pad(jsdate.getSeconds(), 2)}, 
        //u not supported yet 
        
        // Timezone 
        //e not supported yet 
        //I not supported yet 
        O: function(){ 
            var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4); 
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t; 
            return t; 
        }, 
        P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))}, 
        //T not supported yet 
        //Z not supported yet 
        
        // Full Date/Time 
        c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()}, 
        //r not supported yet 
        U: function(){return Math.round(jsdate.getTime()/1000)} 
    }; 
        
    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){ 
        if( t!=s ){ 
            // escaped 
            ret = s; 
        } else if( f[s] ){ 
            // a date function exists 
            ret = f[s](); 
        } else{ 
            // nothing special 
            ret = s; 
        } 
        return ret; 
    }); 
}