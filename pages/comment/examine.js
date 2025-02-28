var t = require("../../utils/config.js"), e = t.config.sys, n = require("../../utils/md5.js");

getApp();

Page({
    commentList: [],
    page: 1,
    isLoad: !1,
    windowHeight: 0,
    appId: e.getAccountInfoSync().miniProgram.appId,
    get_comment: function(o) {
        var i = this;
        if (1 != i.isLoad) {
            i.isLoad = !0;
            var a = Date.parse(new Date()) / 1e3, c = n.hexMD5(i.appId + t.config.AppKey + a);
            e.request({
                url: t.config.Domain + "/Tides/GetExamineCommentList",
                data: {
                    page: i.page,
                    timestamp: a,
                    sign: c
                },
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function(t) {
                    var e = t.data.data.rows;
                    for (var n in e) i.commentList.push(e[n]);
                    i.isLoad = !1, o(i.commentList);
                }
            });
        }
    },
    data: {},
    onLoad: function(t) {
        var n = this;
        n.get_comment(function(t) {
            n.setData({
                commentList: n.commentList
            });
        }), e.getSystemInfo({
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
    onShareAppMessage: function() {},
    bindAdopt: function(o) {
        var i = this, a = o.currentTarget.dataset.id, c = e.getStorageSync("globalData"), s = Date.parse(new Date()) / 1e3, m = n.hexMD5(i.appId + t.config.AppKey + c.memberid + a + s);
        e.request({
            url: t.config.Domain + "/Tides/ExamineComment",
            data: {
                uid: c.memberid,
                id: a,
                timestamp: s,
                sign: m
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                t.data;
                e.showToast({
                    title: t.data.msg,
                    icon: "succes",
                    duration: 2e3,
                    mask: !0
                }), i.page = 1, i.commentList = [], i.get_comment(function(t) {
                    i.setData({
                        commentList: i.commentList
                    });
                });
            }
        });
    },
    onPageScroll: function(t) {
        console.log(t);
        var n = this, o = t.scrollTop, i = e.createSelectorQuery();
        i.select("#scroll").boundingClientRect(), i.exec(function(t) {
            o >= t[0].height - n.windowHeight && 0 == n.isLoad && (e.showToast({
                title: "数据加载中！",
                icon: "loading",
                duration: 1e3,
                mask: !0
            }), n.page += 1, n.get_comment(function(t) {
                n.setData({
                    commentList: n.commentList,
                    commentText: ""
                });
            }));
        });
    }
});