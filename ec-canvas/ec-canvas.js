var e, t = require("../@babel/runtime/helpers/interopRequireWildcard"), a = require("../@babel/runtime/helpers/interopRequireDefault")(require("./wx-canvas")), r = t(require("./echarts"));

function c(e) {
    for (var t = 0; t < e.touches.length; ++t) {
        var a = e.touches[t];
        a.offsetX = a.x, a.offsetY = a.y;
    }
    return e;
}

Component({
    properties: {
        canvasId: {
            type: String,
            value: "ec-canvas"
        },
        ec: {
            type: Object
        }
    },
    data: {},
    ready: function() {
        this.data.ec ? this.data.ec.lazyLoad || this.init() : console.warn('组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>');
    },
    methods: {
        init: function(t) {
            var c = this, n = wx.version.version.split(".").map(function(e) {
                return parseInt(e, 10);
            });
            if (n[0] > 1 || 1 === n[0] && n[1] > 9 || 1 === n[0] && 9 === n[1] && n[2] >= 91) {
                e = wx.createCanvasContext(this.data.canvasId, this);
                var i = new a.default(e, this.data.canvasId);
                r.setCanvasCreator(function() {
                    return i;
                }), wx.createSelectorQuery().in(this).select(".ec-canvas").boundingClientRect(function(e) {
                    "function" == typeof t ? c.chart = t(i, e.width, e.height) : c.data.ec && "function" == typeof c.data.ec.onInit ? c.chart = c.data.ec.onInit(i, e.width, e.height) : c.triggerEvent("init", {
                        canvas: i,
                        width: e.width,
                        height: e.height
                    });
                }).exec();
            } else console.error("微信基础库版本过低，需大于等于 1.9.91。参见：https://github.com/ecomfe/echarts-for-weixin#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82");
        },
        canvasToTempFilePath: function(t) {
            var a = this;
            t.canvasId || (t.canvasId = this.data.canvasId), e.draw(!0, function() {
                wx.canvasToTempFilePath(t, a);
            });
        },
        touchStart: function(e) {
            if (this.chart && e.touches.length > 0) {
                var t = e.touches[0], a = this.chart.getZr().handler;
                a.dispatch("mousedown", {
                    zrX: t.x,
                    zrY: t.y
                }), a.dispatch("mousemove", {
                    zrX: t.x,
                    zrY: t.y
                }), a.processGesture(c(e), "start");
            }
        },
        touchMove: function(e) {
            if (this.chart && e.touches.length > 0) {
                var t = e.touches[0], a = this.chart.getZr().handler;
                a.dispatch("mousemove", {
                    zrX: t.x,
                    zrY: t.y
                }), a.processGesture(c(e), "change");
            }
        },
        touchEnd: function(e) {
            if (this.chart) {
                var t = e.changedTouches ? e.changedTouches[0] : {}, a = this.chart.getZr().handler;
                a.dispatch("mouseup", {
                    zrX: t.x,
                    zrY: t.y
                }), a.dispatch("click", {
                    zrX: t.x,
                    zrY: t.y
                }), a.processGesture(c(e), "end");
            }
        }
    }
});