App({
    onLaunch: function() {
        var a = this;
        this.globalData.secret = "";
        var e = wx.getStorageSync("globalData");
        if (e && e.memberid > 999) {
            var t = wx.getStorageSync("globalData_date");
            console.log("已经登录！", t);
            var o = new Date(t), d = (new Date().getTime() - o.getTime()) / 864e5;
            if (console.log(d), d <= .3) return;
        }
        wx.login({
            success: function(e) {
                if (e.code) {
                    var t = require("/utils/config.js"), o = require("/utils/md5.js"), d = wx.getAccountInfoSync().miniProgram.appId, n = Date.parse(new Date()) / 1e3, i = o.hexMD5(d + t.config.AppKey + a.globalData.secret + e.code + n);
                    wx.request({
                        url: t.config.Domain + "/Member/GetMemberLogin",
                        data: {
                            code: e.code,
                            timestamp: n,
                            sign: i
                        },
                        success: function(e) {
                            0 == e.data.ret && (a.globalData.openid = e.data.data.openid, a.globalData.memberid = e.data.data.memberid, 
                            a.globalData.secret = e.data.data.secret, a.globalData.isAdmin = e.data.data.isAdmin, 
                            a.globalData.vip = e.data.data.vip, a.globalData.tideDays = e.data.data.tideDays ? e.data.data.tideDays : 15, 
                            a.globalData.openHidden = e.data.data.openHidden, a.globalData.userInfo = e.data.data.userInfo, 
                            wx.setStorageSync("globalData", a.globalData), wx.setStorageSync("globalData_date", new Date()));
                        }
                    });
                } else console.log("登录失败！" + e.errMsg);
            }
        });
    },
    globalData: {
        userInfo: null,
        openid: null,
        memberid: 1,
        secret: "WexApp384udgjcose12",
        isAdmin: !1,
        openHidden: !1,
        tideDays: 15
    }
});