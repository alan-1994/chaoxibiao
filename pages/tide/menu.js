var t, e = require("../../@babel/runtime/helpers/defineProperty"), a = require("../../utils/config.js"), n = a.config.sys, i = require("../../utils/md5.js"), r = (getApp(), 
null);

Page((e(t = {
    appId: a.config.appId,
    addrstr: [],
    myAddrStr: [],
    myUseAddrStr: [],
    get_AddrStr: function(t) {
        var e = n.getStorageSync("addrstr"), r = n.getStorageSync("addrstr_date"), d = Date.parse(new Date(r)), o = (Date.parse(new Date(new Date())) - d) % 864e5, s = Math.floor(o / 36e5);
        if (!e || s > 22 || isNaN(s)) {
            var c = n.getStorageSync("globalData"), l = Date.parse(new Date()) / 1e3, u = i.hexMD5(this.appId + a.config.AppKey + c.memberid + l);
            n.request({
                url: a.config.Domain + "/Tides/GetAddrStr",
                method: "GET",
                data: {
                    uid: c.memberid,
                    timestamp: l,
                    sign: u
                },
                header: {
                    "content-type": "application/json"
                },
                success: function(e) {
                    e.data.data = [ {
                        label: "请选择",
                        level: 1,
                        value: 0,
                        children: [ {
                            label: "请选择",
                            level: 2,
                            value: 0,
                            children: [ {
                                label: "请选择",
                                level: 3,
                                value: 0
                            } ]
                        } ]
                    } ].concat(e.data.data), n.setStorageSync("addrstr", e.data), n.setStorageSync("addrstr_date", new Date()), 
                    e.data.data.splice(0, 1), t(e.data);
                }
            });
        } else e.data.splice(0, 1), t(e);
    },
    get_my_AddrStr: function(t, e) {
        var r = n.getStorageSync("globalData"), d = Date.parse(new Date()) / 1e3, o = i.hexMD5(this.appId + a.config.AppKey + r.memberid + d);
        n.request({
            url: a.config.Domain + "/Tides/GetMyAllAddrStr",
            data: {
                longitude: t.longitude,
                latitude: t.latitude,
                uid: r.memberid,
                timestamp: d,
                sign: o
            },
            method: "GET",
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                n.setStorageSync("myAddrStr", t.data.data), e(t.data.data);
            }
        });
    },
    mapDistance: function(t, e) {
        var a = t, i = e, r = n.getStorageSync("myLocation");
        if (!r) return 1e7;
        var d = r.longitude, o = r.latitude, s = i * Math.PI / 180, c = o * Math.PI / 180, l = s - c, u = a * Math.PI / 180 - d * Math.PI / 180, g = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(l / 2), 2) + Math.cos(s) * Math.cos(c) * Math.pow(Math.sin(u / 2), 2)));
        return g *= 6378.137, g = Math.round(1e4 * g) / 1e4, g *= 1e3, isNaN(g) ? 0 : g;
    },
    get_nearbyAddrStr: function(t, e) {
        if (this.mapDistance(t.longitude, t.latitude) < 1e3) {
            var i = n.getStorageSync("myNearbyAddrStr");
            if (i) return void e(i);
        }
        n.request({
            url: a.config.Domain + "/Tides/GetNearbyAddrStr",
            data: {
                longitude: t.longitude,
                latitude: t.latitude,
                distance: 1e5
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(a) {
                n.setStorageSync("myLocation", t), n.setStorageSync("myNearbyAddrStr", a.data.data), 
                e(a.data.data);
            }
        });
    },
    get_multiArray: function(t) {
        for (var e = this, a = 0; a < e.addrstr.length; a++) {
            if (e.addrstr[a].label.indexOf(t) > -1) return [ a, -1, -1 ];
            for (var n = 0; n < e.addrstr[a].children.length; n++) {
                if (e.addrstr[a].children[n].label.indexOf(t) > -1) return [ a, n, -1 ];
                for (var i = 0; i < e.addrstr[a].children[n].children.length; i++) {
                    if (e.addrstr[a].children[n].children[i].label.indexOf(t) > -1) return [ a, n, i ];
                }
            }
        }
        return null;
    },
    get_location: function(t) {
        var e = this;
        n.getLocation({
            success: function(a) {
                e.location = a, t(a);
            }
        });
    },
    data: {
        addrstr: [],
        nearbyAddrStr: [],
        myAddrStr: [],
        myUseAddrStr: [],
        index: -1,
        searchAddrstr: "",
        isModel: "display: none;"
    },
    onLoad: function(t) {
        var e = this;
        if (n.createInterstitialAd && ((r = n.createInterstitialAd({
            adUnitId: "adunit-75940cd37e50aabc"
        })).onLoad(function() {}), r.onError(function(t) {}), r.onClose(function() {})), 
        t.m) switch (t.m) {
          case "gh":
            n.setStorageSync("modeType", 2);
            break;

          case "dy":
            n.setStorageSync("modeType", 1);
        }
        if (t.path) switch (t.path) {
          case "tide":
            n.navigateTo({
                url: "../tide/index?id=" + t.id + "&date=" + t.date
            });
            break;

          case "article":
            n.navigateTo({
                url: "../article/index?id=" + t.id
            });
            break;

          case "activity":
            n.navigateTo({
                url: "../activity/index?id=" + t.id
            });
            break;

          case "basan":
            n.navigateTo({
                url: "../basan/index?id=" + t.id
            });
            break;

          case "t":
            n.navigateTo({
                url: "../tide/index?id=" + t.id + "&date=" + t.date
            });
            break;

          case "a":
            n.navigateTo({
                url: "../article/index?id=" + t.id
            });
            break;

          case "b":
            n.navigateTo({
                url: "../basan/index?id=" + t.id
            });
            break;

          case "a2":
            n.navigateTo({
                url: "../activity/index?id=" + t.id
            });
        }
        e.myUseAddrStr = n.getStorageSync("myUseAddrStr"), e.setData({
            myUseAddrStr: e.myUseAddrStr
        }), e.get_AddrStr(function(t) {
            e.addrstr = t.data, e.setData({
                addrstr: e.addrstr
            });
        }), n.getStorageSync("modeType") ? e.get_location(function(t) {
            e.get_nearbyAddrStr(t, function(t) {
                e.setData({
                    nearbyAddrStr: t
                });
            }), e.get_my_AddrStr(t, function(t) {
                e.setData({
                    createAddrStr: t
                });
            });
        }) : e.setData({
            isModel: "display: block;"
        });
    },
    onReady: function() {},
    onShow: function() {
        console.log("onShow");
        var t = this;
        t.myUseAddrStr = n.getStorageSync("myUseAddrStr"), t.setData({
            myUseAddrStr: t.myUseAddrStr
        }), n.getStorageSync("upMyaddrstr") && (n.setStorageSync("upMyaddrstr", !1), t.get_location(function(e) {
            t.get_nearbyAddrStr(e, function(e) {
                t.setData({
                    nearbyAddrStr: e
                });
            }), t.get_my_AddrStr(e, function(e) {
                t.setData({
                    createAddrStr: e
                });
            });
        }));
        var e = n.getStorageSync("globalData"), a = n.getStorageSync("AdDate"), i = Date.parse(new Date(a)), d = ((Date.parse(new Date(new Date())) - i) % 864e5 / 36e5).toFixed(2);
        (!e.vip || e.vip < 1) && (isNaN(d) || d > 1 && d < 2 ? (1 == e.isAdmin && n.showToast({
            title: "超过" + d + "小时，重新唤醒广告时间！",
            icon: "none",
            duration: 2e3,
            mask: !0
        }), n.setStorageSync("AdDate", new Date())) : r && d >= 1 ? (n.setStorageSync("AdDate", new Date()), 
        1 == e.isAdmin && n.showToast({
            title: "这是广告！",
            icon: "none",
            duration: 2e3,
            mask: !0
        }), r.show().catch(function(t) {
            1 == e.isAdmin && n.showToast({
                title: "广告拉取失败：" + JSON.stringify(t),
                icon: "none",
                duration: 5e3,
                mask: !0
            });
        })) : 1 == e.isAdmin && n.showToast({
            title: d + "小时，不在广告拉取时间！",
            icon: "none",
            duration: 2e3,
            mask: !0
        }));
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    binAddAddrStr: function(t) {
        var e = this;
        e.location.latitude ? n.navigateTo({
            url: "../tide/edit?type=add&lat=" + e.location.latitude.toFixed(4) + "&lng=" + e.location.longitude.toFixed(4)
        }) : n.showToast({
            title: "无法获取位置数据，请从地图中添加！",
            icon: "none",
            duration: 2e3,
            mask: !0
        });
    },
    bindSelectProvince: function(t) {
        var e = t.currentTarget.dataset.id;
        this.setData({
            index: e
        });
    },
    binSelectdPosition: function(t) {
        var e = this;
        e.get_location(function(t) {
            e.get_nearbyAddrStr(t, function(t) {
                e.setData({
                    nearbyAddrStr: t,
                    isModel: "display: none;"
                });
            }), e.get_my_AddrStr(t, function(t) {
                e.setData({
                    createAddrStr: t
                });
            });
        });
    },
    bindOpenTide: function(t) {
        var e = t.currentTarget.dataset.value, a = n.getStorageSync("globalData"), i = (a.isAdmin, 
        a.openHidden);
        a.vip;
        i || a.vip ? n.navigateTo({
            url: "../tide/index?id=" + e
        }) : n.navigateTo({
            url: "../tide/newspaper?id=" + e
        });
    },
    bindOpenDiyTide: function(t) {
        var e = t.currentTarget.dataset.value;
        n.navigateTo({
            url: "../tide/index?type=diy&id=" + e
        });
    },
    bindEditTide: function(t) {
        var e = t.currentTarget.dataset.value;
        n.navigateTo({
            url: "../tide/edit?type=edit&id=" + e
        });
    },
    binRefreshAddrStr: function(t) {
        var e = this;
        n.setStorageSync("addrstr_date", ""), e.get_AddrStr(function(t) {
            e.addrstr = t.data, e.setData({
                addrstr: e.addrstr
            });
        });
    },
    binSearch: function(t) {
        var e = this, a = t.detail.value.text;
        if (0 != a.length) {
            var i = e.get_multiArray(a);
            if (null != i) {
                var r = e.addrstr, d = "";
                if (-1 != i[2]) {
                    var o = r[i[0]].children[i[1]].children[i[2]].label;
                    d = "city_" + i[1], n.showModal({
                        title: "打开潮汐？",
                        content: "找到：" + o + ",是否立刻打开？",
                        success: function(t) {
                            if (t.confirm) {
                                var e = r[i[0]].children[i[1]].children[i[2]].value;
                                n.setStorageSync("AddrStr_ID", e), n.navigateTo({
                                    url: "../tide/index"
                                });
                            } else n.showToast({
                                title: a + " 已找到在 " + r[i[0]].children[i[1]].label + " 里面！",
                                icon: "none",
                                duration: 2e3,
                                mask: !0
                            });
                        }
                    });
                } else -1 != i[1] && (n.showToast({
                    title: a + " 已找到在 " + r[i[0]].label + " 里面！",
                    icon: "none",
                    duration: 2e3,
                    mask: !0
                }), d = "city_" + i[1]);
                e.setData({
                    index: i[0],
                    toView: d
                });
            } else n.showToast({
                title: "找不到[" + a + "]相关信息！",
                icon: "none",
                duration: 2e3,
                mask: !0
            });
        } else n.showToast({
            title: "请输入搜索内容！",
            icon: "none",
            duration: 1e3,
            mask: !0
        });
    }
}, "binSearch", function(t) {
    var e = this;
    n.chooseLocation({
        success: function(a) {
            e.searchAddrstr = a, console.log(a), e.setData({
                searchAddrstr: e.searchAddrstr.name
            }), e.binOpenSearch(t);
        }
    });
}), e(t, "binOpenSearch", function(t) {
    var e = this;
    e.searchAddrstr ? n.showModal({
        title: "查看潮汐数据",
        content: "是否要查看【" + e.searchAddrstr.name + "】潮汐数据？",
        success: function(t) {
            t.confirm ? n.navigateTo({
                url: "../tide/index?type=posit&lat=" + e.searchAddrstr.latitude.toFixed(4) + "&lng=" + e.searchAddrstr.longitude.toFixed(4)
            }) : t.cancel;
        }
    }) : n.showToast({
        title: "请输入要查找的地方！",
        icon: "none",
        duration: 2e3,
        mask: !0
    });
}), e(t, "binModel1", function(t) {
    n.setStorageSync("modeType", 1), n.showToast({
        title: "钓鱼模式！",
        icon: "none",
        duration: 1e3,
        mask: !0
    }), this.setData({
        isModel: ""
    });
}), e(t, "binModel2", function(t) {
    n.setStorageSync("modeType", 2), n.showToast({
        title: "赶海模式！",
        icon: "none",
        duration: 1e3,
        mask: !0
    }), this.setData({
        isModel: ""
    });
}), t));