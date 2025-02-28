var t = require("../../utils/config.js"), i = t.config.sys;

require("../../utils/md5.js"), getApp();

Page({
    id: 0,
    page: 1,
    count: 20,
    isLoad: !1,
    search: "",
    windowHeight: 0,
    rows: [],
    get_ship: function(n) {
        var e = this;
        1 != e.isLoad && (e.isLoad = !0, i.request({
            url: t.config.Domain + "/Ship/GetList",
            data: {
                id: e.id,
                page: e.page,
                count: e.count,
                search: e.search
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                var i = t.data.data.rows;
                for (var o in i) e.rows.push(i[o]);
                e.isLoad = !1, n(e.rows);
            }
        }));
    },
    data: {
        rows: [],
        isAdmin: !1
    },
    onLoad: function(t) {
        var n = this, e = i.getStorageSync("globalData");
        n.id = t.id, n.get_ship(function(t) {
            n.setData({
                rows: t,
                isAdmin: e.isAdmin
            });
        }), i.getSystemInfo({
            success: function(t) {
                n.windowHeight = t.windowHeight;
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        return {
            title: "钓点列表",
            desc: "钓点列表",
            path: "/pages/tide/menu?path=basan&id=" + this.id
        };
    },
    onPageScroll: function(t) {
        var n = this, e = t.scrollTop, o = i.createSelectorQuery();
        o.select("#scroll").boundingClientRect(), o.exec(function(t) {
            e >= t[0].height - n.windowHeight && 0 == n.isLoad && (i.showToast({
                title: "数据加载中！",
                icon: "loading",
                duration: 1e3,
                mask: !0
            }), n.page += 1, n.get_ship(function(t) {
                n.setData({
                    rows: t
                });
            }));
        });
    },
    OpenArticle: function(t) {
        i.navigateTo({
            url: "../article/index?id=" + t.currentTarget.dataset.id
        });
    },
    bindAddArticle: function(t) {
        var n = i.getStorageSync("globalData");
        n.isAdmin;
        n.isAdmin ? i.navigateTo({
            url: "../article/add?type=basan"
        }) : i.showToast({
            title: "该功能只提供管理员使用！",
            icon: "none",
            duration: 3e3,
            mask: !0
        });
    }
});