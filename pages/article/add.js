var e = require("../../@babel/runtime/helpers/defineProperty"), t = require("../../utils/qqmap-wx-jssdk.min.js"), a = require("../../utils/config.js"), n = a.config.sys, o = require("../../utils/md5.js"), i = (getApp(), 
new t({
    key: "VQCBZ-QINKW-TN2RB-RJEDX-HG4E3-T6FAO"
}));

Page({
    appId: n.getAccountInfoSync().miniProgram.appId,
    data: {
        images: [],
        uploadedImages: []
    },
    onLoad: function(e) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindPosition: function(e) {
        var t = this;
        n.chooseLocation({
            success: function(e) {
                t.setData({
                    latitude: e.latitude,
                    longitude: e.longitude
                }), i.reverseGeocoder({
                    location: {
                        latitude: e.latitude,
                        longitude: e.longitude
                    },
                    success: function(e) {
                        t.setData({
                            addrStr: e.result.formatted_addresses.recommend
                        });
                    }
                });
            }
        });
    },
    binComment: function(t) {
        var i = t.detail.value, s = this.data.images;
        if (i.AddrStr.length < 1 || i.Charge.length < 1 || i.Introduce.length < 1 || i.Latitude.length < 1 || i.Longitude.length < 1 || i.Title.length < 1 || s.length < 1) n.showToast({
            title: "数据不完整！",
            icon: "none",
            duration: 1e3,
            mask: !0
        }); else {
            var r = n.getStorageSync("globalData"), d = Date.parse(new Date()) / 1e3, c = o.hexMD5(this.appId + a.config.AppKey + r.memberid + d), u = [];
            n.showToast({
                title: "数据提交中！",
                icon: "none",
                duration: 1e5,
                mask: !0
            });
            var m = 0;
            for (var l in s) n.uploadFile({
                url: a.config.Domain + "/Tides/UpdateImg",
                filePath: s[l],
                name: "img",
                async: !1,
                formData: {
                    uid: r.memberid,
                    timestamp: d,
                    sign: c
                },
                header: e({
                    "content-type": "multipart/form-data"
                }, "content-type", "application/x-www-form-urlencoded;charset=utf-8"),
                success: function(e) {
                    m++;
                    var t = JSON.parse(e.data);
                    t && 0 == t.ret && u.push({
                        Img: t.url
                    }), m == s.length && (i.Extended = JSON.stringify({
                        data: u
                    }), i.ShipPhoto = u[0].Img, i.HeadPhoto = i.ShipPhoto, i.MemberID = r.memberid, 
                    i.Title = encodeURI(i.Title), i.Introduce = encodeURI(i.Introduce), i.AddrStr = encodeURI(i.AddrStr), 
                    i.timestamp = d, i.sign = c, console.log(i), n.request({
                        url: a.config.Domain + "/Tides/AddShip",
                        data: i,
                        method: "POST",
                        header: {
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        success: function(e) {
                            var t = e.data;
                            0 == t.ret ? n.showToast({
                                title: t.msg,
                                icon: "succes",
                                duration: 2e3,
                                mask: !0
                            }) : n.showToast({
                                title: t.msg,
                                icon: "none",
                                duration: 2e3,
                                mask: !0
                            });
                        }
                    }));
                }
            });
        }
    },
    chooseImage: function() {
        var e = this;
        this.data.images.length >= 10 ? n.showToast({
            title: "最多只能选10张图片！",
            icon: "none",
            duration: 1e3,
            mask: !0
        }) : n.chooseImage({
            count: 10 - this.data.images.length,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var a = t.tempFilePaths;
                e.setData({
                    images: e.data.images.concat(a)
                });
            }
        });
    },
    previewImage: function(e) {
        var t = e.target.dataset.src;
        n.previewImage({
            current: t,
            urls: this.data.images
        });
    },
    delete: function(e) {
        var t = e.currentTarget.dataset.index, a = this.data.images;
        a.splice(t, 1), this.setData({
            images: a
        });
    }
});