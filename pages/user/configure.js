var e = require("../../utils/config.js").config.sys;

require("../../utils/md5.js"), getApp();

Page({
    getStorageInfo: function() {
        var o = this;
        e.getStorageInfo({
            success: function(e) {
                console.log("Key：", e.keys), console.log("使用：", e.currentSize), console.log("总：", e.limitSize);
                var t = (100 * Number((e.currentSize / e.limitSize).toFixed(3))).toFixed(1);
                o.setData({
                    currentSize: t
                });
            }
        });
    },
    data: {
        currentSize: 0,
        canIUseGetUserProfile: !1,
        radioTideType: 1,
        radioWindType: 1,
        radioIsComment: 1
    },
    onLoad: function(o) {
        var t = e.getStorageSync("globalData"), n = t.isAdmin, r = t.openHidden, a = e.getStorageSync("modeType"), i = e.getStorageSync("modeWindType") ? e.getStorageSync("modeWindType") : 1, d = e.getStorageSync("isComment") ? e.getStorageSync("isComment") : 1;
        this.setData({
            isAdmin: n,
            openHidden: r,
            radioTideType: a,
            radioWindType: i,
            radioIsComment: d
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
    bindClearCache: function(o) {
        try {
            e.removeStorageSync("tides"), e.removeStorageSync("allNearbyAddrStr_date"), e.removeStorageSync("addrstr_date"), 
            e.removeStorageSync("addrstr"), e.removeStorageSync("allNearbyAddrStr_date"), e.removeStorageSync("cc"), 
            e.removeStorageSync("myAddrStr"), e.removeStorageSync("myUseAddrStr"), e.removeStorageSync("myNearbyAddrStr"), 
            e.removeStorageSync("myLocation"), e.removeStorageSync("isAuxiliary"), e.removeStorageSync("isComment");
            var t = e.getStorageSync("TideAddrStr");
            for (var n in t) e.removeStorageSync(t[n]);
            e.removeStorageSync("TideAddrStr"), e.showToast({
                title: "缓存清除成功！",
                icon: "succes",
                duration: 1e3,
                mask: !0
            });
        } catch (o) {
            o = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(o);
            e.showToast({
                title: "缓存清除失败！",
                icon: "error",
                duration: 1e3,
                mask: !0
            });
        }
        this.getStorageInfo();
    },
    radioTideChange: function(o) {
        e.setStorageSync("modeType", o.detail.value), e.showToast({
            title: "模式已经切换，立刻生效!",
            icon: "none",
            duration: 1e3,
            mask: !0
        });
    },
    radioWindChange: function(o) {
        e.setStorageSync("modeWindType", o.detail.value), e.showToast({
            title: "模式已经切换，立刻生效!",
            icon: "none",
            duration: 1e3,
            mask: !0
        });
    },
    radioCommentChange: function(o) {
        e.setStorageSync("isComment", o.detail.value), e.showToast({
            title: "模式已经切换，立刻生效!",
            icon: "none",
            duration: 1e3,
            mask: !0
        });
    }
});