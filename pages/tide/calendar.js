var e = require("../../utils/config.js"), t = e.config.sys, i = require("../../utils/md5.js");

getApp();

Page({
    id: 0,
    date: "",
    isDiy: !1,
    GetWeatherToDay: function(a) {
        var d = this, n = (t.getStorageSync("globalData"), Date.parse(new Date()) / 1e3), o = i.hexMD5(d.appId + e.config.AppKey + d.id + d.date + n);
        t.request({
            url: e.config.Domain + "/Tides/GetWeatherToDay",
            data: {
                id: d.id,
                date: d.date,
                isDiy: d.isDiy,
                timestamp: n,
                sign: o
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(e) {
                a(e.data.data);
            }
        });
    },
    data: {
        value: "2018-11-11",
        week: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        lastMonth: "lastMonth",
        nextMonth: "nextMonth",
        selectVal: "",
        GHDesc: "",
        YKDesc: "",
        isDiy: !1,
        currentTab: 0,
        modeWindType: 1
    },
    onLoad: function(e) {
        var i = this;
        i.id = e.id, i.isDiy = e.isDiy, i.setData({
            modeWindType: t.getStorageSync("modeWindType") ? t.getStorageSync("modeWindType") : 1
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    set_GHPJ: function(e) {
        return Number(e) < 50 ? "(优)" : Number(e) < 100 ? "(好)" : Number(e) < 150 ? "(一般)" : "(差)";
    },
    select: function(e) {
        var t = this;
        t.date = e.detail, t.setData({
            selectVal: t.date
        }), t.GetWeatherToDay(function(e) {
            var i = "推荐赶海时间：", a = "最佳鱼口时间：";
            if (e.key) {
                var d = e.tide.Day_High_Tide1 > e.tide.Day_High_Tide2;
                if (e.tide.Day_Time1) {
                    var n = e.tide.Day_Time1.split(":");
                    if (e.tide.Day_Time1 = n[0] + ":" + n[1], d) e.tide.State1 = "满潮"; else (o = Number(n[0]) - 4) < 0 && (o = "前天" + (24 + o)), 
                    i += o + ":" + n[1] + " - " + e.tide.Day_Time1 + "点" + t.set_GHPJ(e.tide.Day_High_Tide1) + "；", 
                    e.tide.State1 = "干潮";
                    (o = Number(n[0]) - 1) < 0 && (o = "前天" + (24 + o)), (s = Number(n[0]) + 1) > 24 && (o = "第二天" + (24 + o)), 
                    a += o + "-" + s + "点；";
                }
                if (e.tide.Day_Time2) {
                    n = e.tide.Day_Time2.split(":");
                    if (e.tide.Day_Time2 = n[0] + ":" + n[1], d) (o = Number(n[0]) - 4) < 0 && (o = "前天" + (24 + o)), 
                    i += o + ":" + n[1] + " - " + e.tide.Day_Time2 + "点" + t.set_GHPJ(e.tide.Day_High_Tide2) + "；", 
                    e.tide.State2 = "干潮"; else e.tide.State2 = "满潮";
                    (o = Number(n[0]) - 1) < 0 && (o = "前天" + (24 + o)), (s = Number(n[0]) + 1) > 24 && (o = "第二天" + (24 + o)), 
                    a += o + "-" + s + "点；";
                }
                if (e.tide.Day_Time3) {
                    n = e.tide.Day_Time3.split(":");
                    if (e.tide.Day_Time3 = n[0] + ":" + n[1], d) e.tide.State3 = "满潮"; else (o = Number(n[0]) - 4) < 0 && (o = "前天" + (24 + o)), 
                    i += o + ":" + n[1] + " - " + e.tide.Day_Time3 + "点" + t.set_GHPJ(e.tide.Day_High_Tide3) + "；", 
                    e.tide.State3 = "干潮";
                    (o = Number(n[0]) - 1) < 0 && (o = "前天" + (24 + o)), (s = Number(n[0]) + 1) > 24 && (o = "第二天" + (24 + o)), 
                    a += o + "-" + s + "点；";
                }
                if (e.tide.Day_Time4) {
                    var o, s;
                    n = e.tide.Day_Time4.split(":");
                    if (e.tide.Day_Time4 = n[0] + ":" + n[1], d) (o = Number(n[0]) - 4) < 0 && (o = "前天" + (24 + o)), 
                    i += o + ":" + n[1] + " - " + e.tide.Day_Time4 + "点" + t.set_GHPJ(e.tide.Day_High_Tide4) + "；", 
                    e.tide.State4 = "干潮"; else e.tide.State4 = "满潮";
                    (o = Number(n[0]) - 1) < 0 && (o = "前天" + (24 + o)), (s = Number(n[0]) + 1) > 24 && (o = "第二天" + (24 + o)), 
                    a += o + "-" + s + "点；";
                }
            }
            t.setData({
                weather: e,
                GHDesc: i,
                YKDesc: a
            });
        });
    },
    toggleType: function() {
        this.selectComponent("#Calendar").toggleType();
    },
    bindOk: function(e) {
        var i = this.data.selectVal;
        t.setStorageSync("selectDate", i), t.navigateBack();
    }
});