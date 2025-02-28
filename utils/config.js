var p = {
    Domain: "https://www.eisk.cn/Api2/",
    AppKey: "wx5d4198ofr3940df2",
    sys: wx,
    appId: wx.getAccountInfoSync().miniProgram.appId
};

module.exports = {
    config: p
};