var n = require("../../utils/config.js");

n.config.sys, require("../../utils/md5.js"), getApp();

Page({
    GetHelpUrl: function(o) {
        wx.request({
            url: n.config.Domain + "/Tides/GetHelpUrl",
            method: "GET",
            dataType: "json",
            success: function(n) {
                console.log(n.data.data), o(n.data.data);
            },
            fail: function(n) {
                o("https://mp.weixin.qq.com/s/9aFEioEhW6PYeg9nXNsHyw");
            }
        });
    },
    data: {
        url: ""
    },
    onLoad: function(n) {
        var o = this;
        o.GetHelpUrl(function(n) {
            o.setData({
                url: n
            });
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});