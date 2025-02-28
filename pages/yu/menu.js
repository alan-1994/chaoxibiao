var e = require("../../@babel/runtime/helpers/defineProperty"), t = require("../../utils/config.js"), a = t.config.sys, n = require("../../utils/md5.js");

getApp();

Page({
    appId: t.config.appId,
    id: 0,
    page: 1,
    count: 10,
    type: 0,
    list: [],
    search: "",
    searchText: "",
    BaiduToken: "",
    get_top_list: function(e) {
        var i = a.getStorageSync("globalData"), o = Date.parse(new Date()) / 1e3, s = n.hexMD5(this.appId + t.config.AppKey + i.memberid + o), c = t.config.Domain + "/Fish/GetTopList";
        a.request({
            url: c,
            data: {
                uid: i.memberid,
                timestamp: o,
                sign: s
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                e(t.data);
            }
        });
    },
    get_name_list: function(e) {
        var i = this;
        if (0 != i.list.length) {
            a.showToast({
                title: "读取中.....",
                icon: "loading",
                duration: 1e5,
                mask: !0
            });
            var o = a.getStorageSync("globalData"), s = Date.parse(new Date()) / 1e3, c = n.hexMD5(i.appId + t.config.AppKey + o.memberid + s), r = t.config.Domain + "/Fish/GetFishList", u = [];
            for (var d in i.list) u.push(i.list[d].name);
            a.request({
                url: r,
                data: {
                    uid: o.memberid,
                    name: u,
                    type: i.type,
                    page: i.page,
                    count: i.count,
                    timestamp: s,
                    sign: c
                },
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function(t) {
                    var n = [];
                    1 == t.data.ret ? a.showToast({
                        title: t.data.msg,
                        icon: "none",
                        duration: 2e3,
                        mask: !0
                    }) : (a.showToast({
                        title: "查到" + t.data.data.records + "条记录",
                        icon: "none",
                        duration: 2e3,
                        mask: !0
                    }), n = t.data.data.rows), e(n);
                }
            });
        } else a.showToast({
            title: "检索不到数据！",
            icon: "none",
            duration: 2e3,
            mask: !0
        });
    },
    get_search_list: function(e) {
        var i = this;
        if (i.searchText.length < 1) a.showToast({
            title: "查找的名字过短！",
            icon: "none",
            duration: 2e3,
            mask: !0
        }); else {
            a.showToast({
                title: "读取中.....",
                icon: "loading",
                duration: 1e5,
                mask: !0
            });
            var o = a.getStorageSync("globalData"), s = Date.parse(new Date()) / 1e3, c = n.hexMD5(i.appId + t.config.AppKey + o.memberid + s), r = t.config.Domain + "/Fish/GetFishSearchList";
            a.request({
                url: r,
                data: {
                    uid: o.memberid,
                    search: i.searchText,
                    page: i.page,
                    count: i.count,
                    timestamp: s,
                    sign: c
                },
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function(t) {
                    var n = [];
                    1 == t.data.ret ? a.showToast({
                        title: "查找的名字过短！",
                        icon: "none",
                        duration: 2e3,
                        mask: !0
                    }) : (a.showToast({
                        title: "查到" + t.data.data.rows.length + "条记录",
                        icon: "none",
                        duration: 2e3,
                        mask: !0
                    }), n = t.data.data.rows), e(n);
                }
            });
        }
    },
    GetBaiduToken: function(e) {
        var i = a.getAccountInfoSync().miniProgram.appId, o = Date.parse(new Date()) / 1e3, s = a.getStorageSync("globalData"), c = n.hexMD5(i + t.config.AppKey + s.secret + o);
        wx.request({
            url: t.config.Domain + "/AIImg/GetToken",
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
            success: function(t) {
                e(t.data.data);
            }
        });
    },
    BaiduDistinguish: function(e, t, n) {
        wx.request({
            url: "https://aip.baidubce.com/rest/2.0/image-classify/v1/animal?access_token=" + e,
            data: {
                image: encodeURI(t),
                top_num: 6,
                baike_num: 6
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: "json",
            success: function(e) {
                n(e.data);
            },
            fail: function(e) {
                a.showToast({
                    title: "访问超时！",
                    icon: "none",
                    duration: 1e3,
                    mask: !0
                });
            }
        });
    },
    GetJianYuToken: function(e) {
        var i = a.getAccountInfoSync().miniProgram.appId, o = Date.parse(new Date()) / 1e3, s = a.getStorageSync("globalData"), c = n.hexMD5(i + t.config.AppKey + s.secret + o);
        wx.request({
            url: t.config.Domain + "/AIImg/GetJianYuToken",
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
            success: function(t) {
                e(t.data.data);
            }
        });
    },
    JianYuDistinguish: function(t, n, i) {
        wx.uploadFile({
            url: "https://api3.fishclassifier.com/api/v2/post/inference",
            filePath: n,
            name: "photo",
            async: !1,
            formData: {
                apiKey: t,
                ip: ""
            },
            method: "POST",
            header: e({
                "content-type": "multipart/form-data"
            }, "content-type", "application/x-www-form-urlencoded;charset=utf-8"),
            success: function(e) {
                var t = {};
                try {
                    t = JSON.parse(e.data);
                } catch (e) {
                    e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                    i({
                        status: "400"
                    });
                }
                i(t);
            },
            fail: function(e) {
                i(e), a.showToast({
                    title: "访问出错！" + JSON.stringify(e),
                    icon: "none",
                    duration: 2e3,
                    mask: !0
                });
            }
        });
    },
    data: {
        IsConfigOpen: !1,
        rows: [],
        searchText: "",
        type: "1",
        IsAdd: !1
    },
    onLoad: function(e) {
        var t = this;
        t.get_top_list(function(e) {
            t.setData({
                rows: e.data,
                IsAdd: !1
            });
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
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
        var e = this;
        e.GetBaiduToken(function(t) {
            wx.chooseImage({
                count: 1,
                success: function(n) {
                    a.showToast({
                        title: "动物引擎识别中！",
                        icon: "loading",
                        duration: 3e4,
                        mask: !0
                    }), wx.getFileSystemManager().readFile({
                        filePath: n.tempFilePaths[0],
                        encoding: "base64",
                        success: function(n) {
                            var i = "data:image/png;base64," + n.data;
                            e.setData({
                                imgUrl: i
                            }), e.BaiduDistinguish(t, n.data, function(t) {
                                a.showToast({
                                    title: "识别成功！↓↓",
                                    icon: "succes",
                                    duration: 2e3,
                                    mask: !0
                                });
                                var n = t.result;
                                e.type = 1;
                                var o = [];
                                for (var s in o.push({
                                    Img: i,
                                    Name: "要识别的原图"
                                }), n) n[s].Score = n[s].score, n[s].NameCN = n[s].name, n[s].baike_info && (n[s].Img = n[s].baike_info.image_url, 
                                n[s].Introduction = n[s].baike_info.description), o.push(n[s]);
                                e.setData({
                                    rows: o,
                                    IsConfigOpen: !1,
                                    IsAdd: !1
                                });
                            });
                        },
                        fail: function(e) {
                            a.showToast({
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
        var e = this;
        e.GetJianYuToken(function(t) {
            wx.chooseImage({
                count: 1,
                sizeType: [ "compressed" ],
                success: function(n) {
                    a.showToast({
                        title: "鉴鱼引擎识别中！",
                        icon: "loading",
                        duration: 3e4,
                        mask: !0
                    }), wx.getFileSystemManager().readFile({
                        filePath: n.tempFilePaths[0],
                        encoding: "base64",
                        success: function(i) {
                            var o = "data:image/png;base64," + i.data;
                            e.JianYuDistinguish(t, n.tempFilePaths[0], function(t) {
                                if ("200" == t.status) {
                                    var n = t.data, i = [];
                                    for (var s in n) i.push({
                                        score: n[s].con / 100,
                                        img: "https://api3.fishclassifier.com/api/v2/get/pic?id=" + n[s].img,
                                        name: n[s].latin,
                                        namecn: n[s].name
                                    });
                                    e.list = i, e.type = 0, e.get_name_list(function(t) {
                                        var a = [];
                                        for (var n in a.push({
                                            Img: o,
                                            Name: "要识别的原图"
                                        }), i) {
                                            for (var s in t) i[n].name != t[s].NameEN || (t[s].Score = i[n].score, t[s].Img = i[n].img, 
                                            i[n] = t[s]);
                                            i[n].Score || (i[n].Score = i[n].score), i[n].Img || (i[n].Img = i[n].img), i[n].NameCN || (i[n].NameCN = i[n].namecn), 
                                            i[n].NameEN || (i[n].NameEN = i[n].name), a.push(i[n]);
                                        }
                                        e.setData({
                                            rows: a,
                                            IsConfigOpen: !1,
                                            IsAdd: !1
                                        });
                                    }), a.showToast({
                                        title: "识别成功！↓↓",
                                        icon: "succes",
                                        duration: 2e3,
                                        mask: !0
                                    });
                                } else a.showToast({
                                    title: "图像识别失败！",
                                    icon: "none",
                                    duration: 1e3,
                                    mask: !0
                                });
                            });
                        },
                        fail: function(e) {
                            a.showToast({
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
    binConfigOpen: function() {
        this.setData({
            IsConfigOpen: !this.data.IsConfigOpen
        });
    },
    bindJianYu: function(e) {
        wx.navigateToMiniProgram({
            appId: "wx0314082f3ece044a",
            path: "pages/index/index",
            envVersion: "release",
            success: function(e) {}
        });
    },
    bindSearchInputValue: function(e) {
        this.searchText = e.detail.value;
    },
    binOpenSearch: function(e) {
        var t = this;
        t.page = 1, t.get_search_list(function(e) {
            t.setData({
                rows: e,
                IsAdd: !0
            });
        });
    },
    OpenArticle: function(e) {
        e.currentTarget.dataset.id ? a.navigateTo({
            url: "../yu/article?id=" + e.currentTarget.dataset.id
        }) : a.showToast({
            title: "没要详细资料！",
            icon: "none",
            duration: 1e3,
            mask: !0
        });
    },
    binNext: function(e) {
        var t = this;
        t.page += 1, t.get_search_list(function(e) {
            for (var a in e) t.data.rows.push(e[a]);
            t.setData({
                rows: t.data.rows
            });
        });
    }
});