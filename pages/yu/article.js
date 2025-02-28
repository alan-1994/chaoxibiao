var t = require("../../utils/config.js"), e = t.config.sys, n = require("../../utils/md5.js");

getApp();

Page({
    appId: t.config.appId,
    id: "",
    get_info: function(i) {
        var a = this, o = e.getStorageSync("globalData"), c = Date.parse(new Date()) / 1e3, s = n.hexMD5(a.appId + t.config.AppKey + o.memberid + a.id + c);
        e.request({
            url: t.config.Domain + "/Fish/GetFish",
            data: {
                id: a.id,
                uid: o.memberid,
                page: a.page,
                count: a.count,
                timestamp: c,
                sign: s
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                var e = t.data.data;
                e.ImgList = JSON.parse(e.ImgList).data, e.AnotherNameAll = JSON.parse(e.AnotherNameAll), 
                i(e);
            }
        });
    },
    data: {
        current: 0
    },
    onLoad: function(t) {
        this.id = t.id;
    },
    onReady: function() {},
    onShow: function() {
        var t = this;
        t.get_info(function(n) {
            console.log(n), e.setNavigationBarTitle({
                title: n.NameCN + "(" + n.NameEN + ")"
            }), t.setData({
                activity: n
            });
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    swiperChange: function(t) {
        "touch" == t.detail.source && this.setData({
            current: t.detail.current
        });
    }
});