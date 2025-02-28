var t = require("../../utils/config.js"), e = t.config.sys, a = require("../../utils/md5.js");

getApp();

Page({
    location: {},
    appId: t.config.appId,
    info: {},
    get_nearbyAddrStr: function(a, i) {
        e.request({
            url: t.config.Domain + "/Tides/GetNearbyAddrStr",
            data: {
                longitude: a.longitude,
                latitude: a.latitude,
                distance: 1e5
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                i(t.data.data);
            }
        });
    },
    get_my_AddrStr: function(i, n) {
        var o = e.getStorageSync("globalData"), d = Date.parse(new Date()) / 1e3, r = a.hexMD5(this.appId + t.config.AppKey + o.memberid + d);
        e.request({
            url: t.config.Domain + "/Tides/GetMyAllAddrStr",
            data: {
                longitude: i.longitude,
                latitude: i.latitude,
                uid: o.memberid,
                timestamp: d,
                sign: r
            },
            method: "GET",
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                e.setStorageSync("myAddrStr", t.data.data), n(t.data.data);
            }
        });
    },
    get_allNearbyAddrStr: function(a) {
        var i = e.getStorageSync("allNearbyAddrStr"), n = e.getStorageSync("allNearbyAddrStr_date"), o = Date.parse(new Date(n)), d = (Date.parse(new Date(new Date())) - o) % 864e5, r = Math.floor(d / 36e5);
        if (!i || r > 24 || isNaN(r)) {
            e.request({
                url: t.config.Domain + "/Tides/GetAllNearbyAddrStr",
                method: "GET",
                header: {
                    "content-type": "application/json"
                },
                success: function(t) {
                    e.setStorageSync("allNearbyAddrStr", t.data.data), e.setStorageSync("allNearbyAddrStr_date", new Date()), 
                    a(t.data.data);
                }
            });
        } else a(i);
    },
    data: {
        markers: [],
        isAdmin: !1,
        isMap: !1
    },
    onLoad: function(t) {
        var a = this;
        e.getSystemInfo({
            success: function(t) {
                a.info = t, a.movPosition();
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = this, a = e.getStorageSync("upMyaddrstr2");
        a && (console.log(a), e.setStorageSync("upMyaddrstr2", !1), t.get_my_AddrStr(t.location, function(e) {
            t.movPosition();
        }));
        var i = e.getStorageSync("globalData").isAdmin;
        t.setData({
            isAdmin: i
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    movPosition: function() {
        var t = this;
        t.data.markers = [], e.getLocation({
            success: function(a) {
                t.location = a, t.setData({
                    latitude: a.latitude.toFixed(4),
                    longitude: a.longitude.toFixed(4),
                    scale: 11
                }), t.get_allNearbyAddrStr(function(e) {
                    t.setData({
                        markers: t.data.markers.concat(t.getSchoolMarkers(e, ""))
                    });
                });
                var i = e.getStorageSync("myAddrStr");
                t.setData({
                    markers: t.data.markers.concat(t.getSchoolMarkers(i, "wharf.png"))
                });
            }
        });
    },
    bindTapPosition: function(t) {
        this.movPosition();
    },
    bindTapAdd: function(t) {
        e.navigateTo({
            url: "../tide/edit?type=add&lat=" + this.location.latitude.toFixed(4) + "&lng=" + this.location.longitude.toFixed(4)
        });
    },
    bindTapSearch: function(t) {
        var a = this;
        e.chooseLocation({
            success: function(t) {
                a.location.latitude = t.latitude, a.location.longitude = t.longitude, a.setData({
                    latitude: t.latitude,
                    longitude: t.longitude
                });
            }
        });
    },
    bindMarkertap: function(t) {
        var a = t.detail.markerId + "", i = "../tide/index?id=" + a, n = e.getStorageSync("globalData"), o = (n.isAdmin, 
        n.openHidden);
        n.vip;
        i = o || n.vip ? "../tide/index?id=" + a : "../tide/newspaper?id=" + a, a.indexOf("Diy_") > -1 && (i = "../tide/index?id=" + a.replace("Diy_", "") + "&type=diy"), 
        e.navigateTo({
            url: i
        });
    },
    bindOpenPosition: function(t) {
        var a = "../tide/index?type=posit&lat=" + this.location.latitude.toFixed(4) + "&lng=" + this.location.longitude.toFixed(4);
        e.navigateTo({
            url: a
        });
    },
    bindTapMap: function(t) {
        this.setData({
            isMap: !this.data.isMap
        });
    },
    bindRegionchange: function(t) {
        if ("end" == t.type && ("scale" == t.causedBy || "drag" == t.causedBy)) {
            var a = this;
            this.mapCtx = e.createMapContext("map"), this.mapCtx.getCenterLocation({
                type: "gcj02",
                success: function(t) {
                    t.latitude && (a.location = t, a.setData({
                        latitude: t.latitude.toFixed(4),
                        longitude: t.longitude.toFixed(4)
                    }));
                }
            });
        }
    },
    getSchoolMarkers: function(t, e) {
        var a = [];
        for (var i in t) {
            var n = this.createMarker(t[i], e);
            a.push(n);
        }
        return a;
    },
    createMarker: function(t, e) {
        var a = 35, i = "#16398c", n = 12, o = t.ID, d = 0;
        try {
            "android" == this.info.platform && (d = .5);
        } catch (t) {}
        return 0 == e.length ? e = "wharf2.png" : (a = 22, i = "#d43d23", n = 10, o = "Diy_" + o), 
        {
            iconPath: "/images/menuicon/" + e,
            id: o || 0,
            name: t.AddrStr_Name || "",
            title: t.AddrStr_Name || "",
            latitude: t.Position_Latitude,
            longitude: t.Position_Longitude,
            label: {
                fontSize: n,
                anchorX: -d * (t.AddrStr_Name.length * n),
                anchorY: 0,
                textAlign: "center",
                color: i,
                content: t.AddrStr_Name
            },
            width: a,
            height: a
        };
    }
});