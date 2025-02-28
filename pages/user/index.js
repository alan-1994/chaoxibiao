var e = require("../../utils/config.js"), o = e.config.sys, n = require("../../utils/md5.js"), t = getApp();

Page({
    getInfo: function() {
        var e = o.getStorageSync("globalData");
        e.userInfo && this.setData({
            userInfo: e.userInfo,
            memberid: e.memberid,
            vip: e.vip && e.vip > 0 ? "(VIP)" : ""
        });
    },
    getStorageInfo: function() {
        var e = this;
        o.getStorageInfo({
            success: function(o) {
                console.log("Key：", o.keys), console.log("使用：", o.currentSize), console.log("总：", o.limitSize);
                var n = (100 * Number((o.currentSize / o.limitSize).toFixed(3))).toFixed(1);
                e.setData({
                    currentSize: n
                });
            }
        });
    },
    data: {
        currentSize: 0,
        canIUseGetUserProfile: !1,
        userInfo: {
            avatarUrl: "https://www.eisk.cn/static/img/Head/youke.jpg",
            nickName: "游客"
        },
        memberid: 0,
        vip: ""
    },
    onLoad: function(e) {
        var n = this, t = o.getStorageSync("globalData"), a = t.isAdmin, i = t.openHidden;
        n.setData({
            isAdmin: a,
            openHidden: i
        }), n.getInfo(), n.getStorageInfo(), wx.getUserProfile && this.setData({
            canIUseGetUserProfile: !0
        });
    },
    onLaunch: function() {},
    onReady: function() {},
    onShow: function() {
        this.getStorageInfo();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindLogin: function(a) {
        var i = this;
        o.getSetting({
            success: function(a) {
                a.authSetting["scope.userInfo"] && o.getUserInfo({
                    success: function(a) {
                        t.globalData.userInfo = a.userInfo;
                        var r = o.getAccountInfoSync().miniProgram.appId, c = Date.parse(new Date()) / 1e3, s = t.globalData, g = n.hexMD5(r + e.config.AppKey + s.openid + c);
                        o.request({
                            url: e.config.Domain + "/Member/MemberRegister",
                            data: {
                                openid: s.openid,
                                userInfo: JSON.stringify(s.userInfo),
                                timestamp: c,
                                sign: g
                            },
                            method: "POST",
                            header: {
                                "content-type": "application/x-www-form-urlencoded"
                            },
                            success: function(e) {
                                console.log(e), 1 != e.data.data.memberid && (o.removeStorageSync("globalData_date"), 
                                setTimeout(function() {
                                    t.onLaunch(), o.setStorageSync("globalData", t.globalData), console.log(t.globalData), 
                                    o.showToast({
                                        title: "同步成功！",
                                        icon: "succes",
                                        duration: 1e3,
                                        mask: !0
                                    }), setTimeout(function() {
                                        i.getInfo();
                                    }, 1e3);
                                }, 2e3));
                            }
                        });
                    }
                });
            }
        });
    },
    bindLoginProfile: function(a) {
        console.log("bindLogin");
        var i = this;
        o.getSetting({
            success: function(a) {
                a.authSetting["scope.userInfo"] && (console.log(a.authSetting["scope.userInfo"]), 
                o.getUserProfile({
                    desc: "用于完善会员资料,不影响使用！",
                    success: function(a) {
                        console.log(a), t.globalData.userInfo = a.userInfo;
                        var r = o.getAccountInfoSync().miniProgram.appId, c = Date.parse(new Date()) / 1e3, s = t.globalData, g = n.hexMD5(r + e.config.AppKey + s.openid + c);
                        o.request({
                            url: e.config.Domain + "/Member/MemberRegister",
                            data: {
                                openid: s.openid,
                                userInfo: JSON.stringify(s.userInfo),
                                timestamp: c,
                                sign: g
                            },
                            method: "POST",
                            header: {
                                "content-type": "application/x-www-form-urlencoded"
                            },
                            success: function(e) {
                                console.log(e), 1 != e.data.data.memberid && (t.onLaunch(), o.setStorageSync("globalData", t.globalData), 
                                o.removeStorageSync("globalData_date"), o.showToast({
                                    title: "同步成功！",
                                    icon: "succes",
                                    duration: 1e3,
                                    mask: !0
                                }), i.getInfo());
                            }
                        });
                    },
                    fail: function(e) {
                        console.log(e.errMsg);
                    }
                }));
            }
        });
    },
    bindClearCache: function(e) {
        try {
            o.removeStorageSync("tides"), o.removeStorageSync("allNearbyAddrStr_date"), o.removeStorageSync("addrstr_date"), 
            o.removeStorageSync("addrstr"), o.removeStorageSync("allNearbyAddrStr_date"), o.removeStorageSync("cc"), 
            o.removeStorageSync("myAddrStr"), o.removeStorageSync("myUseAddrStr"), o.removeStorageSync("myNearbyAddrStr"), 
            o.removeStorageSync("myLocation"), o.removeStorageSync("isAuxiliary"), o.removeStorageSync("modeType");
            var n = o.getStorageSync("TideAddrStr");
            for (var t in n) o.removeStorageSync(n[t]);
            o.removeStorageSync("TideAddrStr"), o.showToast({
                title: "缓存清除成功！",
                icon: "succes",
                duration: 1e3,
                mask: !0
            });
        } catch (e) {
            e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
            o.showToast({
                title: "缓存清除失败！",
                icon: "error",
                duration: 1e3,
                mask: !0
            });
        }
        this.getStorageInfo();
    },
    bindToExamine: function(e) {
        o.navigateTo({
            url: "../comment/examine"
        });
    },
    bindToBasan: function(e) {
        o.navigateTo({
            url: "../basan/index"
        });
    },
    bindToActivity: function(e) {
        o.navigateTo({
            url: "../activity/index"
        });
    },
    bindShop: function(e) {
        wx.navigateToMiniProgram({
            appId: "wx5625038ae5040761",
            path: "page/index/index",
            extraData: {
                foo: "bar"
            },
            envVersion: "release",
            success: function(e) {}
        });
    },
    bindHelp: function(e) {
        o.navigateTo({
            url: "../user/help"
        });
    },
    bindToYu: function(e) {
        o.navigateTo({
            url: "../yu/index"
        });
    },
    bindConfigure: function(e) {
        o.navigateTo({
            url: "../user/configure"
        });
    },
    copymemberid: function(e) {
        o.setClipboardData({
            data: " 用户ID：" + this.data.memberid,
            success: function(e) {}
        });
    }
});