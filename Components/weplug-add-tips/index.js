Component({
    properties: {
        text: {
            type: String,
            value: "点击「添加小程序」，下次访问更方便  ✘"
        },
        duration: {
            type: Number,
            value: 5
        }
    },
    data: {
        SHOW_TOP: !1,
        SHOW_MODAL: !1
    },
    ready: function() {
        var t = this;
        wx.getStorageSync("PLUG-ADD-MYAPP-KEY") || (this.setData({
            SHOW_TOP: !0
        }), setTimeout(function() {
            t.setData({
                SHOW_TOP: !1
            });
        }, 1e3 * this.data.duration));
    },
    methods: {
        showModal: function() {
            this.setData({
                SHOW_TOP: !1,
                SHOW_MODAL: !0
            });
        },
        okHandler: function() {
            this.setData({
                SHOW_MODAL: !1
            }), wx.setStorage({
                key: "PLUG-ADD-MYAPP-KEY",
                data: +new Date()
            });
        }
    }
});