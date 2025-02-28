require("../../@babel/runtime/helpers/interopRequireWildcard")(require("../../ec-canvas/echarts"));

var e = require("../../utils/config.js"), t = e.config.sys, a = require("../../utils/md5.js"), i = new (require("../../utils/qqmap-wx-jssdk.min.js"))({
    key: "VQCBZ-QINKW-TN2RB-RJEDX-HG4E3-T6FAO"
});

getApp();

Page({
    appId: t.getAccountInfoSync().miniProgram.appId,
    isAdd: !1,
    location: {},
    id: 0,
    consultId: 0,
    isUpdata: !1,
    getAddstrName: function(e) {
        i.reverseGeocoder({
            location: this.location,
            success: function(t) {
                e(t.result.address_component);
            }
        });
    },
    computeTides: function(i) {
        var d = this, o = t.getStorageSync("globalData"), n = Date.parse(new Date()) / 1e3, r = a.hexMD5(d.appId + e.config.AppKey + o.secret + o.memberid + n);
        t.request({
            url: e.config.Domain + "/Tides/ComputeTides",
            data: {
                uid: o.memberid,
                latitude: d.location.latitude,
                longitude: d.location.longitude,
                timestamp: n,
                sign: r
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(e) {
                if (d.data.isAdmin) {
                    var a = e.data.data.Consult_Name + "(" + e.data.data.AI_Rise_Gap + "," + e.data.data.AI_Retreat_Gap + ")";
                    t.showToast({
                        title: a,
                        icon: "succes",
                        duration: 3e3,
                        mask: !0
                    });
                }
                i(e.data.data);
            }
        });
    },
    get_my_AddrStr: function(i) {
        var d = this, o = t.getStorageSync("globalData"), n = Date.parse(new Date()) / 1e3, r = a.hexMD5(d.appId + e.config.AppKey + d.id + o.memberid + n);
        t.request({
            url: e.config.Domain + "/Tides/GetMyAddrStr",
            data: {
                id: d.id,
                uid: o.memberid,
                timestamp: n,
                sign: r
            },
            method: "GET",
            header: {
                "content-type": "application/json"
            },
            success: function(e) {
                i(e.data.data);
            }
        });
    },
    data: {
        isAdmin: !1,
        isAdd: !1,
        location: {},
        AddrStr_Name: "",
        AddrStr_City: "",
        AddrStr_Province: "",
        Retreat_Gap: 0,
        Rise_Gap: 0,
        WaterLevel: 0,
        AI_Retreat_Gap: 0,
        AI_Rise_Gap: 0,
        AI_WaterLevel: 0
    },
    onLoad: function(e) {
        var a = this;
        switch (e.type) {
          case "add":
            a.isAdd = !0, e.lat && (a.location.latitude = e.lat), e.lng && (a.location.longitude = e.lng), 
            a.setData({
                isAdd: a.isAdd,
                location: a.location
            }), a.isAdd && a.location.latitude && a.location.longitude && a.getAddstrName(function(e) {
                a.computeTides(function(e) {
                    e ? (a.consultId = e.Consult_ID, a.setData({
                        Retreat_Gap: e.Retreat_Gap,
                        Rise_Gap: e.Rise_Gap,
                        WaterLevel: e.WaterLevel,
                        AI_Retreat_Gap: e.AI_Retreat_Gap,
                        AI_Rise_Gap: e.AI_Rise_Gap,
                        AI_WaterLevel: e.AI_WaterLevel
                    }), console.log(a.data)) : t.showToast({
                        title: "无法计算该坐标潮汐！！",
                        icon: "none",
                        duration: 3e3,
                        mask: !0
                    });
                }), a.setData({
                    Title: "新建潮汐点",
                    AddrStr_Name: e.street,
                    AddrStr_City: e.city,
                    AddrStr_Province: e.province.replace("省", "")
                });
            });
            break;

          case "edit":
            a.isAdd = !1, a.id = e.id, a.get_my_AddrStr(function(e) {
                a.location.longitude = e.Position_Longitude, a.location.latitude = e.Position_Latitude, 
                a.consultId = e.Consult_ID, a.setData({
                    Title: e.AddrStr_Name,
                    AddrStr_Name: e.AddrStr_Name,
                    AddrStr_City: e.AddrStr_City,
                    AddrStr_Province: e.AddrStr_Province,
                    location: a.location,
                    Retreat_Gap: e.Retreat_Gap,
                    Rise_Gap: e.Rise_Gap,
                    WaterLevel: e.WaterLevel,
                    AI_Retreat_Gap: e.AI_Retreat_Gap,
                    AI_Rise_Gap: e.AI_Rise_Gap,
                    AI_WaterLevel: e.AI_WaterLevel
                });
            });
        }
        var i = t.getStorageSync("globalData").isAdmin;
        this.setData({
            isAdmin: i
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindPosition: function(e) {
        var a = this;
        t.chooseLocation({
            success: function(e) {
                a.location.latitude = e.latitude.toFixed(4), a.location.longitude = e.longitude.toFixed(4), 
                a.setData({
                    location: a.location
                }), a.computeTides(function(e) {
                    e ? (a.consultId = e.Consult_ID, a.setData({
                        Retreat_Gap: e.Retreat_Gap,
                        Rise_Gap: e.Rise_Gap,
                        WaterLevel: e.WaterLevel,
                        AI_Retreat_Gap: e.AI_Retreat_Gap,
                        AI_Rise_Gap: e.AI_Rise_Gap,
                        AI_WaterLevel: e.AI_WaterLevel
                    }), console.log(a.data)) : t.showToast({
                        title: "无法计算该坐标潮汐！！",
                        icon: "none",
                        duration: 3e3,
                        mask: !0
                    });
                }), a.getAddstrName(function(e) {
                    console.log(e), a.setData({
                        AddrStr_Name: e.street,
                        AddrStr_City: e.city,
                        AddrStr_Province: e.province.replace("省", "")
                    });
                });
            }
        });
    },
    bindSave: function(i) {
        var d = this, o = i.detail.value;
        if (o.AddrStr_Name.length < 1 || o.AddrStr_Province.length < 1 || o.AddrStr_City.length < 1 || o.Longitude.length < 1 || o.Latitude.length < 1) t.showToast({
            title: "数据不完整！",
            icon: "none",
            duration: 1e3,
            mask: !0
        }); else if (1 != d.isUpdata) {
            d.isUpdata = !0;
            var n = t.getStorageSync("globalData"), r = Date.parse(new Date()) / 1e3, s = a.hexMD5(d.appId + e.config.AppKey + n.secret + d.id + n.memberid + r), c = {
                AddrStr_ID: d.id,
                AddrStr_Name: o.AddrStr_Name,
                AddrStr_Province: o.AddrStr_Province,
                AddrStr_City: o.AddrStr_City,
                Position_AddrStr: o.AddrStr_Name,
                Position_Longitude: o.Longitude,
                Position_Latitude: o.Latitude,
                WaterLevel: d.data.AI_WaterLevel + o.WaterLevel,
                Retreat_Gap: d.data.AI_Retreat_Gap + o.Retreat_Gap,
                Rise_Gap: d.data.AI_Rise_Gap + o.Rise_Gap,
                AI_Retreat_Gap: d.data.AI_Retreat_Gap,
                AI_Rise_Gap: d.data.AI_Rise_Gap,
                AI_WaterLevel: d.data.AI_WaterLevel,
                Consult_ID: d.consultId,
                MemberID: n.memberid,
                uid: n.memberid,
                timestamp: r,
                sign: s
            }, l = e.config.Domain + "/Tides/SaveMyAddrStr";
            d.data.isSys && (l = e.config.Domain + "/Tides/SaveSysAddrStr"), t.request({
                url: l,
                data: c,
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function(e) {
                    t.showToast({
                        title: e.data.msg,
                        icon: "none",
                        duration: 2e3,
                        mask: !0
                    }), d.isUpdata = !1, t.setStorageSync("upMyaddrstr", !0), t.setStorageSync("upMyaddrstr2", !0), 
                    setTimeout(function() {
                        t.navigateBack();
                    }, 1e3);
                }
            });
        }
    },
    bindDel: function(i) {
        var d = this;
        d.isAdd || t.showModal({
            title: "删除",
            content: "删除该潮汐点(不可恢复)？",
            success: function(i) {
                if (i.confirm) {
                    var o = t.getStorageSync("globalData"), n = Date.parse(new Date()) / 1e3, r = a.hexMD5(d.appId + e.config.AppKey + o.secret + d.id + "" + o.memberid + n);
                    t.request({
                        url: e.config.Domain + "/Tides/DelMyAddrStr",
                        data: {
                            id: d.id,
                            uid: o.memberid,
                            timestamp: n,
                            sign: r
                        },
                        method: "POST",
                        header: {
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        success: function(e) {
                            t.showToast({
                                title: e.data.msg,
                                icon: "none",
                                duration: 2e3,
                                mask: !0
                            }), t.setStorageSync("upMyaddrstr", !0), t.setStorageSync("upMyaddrstr2", !0), setTimeout(function() {
                                t.navigateBack();
                            }, 1e3);
                        }
                    });
                }
            }
        });
    },
    bindIsSys: function(e) {
        var t = this;
        t.data.isSys = e.detail.value, t.setData({
            isSys: t.data.isSys
        });
    }
});