var e = require("../../@babel/runtime/helpers/defineProperty"), n = require("../../utils/config.js"), t = n.config.sys, a = require("../../utils/md5.js");

getApp();

Page({
    GetBaiduToken: function(e) {
        var i = t.getAccountInfoSync().miniProgram.appId, o = Date.parse(new Date()) / 1e3, s = t.getStorageSync("globalData"), c = a.hexMD5(i + n.config.AppKey + s.secret + o);
        wx.request({
            url: n.config.Domain + "/AIImg/GetToken",
            data: {
                uid: s.memberid,
                timestamp: o,
                sign: c
            },
            method: "POST",
            dataType: "json",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            success: function(n) {
                e(n.data.data);
            }
        });
    },
    BaiduDistinguish: function(e, n, a) {
        wx.request({
            url: "https://aip.baidubce.com/rest/2.0/image-classify/v1/animal?access_token=" + e,
            data: {
                image: encodeURI(n),
                top_num: 6,
                baike_num: 6
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: "json",
            success: function(e) {
                a(e.data);
            },
            fail: function(e) {
                t.showToast({
                    title: "访问超时！",
                    icon: "none",
                    duration: 1e3,
                    mask: !0
                });
            }
        });
    },
    GetJianYuToken: function(e) {
        var i = t.getAccountInfoSync().miniProgram.appId, o = Date.parse(new Date()) / 1e3, s = t.getStorageSync("globalData"), c = a.hexMD5(i + n.config.AppKey + s.secret + o);
        wx.request({
            url: n.config.Domain + "/AIImg/GetJianYuToken",
            data: {
                uid: s.memberid,
                timestamp: o,
                sign: c
            },
            method: "POST",
            dataType: "json",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            success: function(n) {
                e(n.data.data);
            }
        });
    },
    JianYuDistinguish: function(n, a, i) {
        wx.uploadFile({
            url: "https://api3.fishclassifier.com/v2/post/inference",
            filePath: a,
            name: "photo",
            async: !1,
            formData: {
                apiKey: n,
                ip: ""
            },
            method: "POST",
            header: e({
                "content-type": "multipart/form-data"
            }, "content-type", "application/x-www-form-urlencoded;charset=utf-8"),
            success: function(e) {
                var n = {};
                try {
                    n = JSON.parse(e.data);
                } catch (e) {
                    e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                    i({
                        status: "400"
                    });
                }
                i(n);
            },
            fail: function(e) {
                i(e), t.showToast({
                    title: "访问出错！" + JSON.stringify(e),
                    icon: "none",
                    duration: 2e3,
                    mask: !0
                });
            }
        });
    },
    BaiduToken: "",
    data: {
        imgUrl: "",
        list: [],
        type: "1"
    },
    onLoad: function(e) {},
    onReady: function() {
        this.setData({
            imgUrl: "/images/menuicon/yu_back.jpg"
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindOpenCamera: function(e) {},
    bindOpenImg: function(e) {
        switch (this.data.type) {
          case "1":
            this.jianYuEngine();
            break;

          case "2":
            this.baiduEngine();
        }
    },
    radioChange: function(e) {
        this.data.type = e.detail.value;
    },
    baiduEngine: function() {
        console.log("baiduEngine");
        var e = this;
        e.GetBaiduToken(function(n) {
            wx.chooseImage({
                count: 1,
                success: function(a) {
                    t.showToast({
                        title: "图像识别中！",
                        icon: "loading",
                        duration: 3e4,
                        mask: !0
                    }), wx.getFileSystemManager().readFile({
                        filePath: a.tempFilePaths[0],
                        encoding: "base64",
                        success: function(a) {
                            var i = "data:image/png;base64," + a.data;
                            e.setData({
                                imgUrl: i
                            }), e.BaiduDistinguish(n, a.data, function(n) {
                                t.showToast({
                                    title: "识别成功！↓↓",
                                    icon: "succes",
                                    duration: 2e3,
                                    mask: !0
                                }), console.log(n), e.setData({
                                    list: n.result
                                });
                            });
                        },
                        fail: function(e) {
                            t.showToast({
                                title: "图像识别失败！",
                                icon: "none",
                                duration: 1e3,
                                mask: !0
                            });
                        }
                    });
                }
            });
        });
    },
    jianYuEngine: function() {
        console.log("jianYuEngine");
        var e = this;
        e.GetJianYuToken(function(n) {
            wx.chooseImage({
                count: 1,
                sizeType: [ "compressed" ],
                success: function(a) {
                    t.showToast({
                        title: "图像识别中！",
                        icon: "loading",
                        duration: 3e4,
                        mask: !0
                    }), wx.getFileSystemManager().readFile({
                        filePath: a.tempFilePaths[0],
                        encoding: "base64",
                        success: function(i) {
                            var o = "data:image/png;base64," + i.data;
                            e.setData({
                                imgUrl: o
                            }), e.JianYuDistinguish(n, a.tempFilePaths[0], function(n) {
                                if ("200" == n.status) {
                                    var a = n.data, i = [];
                                    for (var o in a) i.push({
                                        score: a[o].con / 100,
                                        name: a[o].name,
                                        baike_info: {
                                            image_url: "https://api3.fishclassifier.com/v2/get/pic?id=" + a[o].img
                                        },
                                        latin: a[o].latin
                                    });
                                    e.setData({
                                        list: i
                                    }), t.showToast({
                                        title: "识别成功！↓↓",
                                        icon: "succes",
                                        duration: 2e3,
                                        mask: !0
                                    });
                                } else t.showToast({
                                    title: "图像识别失败！",
                                    icon: "none",
                                    duration: 1e3,
                                    mask: !0
                                });
                            });
                        },
                        fail: function(e) {
                            t.showToast({
                                title: "图像识别失败！",
                                icon: "none",
                                duration: 1e3,
                                mask: !0
                            });
                        }
                    });
                }
            });
        });
    },
    bindJianYu: function(e) {
        wx.navigateToMiniProgram({
            appId: "wx0314082f3ece044a",
            path: "pages/index/index",
            envVersion: "release",
            success: function(e) {}
        });
    }
});