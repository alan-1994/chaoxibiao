var t = require("../../utils/config.js"), e = t.config.sys;

require("../../utils/md5.js"), getApp();

Page({
    get_nearbyAddrStr: function(n, a) {
        e.request({
            url: t.config.Domain + "/Tides/GetNearbyAddrStr",
            data: {
                longitude: n.longitude,
                latitude: n.latitude,
                distance: 1e5
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                a(t.data.data);
            }
        });
    },
    data: {
        value: "2018-11-11",
        week: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        lastMonth: "lastMonth",
        nextMonth: "nextMonth",
        selectVal: "",
        nearbyAddrStr: [],
        myAddrStr: []
    },
    get_location: function(t) {
        var n = this;
        e.getLocation({
            success: function(e) {
                n.location = e, t(e);
            }
        });
    },
    onLoad: function(t) {
        var n = this;
        n.get_location(function(t) {
            n.get_nearbyAddrStr(t, function(t) {
                n.setData({
                    nearbyAddrStr: t
                });
            });
        });
        var a = e.getStorageSync("myAddrStr");
        n.setData({
            createAddrStr: a
        });
    },
    onReady: function() {},
    onShow: function() {
        ("" + e.getStorageSync("AddrStr_ID")).length > 0 && e.getStorageSync("AddrStr_ID"), 
        ("" + e.getStorageSync("AddrStr_Name")).length > 0 && e.getStorageSync("AddrStr_Name");
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    select: function(t) {
        this.setData({
            selectVal: t.detail
        });
    },
    toggleType: function() {
        this.selectComponent("#Calendar").toggleType();
    },
    bindSelectNearby: function(t) {
        var n = t.target.dataset.id, a = this.data.selectVal;
        e.navigateTo({
            url: "../tide/index?id=" + n + "&date=" + a
        });
    },
    bindSelectMy: function(t) {
        var n = t.target.dataset.id, a = this.data.selectVal;
        e.navigateTo({
            url: "../tide/index?type=diy&id=" + n + "&date=" + a
        });
    }
});