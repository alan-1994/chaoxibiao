var e = require("../../utils/config.js").config.sys;

require("../../utils/md5.js"), getApp();

Page({
    getInfo: function() {
        var n = e.getStorageSync("globalData");
        n.userInfo && this.setData({
            userInfo: n.userInfo,
            memberid: n.memberid
        });
    },
    data: {
        currentSize: 0,
        canIUseGetUserProfile: !1,
        userInfo: {
            avatarUrl: "https://www.eisk.cn/static/img/Head/youke.jpg",
            nickName: "游客"
        },
        memberid: 0
    },
    onLoad: function(n) {
        var t = e.getStorageSync("globalData"), o = t.isAdmin, i = t.openHidden;
        this.setData({
            isAdmin: o,
            openHidden: i
        }), this.getInfo(), wx.getUserProfile && this.setData({
            canIUseGetUserProfile: !0
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