require("../../utils/config.js").config.sys, require("../../utils/md5.js"), getApp();

Page({
    data: {
        url: ""
    },
    onLoad: function(n) {
        this.setData({
            url: decodeURI(n.url)
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