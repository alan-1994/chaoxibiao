var e = require("../../@babel/runtime/helpers/interopRequireWildcard")(require("../../ec-canvas/echarts")), t = new (require("../../utils/calendar-converter.js").CalendarConverter)(), i = require("../../utils/config.js"), a = i.config.sys, r = require("../../utils/md5.js");

getApp();

Page({
    id: 903,
    isDiy: !1,
    appId: a.getAccountInfoSync().miniProgram.appId,
    weather: {},
    tides: [],
    option: {},
    chart: {},
    initChart: function(t, i, a) {
        var r = this;
        return r.chart = e.init(t, null, {
            width: i,
            height: a
        }), t.setChart(r.chart), r.chart.on("rendered", function() {}), r.chart;
    },
    GetTideType: function(e) {
        switch (e) {
          case "初三":
          case "十七":
            return [ "巨潮", "活汛", "color: #fe0000", "color: #ff91a0 " ];

          case "初一":
          case "初二":
          case "十五":
          case "十六":
            return [ "大潮", "活汛", "color: #fe0000", "color: #ff91a0 " ];

          case "十二":
          case "十三":
          case "廿七":
          case "廿八":
            return [ "中潮", "死汛", "", "color: #bdf6db " ];

          case "初四":
          case "初五":
          case "初六":
          case "初七":
          case "十四":
          case "十八":
          case "十九":
          case "二十":
          case "廿一":
          case "廿九":
          case "三十":
            return [ "中潮", "活汛", "", "color: #ff91a0 " ];

          case "初八":
          case "廿二":
            return [ "小潮", "活汛", "color: #00fe87", "color: #ff91a0 " ];

          case "初十":
          case "十一":
          case "廿三":
          case "廿五":
          case "廿六":
            return [ "小潮", "死汛", "color: #00fe87", "color: #bdf6db " ];

          case "初九":
          case "廿四":
            return [ "微潮", "死汛", "color: #00fe87", "color: #bdf6db " ];

          default:
            return [];
        }
    },
    set_GHPJ: function(e) {
        return Number(e) < 50 ? [ "优", "color: #fe0000" ] : Number(e) < 100 ? [ "好", "color: #ff91a0" ] : Number(e) < 150 ? [ "一般", "" ] : [ "差", "color: #6b6a6a" ];
    },
    set_GHPF: function(e) {
        var t = Number(e);
        return t < 200 ? t <= 0 ? 100 : (200 - t) / 2 : 0;
    },
    get_WeatherDay: function(e, o) {
        var n = this, s = a.getStorageSync("globalData"), d = Date.parse(new Date()) / 1e3, c = r.hexMD5(n.appId + i.config.AppKey + s.secret + s.memberid + e + "day" + d);
        a.request({
            url: i.config.Domain + "/Tides/GetWeather_v2",
            data: {
                id: e,
                uid: s.memberid,
                type: "day",
                isDiy: n.isDiy,
                timestamp: d,
                sign: c
            },
            method: "GET",
            header: {
                "content-type": "application/json"
            },
            success: function(e) {
                for (var i in n.weather = e.data.data, n.weather) {
                    var a = n.weather.list[i], r = a.key.split("-");
                    a.date = Number(r[1]) + "月" + Number(r[2]) + "日";
                    var s = new Date(Date.parse(a.key));
                    if (a.weekDay = [ [ "星期天", "fj" ], [ "星期一", "" ], [ "星期二", "" ], [ "星期三", "" ], [ "星期四", "" ], [ "星期五", "" ], [ "星期六", "fj" ] ][s.getDay()], 
                    a.lunarDay = t.solar2lunar(s).lunarDay, a.tideType = n.GetTideType(a.lunarDay), 
                    a.GHDesc = [], a.YKDesc = [], a.key) {
                        var d = a.tide.Day_High_Tide1 > a.tide.Day_High_Tide2;
                        if (a.tide.Day_Time1) {
                            var c = a.tide.Day_Time1.split(":");
                            if (a.tide.Day_Time1 = c[0] + ":" + c[1], d) a.tide.State1 = "满潮"; else (l = Number(c[0]) - 4) < 0 && (l = "前天" + (24 + l)), 
                            a.GHDesc.push({
                                desc: l + ":" + c[1] + " ~ " + a.tide.Day_Time1 + "点",
                                pj: n.set_GHPJ(a.tide.Day_High_Tide1),
                                pf: n.set_GHPF(a.tide.Day_High_Tide1),
                                h: a.tide.Day_High_Tide1
                            }), a.tide.State1 = "干潮";
                            (l = Number(c[0]) - 1) < 0 && (l = "前天" + (24 + l)), (f = Number(c[0]) + 1) > 24 && (l = "第二天" + (24 + l)), 
                            a.YKDesc.push(l + "~" + f + "点；");
                        }
                        if (a.tide.Day_Time2) {
                            c = a.tide.Day_Time2.split(":");
                            if (a.tide.Day_Time2 = c[0] + ":" + c[1], d) (l = Number(c[0]) - 4) < 0 && (l = "前天" + (24 + l)), 
                            a.GHDesc.push({
                                desc: l + ":" + c[1] + " ~ " + a.tide.Day_Time2 + "点",
                                pj: n.set_GHPJ(a.tide.Day_High_Tide2),
                                pf: n.set_GHPF(a.tide.Day_High_Tide2),
                                h: a.tide.Day_High_Tide2
                            }), a.tide.State2 = "干潮"; else a.tide.State2 = "满潮";
                            (l = Number(c[0]) - 1) < 0 && (l = "前天" + (24 + l)), (f = Number(c[0]) + 1) > 24 && (l = "第二天" + (24 + l)), 
                            a.YKDesc.push(l + "~" + f + "点；");
                        }
                        if (a.tide.Day_Time3) {
                            c = a.tide.Day_Time3.split(":");
                            if (a.tide.Day_Time3 = c[0] + ":" + c[1], d) a.tide.State3 = "满潮"; else (l = Number(c[0]) - 4) < 0 && (l = "前天" + (24 + l)), 
                            a.GHDesc.push({
                                desc: l + ":" + c[1] + " ~ " + a.tide.Day_Time3 + "点",
                                pj: n.set_GHPJ(a.tide.Day_High_Tide3),
                                pf: n.set_GHPF(a.tide.Day_High_Tide3),
                                h: a.tide.Day_High_Tide3
                            }), a.tide.State3 = "干潮";
                            (l = Number(c[0]) - 1) < 0 && (l = "前天" + (24 + l)), (f = Number(c[0]) + 1) > 24 && (l = "第二天" + (24 + l)), 
                            a.YKDesc.push(l + "~" + f + "点；");
                        }
                        if (a.tide.Day_Time4) {
                            var l, f;
                            c = a.tide.Day_Time4.split(":");
                            if (a.tide.Day_Time4 = c[0] + ":" + c[1], d) (l = Number(c[0]) - 4) < 0 && (l = "前天" + (24 + l)), 
                            a.GHDesc.push({
                                desc: l + ":" + c[1] + " ~ " + a.tide.Day_Time4 + "点",
                                pj: n.set_GHPJ(a.tide.Day_High_Tide4),
                                pf: n.set_GHPF(a.tide.Day_High_Tide4),
                                h: a.tide.Day_High_Tide4
                            }), a.tide.State4 = "干潮"; else a.tide.State4 = "满潮";
                            (l = Number(c[0]) - 1) < 0 && (l = "前天" + (24 + l)), (f = Number(c[0]) + 1) > 24 && (l = "第二天" + (24 + l)), 
                            a.YKDesc.push(l + "~" + f + "点；");
                        }
                    }
                    for (var i in a.GHDesc) (!a.GHDescPF || a.GHDesc[i].pf > a.GHDescPF) && (a.GHDescPF = a.GHDesc[i].pf, 
                    a.GHDescPJ = a.GHDesc[i].pj);
                }
                o(n.weather);
            }
        });
    },
    get_TideMonth: function(t, o) {
        var n = this, s = a.getStorageSync("globalData"), d = Date.parse(new Date()) / 1e3, c = r.hexMD5(n.appId + i.config.AppKey + s.memberid + d);
        a.request({
            url: i.config.Domain + "/Tides/GetTideMonth",
            data: {
                id: n.id,
                uid: s.memberid,
                isDiy: n.isDiy,
                timestamp: d,
                sign: c
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(t) {
                if (!t.data || 1 == t.data.ret) return a.showToast({
                    title: "数据加载失败！",
                    icon: "none",
                    duration: 1e3,
                    mask: !0
                }), void o({});
                var i = t.data.data, r = [], s = [], d = [], c = [];
                for (var l in i) {
                    var f = i[l].Month_Date.split("T")[0].split("-");
                    c.push(f[1] + "/" + f[2]), i[l].Month_Max_Time = i[l].Month_Max_Time.substring(0, 5), 
                    i[l].Month_Min_Time = i[l].Month_Min_Time.substring(0, 5), r.push(Number(i[l].Month_Max_Tide) / 100), 
                    s.push(Number(i[l].Month_Min_Tide) / 100), d.push(0);
                }
                n.option = {
                    grid: [ {
                        top: 63,
                        left: 30,
                        right: 10,
                        bottom: 30
                    } ],
                    backgroundColor: "#122b3a",
                    color: [ "#2d8274", "#1f5b59" ],
                    title: {
                        text: "未来" + i.length + "天潮汐高低差一览",
                        textStyle: {
                            color: "#fff",
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: "axis",
                        position: [ 5, 21 ],
                        formatter: function(e) {
                            console.log(e);
                            var t = e[0].dataIndex;
                            return i[t].Month_Date.split("T")[0] + "，最高水位[" + i[t].Month_Max_Time + "]：" + e[0].data + "米，最低水位[" + i[t].Month_Min_Time + "]：" + e[1].data + "米";
                        }
                    },
                    legend: {
                        data: [ "最高潮位", "最低潮位" ],
                        selected: {},
                        right: 10,
                        textStyle: {
                            color: "#fff",
                            fontSize: 12
                        }
                    },
                    calculable: !0,
                    xAxis: [ {
                        type: "category",
                        data: c,
                        axisLine: {
                            lineStyle: {
                                color: "#fff"
                            }
                        },
                        splitLine: {
                            show: !1,
                            lineStyle: {
                                type: "dashed",
                                color: "#3e4e58"
                            }
                        }
                    } ],
                    yAxis: [ {
                        type: "value",
                        axisLine: {
                            lineStyle: {
                                color: "#fff"
                            }
                        },
                        splitLine: {
                            show: !0,
                            lineStyle: {
                                type: "dashed",
                                color: "#3e4e58"
                            }
                        }
                    } ],
                    series: [ {
                        name: "最高潮位",
                        type: "line",
                        barGap: "-100%",
                        label: {
                            show: !0,
                            position: "top",
                            textStyle: {
                                color: "#fff",
                                fontSize: 8
                            },
                            formatter: function(e) {
                                return e.value;
                            }
                        },
                        itemStyle: {
                            color: new e.graphic.LinearGradient(0, 0, 0, 1, [ {
                                offset: 0,
                                color: "rgba(20,200,212,0.5)"
                            }, {
                                offset: 1,
                                color: "rgba(20,200,212,0)"
                            } ])
                        },
                        z: -12,
                        data: r
                    }, {
                        name: "最低潮位",
                        type: "line",
                        label: {
                            show: !0,
                            position: "top",
                            textStyle: {
                                color: "#fff",
                                fontSize: 8
                            },
                            formatter: function(e) {
                                return e.value;
                            }
                        },
                        itemStyle: {
                            color: new e.graphic.LinearGradient(0, 0, 0, 1, [ {
                                offset: 0,
                                color: "#14c8d4"
                            }, {
                                offset: 1,
                                color: "#43eec6"
                            } ])
                        },
                        data: s
                    } ]
                }, o(t.data.data);
            }
        });
    },
    data: {
        modeWindType: 1
    },
    onLoad: function(e) {
        var t = this;
        t.id = e.id, t.isDiy = e.isDiy, t.id || (t.id = 903), t.setData({
            ec: {
                onInit: t.initChart
            },
            modeWindType: a.getStorageSync("modeWindType") ? a.getStorageSync("modeWindType") : 1
        });
    },
    onReady: function() {
        var e = this;
        e.get_WeatherDay(e.id, function(t) {
            e.setData({
                weather: t
            }), a.setNavigationBarTitle({
                title: t.AddrStr + "-赶海潮汐日报"
            }), e.get_TideMonth(e.id, function(t) {
                console.log(t), e.chart.setOption(e.option);
            });
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindOpenTide: function(e) {
        a.navigateTo({
            url: "../tide/index?id=" + this.id
        });
    }
});