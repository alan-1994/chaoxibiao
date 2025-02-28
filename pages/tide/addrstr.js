var e = require("../../utils/config.js"), t = e.config.sys;

require("../../utils/md5.js"), getApp();

Page({
    get_allNearbyAddrStr: function(a) {
        var n = t.getStorageSync("allNearbyAddrStr"), r = t.getStorageSync("allNearbyAddrStr_date"), o = Date.parse(new Date(r)), d = (Date.parse(new Date(new Date())) - o) % 864e5, i = Math.floor(d / 36e5);
        if (!n || i > 24 || isNaN(i)) {
            t.request({
                url: e.config.Domain + "/Tides/GetAllNearbyAddrStr",
                method: "GET",
                header: {
                    "content-type": "application/json"
                },
                success: function(e) {
                    t.setStorageSync("allNearbyAddrStr", e.data.data), t.setStorageSync("allNearbyAddrStr_date", new Date()), 
                    a(e.data.data);
                }
            });
        } else a(n);
    },
    data: {
        AddrStr: []
    },
    onLoad: function(e) {
        var t = this;
        t.get_allNearbyAddrStr(function(e) {
            t.setData({
                AddrStr: e
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