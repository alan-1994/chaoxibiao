var t = require("../../utils/config.js"), a = t.config.sys;

require("../../utils/md5.js"), getApp();

Page({
    id: 1,
    page: 1,
    count: 20,
    search: "",
    ship: {},
    basans: [],
    get_ship: function(i) {
        var n = this;
        a.request({
            url: t.config.Domain + "/Ship/GetShipData",
            data: {
                id: n.id,
                page: n.page,
                count: n.count,
                search: n.search
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                for (var a in n.ship = t.data.data.ship, n.ship.Extended = JSON.parse(n.ship.Extended), 
                n.basans = t.data.data.basans, n.basans.rows) n.basans.rows[a].Extended = JSON.parse(n.basans.rows[a].Extended);
                i(t.data.data);
            }
        });
    },
    data: {
        ship: [],
        basans: []
    },
    onLoad: function(t) {
        var a = this;
        a.id = t.id, console.log(a.id), a.get_ship(function(t) {
            a.setData({
                ship: a.ship,
                basans: a.basans
            });
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var t = this;
        return {
            title: t.ship.SortTitle + "-" + t.ship.Title,
            desc: "钓点查询",
            path: "/pages/tide/menu?path=article&id=" + t.id
        };
    },
    previewBasanImg: function(t) {
        var a = [], i = this.data.basans.rows[t.currentTarget.dataset.groupindex].Extended.data;
        for (var n in i) a.push(i[n].Img);
        this.openImg(a, t.currentTarget.dataset.index);
    },
    previewImg: function(t) {
        var a = [], i = this.data.ship.Extended.data;
        for (var n in i) a.push(i[n].Img);
        this.openImg(a, t.currentTarget.dataset.index);
    },
    openImg: function(t, i) {
        a.previewImage({
            current: t[i],
            urls: t,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    OpenArticle: function(t) {
        a.navigateTo({
            url: "../article/index?id=" + t.currentTarget.dataset.id
        });
    },
    bindCalling: function(t) {
        a.makePhoneCall({
            phoneNumber: this.data.ship.Phone,
            success: function() {
                console.log("拨打电话成功！");
            },
            fail: function() {
                console.log("拨打电话失败！");
            }
        });
    },
    bindAddrstr: function(t) {
        a.openLocation({
            latitude: this.data.ship.Latitude,
            longitude: this.data.ship.Longitude,
            scale: 14,
            title: this.data.ship.SortTitle,
            name: this.data.ship.Title,
            address: this.data.ship.AddrStr
        });
    },
    bindAddArticle: function(t) {},
    bindTides: function() {
        var t = "../tide/index?type=posit&lat=" + this.data.ship.Latitude.toFixed(4) + "&lng=" + this.data.ship.Longitude.toFixed(4);
        a.navigateTo({
            url: t
        });
    },
    bindStrategy: function() {
        var t = "../web/index?url=" + encodeURI(this.ship.Strategy);
        a.navigateTo({
            url: t
        });
    }
});