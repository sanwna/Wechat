// pages/equity/equity.js
var $ = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userName: "",
        caredfName: '',
    },
    isTrueValidateCodeBy18IdCard: function(a_idCard) {
        var sum = 0; // 声明加权求和变量
        if (a_idCard[17].toLowerCase() == 'x') {
            a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
        }
        for (var i = 0; i < 17; i++) {
            sum += Wi[i] * a_idCard[i]; // 加权求和
        }
        valCodePosition = sum % 11; // 得到验证码所位置
        if (a_idCard[17] == ValideCode[valCodePosition]) {
            return true;
        } else {
            return false;
        }
    },
    //15位身份证校验
    isValidityBrithBy15IdCard: function (idCard15) {
        var year = idCard15.substring(6, 8);
        var month = idCard15.substring(8, 10);
        var day = idCard15.substring(10, 12);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
        if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    },
    // 18位里面的生日校验
    isValidityBrithBy18IdCard: function (idCard18) {
        var year = idCard18.substring(6, 10);
        var month = idCard18.substring(10, 12);
        var day = idCard18.substring(12, 14);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    },


    // 18位最后一位校验
    isTrueValidateCodeBy18IdCard: function (a_idCard) {
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
        var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
        var sum = 0; // 声明加权求和变量
        if (a_idCard[17].toLowerCase() == 'x') {
            a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
        }
        for (var i = 0; i < 17; i++) {
            sum += Wi[i] * a_idCard[i]; // 加权求和
        }
        var valCodePosition = sum % 11; // 得到验证码所位置
        if (a_idCard[17] == ValideCode[valCodePosition]) {
            return true;
        } else {
            return false;
        }
    },
    //  身份证验证是否正确
    IdCardValidate: function(idCard) {
        var that = this;
        console.log(that)
        idCard = idCard.replace(/ /g, "");
        if (idCard.length == 15) {
            return isValidityBrithBy15IdCard(idCard);
        } else
        if (idCard.length == 18) {
            var a_idCard = idCard.split(""); // 得到身份证数组
            console.log(that)
            if (that.isValidityBrithBy18IdCard(idCard) && that.isTrueValidateCodeBy18IdCard(a_idCard)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    // 获取用户输入的姓名
    userNameInput: function(e) {
        var that = this
        that.setData({
            userName: e.detail.value
        })

        var userName = that.data.userName
        if (userName.length == 0) {
            return false;
        }
        var val_replace = userName.replace(/(^\s*)|(\s*$)/g, "");
        if (!userName.match(/^[\u2E80-\uFE4F\s?·.]+$/) || val_replace.length != userName.length) {
            wx.showModal({
                title: '',
                content: '姓名只能为中文',
            })
        }
        var lastChar = userName.substr(userName.length - 1, userName.length);
        var firstChar = userName.substr(0, 1);
        if (lastChar.match(/^[?·.]+$/) || firstChar.match(/^[?·.]+$/)) {
            wx.showModal({
                title: '',
                content: '姓名中包含特殊字符',
            })

        }
        if (lastChar.match(/^[\d]+$/) || firstChar.match(/^[\d]+$/)) {
            wx.showModal({
                title: '',
                content: '姓名中包含数字',
            })
        }

        if (userName.length < 2) {
            wx.showModal({
                title: '',
                content: '姓名最小不能小于2个字符',
            })
        } else if (userName.length > 30) {
            wx.showModal({
                title: '',
                content: '姓名最长不能超过30个字符',
            })
        }

        console.log(userName)
    },

    // 获取证件号码
    caredfNameInput: function(e) {
        console.log(e)
        var that = this
        that.setData({
            caredfName: e.detail.value
        })
        var caredfName = that.data.caredfName;
        var caredfNameLength = e.detail.cursor

    },
    // 切换证件类型IdCardValidate
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value
        })
        console.log(parseInt(this.data.index) + 1)
    },

    // 绑定发送事件
    bindecss: function(e) {
        console.log(e)
        var that = this;
        console.log(that)
        var openId = wx.getStorageSync('openId');
        var v = wx.getStorageSync('v');
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
        var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
        //实时校验数据
        if (that.data.caredfName.length != 18 && that.data.caredfName.length != 0) {
            wx.showModal({
                title: '',
                content: '身份证号码位数不为18位',
            })
            return false;
        }
        // if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(e.detail.value))) {

        //   wx.showToast({

        //     title: '身份证号码有误',

        //     duration: 2000,

        //     icon: 'none'

        //   });

        //   return false;

        // }

        if (!that.IdCardValidate(that.data.caredfName)) {
            wx.showModal({
                title: '',
                content: '请填写正确的身份证号码',
            })
            return false;
        }


    //此为发送ajax请求



    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})