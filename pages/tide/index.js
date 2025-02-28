var e, t = require("../../@babel/runtime/helpers/interopRequireWildcard"), a = require("../../@babel/runtime/helpers/defineProperty"), i = t(require("../../ec-canvas/echarts")), d = new (require("../../utils/calendar-converter.js").CalendarConverter)(), r = require("../../utils/config.js"), n = r.config.sys, o = require("../../utils/md5.js"), s = (getApp(), 
null);

function c(e) {
    if (e && null != e && "null" != e) {
        var t = e.split(":");
        return Number(t[0]) + ":" + Number(t[1]);
    }
    return "";
}

Page({
    appId: n.getAccountInfoSync().miniProgram.appId,
    addrstr: [],
    provinceIndex: 0,
    cityIndex: 0,
    page: 1,
    isDiy: !1,
    isPosit: !1,
    commentList: [],
    isLoad: !1,
    chart: {},
    option: {},
    hour: 24,
    tide: {},
    weather: {},
    isUpdata: !1,
    current_date: new Date(),
    start_date: new Date(),
    end_date: new Date(),
    modeType: 2,
    cc: "6",
    x: [],
    AddrStr_ID: n.getStorageSync("AddrStr_ID"),
    clickNumb: 0,
    support: 0,
    isSupport: 0,
    location: {
        latitude: 0,
        longitude: 0
    },
    windowHeight: 0,
    initChart: function(e, t, a) {
        console.log(e);
        var d = this;
        return d.chart = i.init(e, null, {
            width: t,
            height: a
        }), d.chart.on("rendered", function() {}), d.chart;
    },
    get_info: function(e) {},
    get_comment: function(e) {
        var t = this;
        if (1 != t.isLoad && 0 != t.data.isComment) {
            t.isLoad = !0;
            var a = n.getStorageSync("globalData"), i = Date.parse(new Date()) / 1e3, d = o.hexMD5(t.appId + r.config.AppKey + a.memberid + i);
            n.request({
                url: r.config.Domain + "/Tides/GetCommentList",
                data: {
                    uid: a.memberid,
                    page: t.page,
                    timestamp: i,
                    sign: d
                },
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function(a) {
                    var i = [];
                    try {
                        i = a.data.data.rows;
                    } catch (e) {}
                    var d = [];
                    for (var r in i) 0 == i[r].PedarID && (i[r].comment = [], i[r].Type > 1 && (i[r].Extended = JSON.parse(i[r].Extended).data), 
                    d.push(i[r]));
                    for (var r in i) if (0 != i[r].PedarID) {
                        var n = d.find(function(e) {
                            return e.ID == i[r].PedarID;
                        });
                        n && n.comment.push(i[r]);
                    }
                    for (var r in d) t.commentList.push(d[r]);
                    t.isLoad = !1, console.log(t.commentList), e(t.commentList);
                }
            });
        }
    },
    select_Hour: function(e) {
        var t = this, a = parseInt(e / t.cc), i = {
            tide: {},
            wind: {}
        };
        switch (t.weather && t.weather.hour24 && t.weather.hour24.length > a && t.weather.hour24[a] && (i = t.weather.hour24[a]), 
        i.hour2 = t.x[e], i.tide.percentage = Number(10 * t.tide.TidePrp[e]).toFixed(1), 
        i.tide.speed = Number(t.tide.TideSpeed[e]).toFixed(2), t.tide.TideData[e] && "null" != t.tide.TideData[e] ? i.tide.height = Number(t.tide.TideData[e]) : t.tide.TideData1[e] && "null" != t.tide.TideData1[e] && (i.tide.height = Number(t.tide.TideData1[e])), 
        i.wind.wind_scale) {
          case 0:
          case 1:
            i.wind.wind_color = "#00FF00";
            break;

          case 2:
            i.wind.wind_color = "#00DD00";
            break;

          case 3:
            i.wind.wind_color = "#FFFF33";
            break;

          case 4:
            i.wind.wind_color = "#FFCC22";
            break;

          case 5:
            i.wind.wind_color = "#FFAA33";
            break;

          case 6:
            i.wind.wind_color = "#FF8800";
            break;

          case 7:
            i.wind.wind_color = "#FF7744";
            break;

          case 8:
            i.wind.wind_color = "#FF5511";
            break;

          case 9:
            i.wind.wind_color = "#FF3333";
            break;

          default:
            i.wind.wind_color = "#FF0000";
        }
        t.setData({
            WeatherHour: i
        });
    },
    set_GHPJ: function(e) {
        return Number(e) < .5 ? "(优)" : Number(e) < 1 ? "(好)" : Number(e) < 1.5 ? "(一般)" : "(差)";
    },
    set_opion1: function() {
        var e = this, t = [];
        try {
            var a = e.tide.DayList.Day_Time1.split(":");
            t.push(e.getMarkPoint(a[0], a[1], e.tide.isRetreat ? "#ff8585" : "#aaaaff", ""));
        } catch (e) {}
        try {
            a = e.tide.DayList.Day_Time2.split(":");
            t.push(e.getMarkPoint(a[0], a[1], e.tide.isRetreat ? "#aaaaff" : "#ff8585", ""));
        } catch (e) {}
        try {
            a = e.tide.DayList.Day_Time3.split(":");
            t.push(e.getMarkPoint(a[0], a[1], e.tide.isRetreat ? "#ff8585" : "#aaaaff", ""));
        } catch (e) {}
        try {
            a = e.tide.DayList.Day_Time4.split(":");
            t.push(e.getMarkPoint(a[0], a[1], e.tide.isRetreat ? "#aaaaff" : "#ff8585", ""));
        } catch (e) {}
        try {
            var d = new Date();
            t.push(e.getMarkPoint(d.getHours(), d.getMinutes(), "#3ba7a3", ""));
        } catch (e) {}
        e.tide.TideChange.length > 4 ? (t = [], e.setData({
            isAI: !1
        }), e.tide.TideDesc = "注意：曲线向下为退潮，曲线向上为涨潮；退潮赶海，涨潮回家！") : e.setData({
            isAI: !0
        }), e.option = {
            grid: [ {
                top: 20,
                left: 33,
                right: 16,
                bottom: 45
            } ],
            color: [ "#2d8274", "#1f5b59", "#fa2424", "#87e1d4" ],
            backgroundColor: "#122b3a",
            tooltip: {
                show: !0,
                trigger: "axis",
                axisPointer: {
                    type: "line",
                    label: {
                        backgroundColor: "#1f5b59"
                    }
                },
                formatter: function(t) {
                    var a = t[0].dataIndex;
                    return e.select_Hour(a), "";
                }
            },
            legend: {
                data: [ "白天.潮", "晚上.汐", "流速", "赶海.宜" ],
                selected: {
                    "流速": 1 == e.modeType,
                    "赶海.宜": 2 == e.modeType
                },
                bottom: 0,
                textStyle: {
                    color: "#fff",
                    fontSize: 12
                }
            },
            xAxis: {
                type: "category",
                boundaryGap: !1,
                data: e.x,
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                }
            },
            yAxis: {
                x: "center",
                type: "value",
                splitLine: {
                    lineStyle: {
                        type: "dashed",
                        color: "#3e4e58"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                }
            },
            series: [ {
                name: "白天.潮",
                type: "line",
                smooth: !0,
                areaStyle: {
                    normal: {
                        color: new i.graphic.LinearGradient(0, 0, 0, 1, [ {
                            offset: 0,
                            color: "#2a7d70"
                        }, {
                            offset: 1,
                            color: "#143340"
                        } ])
                    }
                },
                symbol: "none",
                data: e.tide.TideData,
                markPoint: {
                    data: t,
                    symbolSize: 30,
                    itemStyle: {
                        normal: {
                            label: {
                                fontSize: 6
                            }
                        }
                    }
                }
            }, {
                name: "晚上.汐",
                type: "line",
                smooth: !0,
                areaStyle: {
                    normal: {
                        color: new i.graphic.LinearGradient(0, 0, 0, 1, [ {
                            offset: 0,
                            color: "#1f5b59"
                        }, {
                            offset: 1,
                            color: "#0f1b1a"
                        } ])
                    }
                },
                symbol: "none",
                data: e.tide.TideData1
            }, {
                name: "流速",
                type: "line",
                smooth: !0,
                areaStyle: {
                    normal: {
                        color: new i.graphic.LinearGradient(0, 0, 0, 1, [ {
                            offset: 0,
                            color: "#fa2424"
                        }, {
                            offset: 1,
                            color: "#143340"
                        } ])
                    }
                },
                symbol: "none",
                data: e.tide.TideSpeed
            }, {
                name: "赶海.宜",
                type: "line",
                smooth: !0,
                symbol: "none",
                data: e.tide.TideGH
            } ]
        };
    },
    set_opion2: function() {
        var e = this, t = [], a = [], d = [];
        e.x = [], e.cc = 1;
        for (var r = 0; r < 24; r++) e.x.push(r);
        e.weather.hour24.forEach(function(e, i) {
            e.wind.wave_height_new ? (t.push(e.wind.wave_height_new), e.wind.wave_height_new <= e.wind.wave_height ? a.push(e.wind.wave_height) : a.push(e.wind.wave_height_new)) : (t.push(e.wind.wave_height_avg), 
            e.wind.wave_height_avg <= e.wind.wave_height ? a.push(e.wind.wave_height) : a.push(e.wind.wave_height_avg)), 
            d.push(e.wind.wind_scale);
        }), e.option = {
            grid: [ {
                top: 20,
                left: 33,
                right: 16,
                bottom: 45
            } ],
            color: [ "#2d8274", "#36efe8", "#fa2424", "#87e1d4" ],
            backgroundColor: "#122b3a",
            tooltip: {
                show: !0,
                trigger: "axis",
                axisPointer: {
                    type: "line",
                    label: {
                        backgroundColor: "#1f5b59"
                    }
                },
                formatter: function(t) {
                    var a = t[0].dataIndex;
                    return e.select_Hour(a), "";
                }
            },
            legend: {
                data: [ "Min浪", "Max浪", "风/级", "" ],
                bottom: 0,
                textStyle: {
                    color: "#fff",
                    fontSize: 12
                }
            },
            xAxis: {
                type: "category",
                boundaryGap: !1,
                data: e.x,
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                }
            },
            yAxis: {
                x: "center",
                type: "value",
                splitLine: {
                    lineStyle: {
                        type: "dashed",
                        color: "#3e4e58"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                }
            },
            series: [ {
                name: "Min浪",
                type: "line",
                smooth: !0,
                symbol: "none",
                data: t,
                markPoint: {
                    data: []
                }
            }, {
                name: "Max浪",
                type: "line",
                smooth: !0,
                symbol: "none",
                data: a
            }, {
                name: "风/级",
                type: "line",
                smooth: !0,
                symbol: "none",
                data: d,
                areaStyle: {
                    normal: {
                        color: new i.graphic.LinearGradient(0, 0, 0, 1, [ {
                            offset: 0,
                            color: "#fa2424"
                        }, {
                            offset: 1,
                            color: "#143340"
                        } ])
                    }
                },
                markPoint: {
                    data: []
                }
            }, {
                data: []
            } ]
        };
    },
    set_opion3: function() {
        var e, t, d = this, r = [], n = [];
        d.x = [], d.cc = 1;
        for (var o = 0; o < 24; o++) d.x.push(o);
        d.weather.hour24.forEach(function(e, t) {
            r.push(e.water_temperature), n.push(e.temperature);
        }), d.option = {
            grid: [ {
                top: 20,
                left: 33,
                right: 16,
                bottom: 45
            } ],
            color: [ "#87e1d4", "#fa2424", "#2d8274", "#1f5b59" ],
            backgroundColor: "#122b3a",
            tooltip: {
                show: !0,
                trigger: "axis",
                axisPointer: {
                    type: "line",
                    label: {
                        backgroundColor: "#1f5b59"
                    }
                },
                formatter: function(e) {
                    var t = e[0].dataIndex;
                    return d.select_Hour(t), "";
                }
            },
            legend: {
                data: [ "温度", "水温", "", "" ],
                bottom: 0,
                textStyle: {
                    color: "#fff",
                    fontSize: 12
                }
            },
            xAxis: {
                type: "category",
                boundaryGap: !1,
                data: d.x,
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                }
            },
            yAxis: {
                x: "center",
                type: "value",
                splitLine: {
                    lineStyle: {
                        type: "dashed",
                        color: "#3e4e58"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "#fff"
                    }
                }
            },
            series: [ (e = {
                name: "温度",
                type: "line",
                smooth: !0,
                symbol: "none",
                data: n,
                areaStyle: {
                    normal: {
                        color: new i.graphic.LinearGradient(0, 0, 0, 1, [ {
                            offset: 0,
                            color: "#2a7d70"
                        }, {
                            offset: 1,
                            color: "#143340"
                        } ])
                    }
                }
            }, a(e, "symbol", "none"), a(e, "markPoint", {
                data: []
            }), e), (t = {
                name: "水温",
                type: "line",
                smooth: !0,
                symbol: "none",
                areaStyle: {
                    normal: {
                        color: new i.graphic.LinearGradient(0, 0, 0, 1, [ {
                            offset: 0,
                            color: "#fa2424"
                        }, {
                            offset: 1,
                            color: "#143340"
                        } ])
                    }
                }
            }, a(t, "symbol", "none"), a(t, "data", r), t), {
                areaStyle: {
                    normal: {
                        color: new i.graphic.LinearGradient(0, 0, 0, 1, [ {
                            offset: 0,
                            color: "#1f5b59"
                        }, {
                            offset: 1,
                            color: "#0f1b1a"
                        } ])
                    }
                },
                data: []
            }, {
                areaStyle: {
                    normal: {
                        color: new i.graphic.LinearGradient(0, 0, 0, 1, [ {
                            offset: 0,
                            color: "#1f5b59"
                        }, {
                            offset: 1,
                            color: "#0f1b1a"
                        } ])
                    }
                },
                data: []
            } ]
        };
    },
    set_tides: function(e) {
        for (var t = this, a = [], i = 60 / Number(t.cc), d = 0; d < t.hour; d++) for (var r = 0; r < 60; r += i) r < 10 ? a.push(d + ":0" + r) : a.push(d + ":" + r);
        if (a.push("0:00"), t.x = a, t.tide = e.data.tide, t.weather = e.data.weather, t.tide.TideData) {
            if (t.tide.TideData = t.tide.TideData.split(","), t.tide.TideData1 = t.tide.TideData1.split(","), 
            t.tide.TideSpeed = t.tide.TideSpeed.split(","), t.tide.TidePrp = t.tide.TidePrp.split(","), 
            t.tide.TideChange = t.tide.TideChange.split(","), t.tide.DayList.Day_Sunrise = c(t.tide.DayList.Day_Sunrise), 
            t.tide.DayList.Day_Sunset = c(t.tide.DayList.Day_Sunset), t.tide.DayList.Day_Length = c(t.tide.Day_Length), 
            t.tide.DayList.Day_Time1 = a[t.tide.TideChange[0]], t.tide.DayList.Day_Time2 = a[t.tide.TideChange[1]], 
            t.tide.DayList.Day_Time3 = a[t.tide.TideChange[2]], t.tide.DayList.Day_Time4 = a[t.tide.TideChange[3]], 
            t.tide.DayList.Day_High_Tide1 = "null" != t.tide.TideData[t.tide.TideChange[0]] ? t.tide.TideData[t.tide.TideChange[0]] : t.tide.TideData1[t.tide.TideChange[0]], 
            t.tide.DayList.Day_High_Tide2 = "null" != t.tide.TideData[t.tide.TideChange[1]] ? t.tide.TideData[t.tide.TideChange[1]] : t.tide.TideData1[t.tide.TideChange[1]], 
            t.tide.DayList.Day_High_Tide3 = "null" != t.tide.TideData[t.tide.TideChange[2]] ? t.tide.TideData[t.tide.TideChange[2]] : t.tide.TideData1[t.tide.TideChange[2]], 
            t.tide.DayList.Day_High_Tide4 = "null" != t.tide.TideData[t.tide.TideChange[3]] ? t.tide.TideData[t.tide.TideChange[3]] : t.tide.TideData1[t.tide.TideChange[3]], 
            t.tide.DayList.State1 = t.tide.isRetreat ? "满潮" : "干潮", t.tide.DayList.State2 = t.tide.isRetreat ? "干潮" : "满潮", 
            t.tide.DayList.State3 = t.tide.isRetreat ? "满潮" : "干潮", t.tide.DayList.State4 = t.tide.isRetreat ? "干潮" : "满潮", 
            t.tide.DayList.ready1 = t.tide.isRetreat ? "退潮" : "涨潮", t.tide.DayList.ready2 = t.tide.isRetreat ? "涨潮" : "退潮", 
            t.tide.DayList.ready3 = t.tide.isRetreat ? "退潮" : "涨潮", t.tide.DayList.ready4 = t.tide.isRetreat ? "涨潮" : "退潮", 
            t.tide.GHDesc = "推荐赶海时间：", t.tide.YKDesc = "最佳鱼口时间：", t.tide.TideDesc = "", t.tide.Date = t.tide.Date.split("T")[0], 
            t.tide.GHStart = [], t.tide.GHEnd = [], t.tide.DayList.Day_Time1) {
                var o = t.tide.DayList.Day_Time1.split(":");
                if ("干潮" == t.tide.DayList.State1) (s = Number(o[0]) - 4) < 0 && (s = "前天" + (24 + s)), 
                t.tide.GHDesc += s + ":" + o[1] + " - " + t.tide.DayList.Day_Time1 + "点" + t.set_GHPJ(t.tide.DayList.Day_High_Tide1) + "；", 
                t.tide.GHStart.push((Number(o[0]) - 4) * t.cc + Math.floor(Number(o[1]) / (60 / t.cc))), 
                t.tide.GHEnd.push(Number(o[0]) * t.cc + Math.floor(Number(o[1]) / (60 / t.cc))); else t.tide.DayList.Day_Time2 ? t.tide.TideDesc += t.tide.DayList.Day_Time1 + "点 - " + t.tide.DayList.Day_Time2 + "点" + t.tide.DayList.ready1 + "；" : t.tide.TideDesc += t.tide.DayList.Day_Time1 + "点开始" + t.tide.DayList.ready1 + "；";
                (s = Number(o[0]) - 1) < 0 && (s = "前天" + (24 + s)), (l = Number(o[0]) + 1) > 24 && (s = "第二天" + (24 + s)), 
                t.tide.YKDesc += s + "-" + l + "点；";
            }
            if (t.tide.DayList.Day_Time2 && Number(t.tide.DayList.Day_High_Tide1) - Number(t.tide.DayList.Day_High_Tide2) > .6) {
                o = t.tide.DayList.Day_Time2.split(":");
                if ("干潮" == t.tide.DayList.State2) (s = Number(o[0]) - 4) < 0 && (s = "前天" + (24 + s)), 
                t.tide.GHDesc += s + ":" + o[1] + " - " + t.tide.DayList.Day_Time2 + "点" + t.set_GHPJ(t.tide.DayList.Day_High_Tide2) + "；", 
                t.tide.GHStart.push((Number(o[0]) - 4) * t.cc + Math.floor(Number(o[1]) / (60 / t.cc))), 
                t.tide.GHEnd.push(Number(o[0]) * t.cc + Math.floor(Number(o[1]) / (60 / t.cc))); else t.tide.DayList.Day_Time3 ? t.tide.TideDesc += t.tide.DayList.Day_Time2 + "点 - " + t.tide.DayList.Day_Time3 + "点" + t.tide.DayList.ready2 + "；" : t.tide.TideDesc += t.tide.DayList.Day_Time2 + "点开始" + t.tide.DayList.ready2 + "；";
                (s = Number(o[0]) - 1) < 0 && (s = "前天" + (24 + s)), (l = Number(o[0]) + 1) > 24 && (s = "第二天" + (24 + s)), 
                t.tide.YKDesc += s + "-" + l + "点；";
            }
            if (t.tide.DayList.Day_Time3) {
                o = t.tide.DayList.Day_Time3.split(":");
                if ("干潮" == t.tide.DayList.State3 && Number(t.tide.DayList.Day_High_Tide2) - Number(t.tide.DayList.Day_High_Tide3) > .6) (s = Number(o[0]) - 4) < 0 && (s = "前天" + (24 + s)), 
                t.tide.GHDesc += s + ":" + o[1] + " - " + t.tide.DayList.Day_Time3 + "点" + t.set_GHPJ(t.tide.DayList.Day_High_Tide3) + "；", 
                t.tide.GHStart.push((Number(o[0]) - 4) * t.cc + Math.floor(Number(o[1]) / (60 / t.cc))), 
                t.tide.GHEnd.push(Number(o[0]) * t.cc + Math.floor(Number(o[1]) / (60 / t.cc))); else t.tide.DayList.Day_Time4 ? t.tide.TideDesc += t.tide.DayList.Day_Time3 + "点 - " + t.tide.DayList.Day_Time4 + "点" + t.tide.DayList.ready3 + "；" : t.tide.TideDesc += t.tide.DayList.Day_Time3 + "点开始" + t.tide.DayList.ready3 + "；";
                (s = Number(o[0]) - 1) < 0 && (s = "前天" + (24 + s)), (l = Number(o[0]) + 1) > 24 && (s = "第二天" + (24 + s)), 
                t.tide.YKDesc += s + "-" + l + "点；";
            }
            if (t.tide.DayList.Day_Time4) {
                var s, l;
                o = t.tide.DayList.Day_Time4.split(":");
                if ("干潮" == t.tide.DayList.State4 && Number(t.tide.DayList.Day_High_Tide3) - Number(t.tide.DayList.Day_High_Tide4) > .6) (s = Number(o[0]) - 4) < 0 && (s = "前天" + (24 + s)), 
                t.tide.GHDesc += s + ":" + o[1] + " - " + t.tide.DayList.Day_Time4 + "点" + t.set_GHPJ(t.tide.DayList.Day_High_Tide4) + "；", 
                t.tide.GHStart.push((Number(o[0]) - 4) * t.cc + Math.floor(Number(o[1]) / (60 / t.cc))), 
                t.tide.GHEnd.push(Number(o[0]) * t.cc + Math.floor(Number(o[1]) / (60 / t.cc))); else t.tide.TideDesc += t.tide.DayList.Day_Time4 + "点开始" + t.tide.DayList.ready4 + "；";
                (s = Number(o[0]) - 1) < 0 && (s = "前天" + (24 + s)), (l = Number(o[0]) + 1) > 24 && (s = "第二天" + (24 + s)), 
                t.tide.YKDesc += s + "-" + l + "点；";
            }
            "推荐赶海时间：" == t.tide.GHDesc && (t.tide.GHDesc = "没有推荐赶海时间"), t.tide.TideGH = [ t.tide.TideSpeed.length ];
            for (d = 0; d < t.tide.TideSpeed.length; d++) t.tide.TideGH[d] = "null", t.tide.GHStart.length > 0 && d >= t.tide.GHStart[0] && d <= t.tide.GHEnd[0] && (t.tide.TideGH[d] = "null" == t.tide.TideData[d] ? t.tide.TideData1[d] : t.tide.TideData[d]), 
            t.tide.GHStart.length > 1 && d >= t.tide.GHStart[1] && d <= t.tide.GHEnd[1] && (t.tide.TideGH[d] = "null" == t.tide.TideData[d] ? t.tide.TideData1[d] : t.tide.TideData[d]);
            switch (t.data.dataType) {
              case 1:
                t.set_opion1();
                break;

              case 2:
                t.set_opion2();
                break;

              case 3:
                t.set_opion3();
            }
            t.isPosit && (t.AddrStr_ID = t.tide.Addrstr.AddrStr_ID), n.setNavigationBarTitle({
                title: t.tide.TideName + "潮汐表"
            }), 0 == t.isDiy && 0 == t.isPosit && (n.setStorageSync("AddrStr_ID", e.data.tide.Addrstr.AddrStr_ID), 
            n.setStorageSync("AddrStr_Name", e.data.tide.Addrstr.AddrStr_Name)), setTimeout(function() {
                var e = new Date(), a = e.getHours() * t.cc + Math.ceil(e.getMinutes() / (60 / t.cc));
                t.select_Hour(a);
            }, 3e3);
        } else n.showToast({
            title: "数据读取失败，请重试！",
            icon: "none",
            duration: 2e3,
            mask: !0
        });
    },
    get_tides: function(e) {
        var t = this;
        1 == t.modeType ? n.showToast({
            title: "钓鱼模式",
            icon: "loading",
            duration: 1e4,
            mask: !0
        }) : n.showToast({
            title: "赶海模式",
            icon: "loading",
            duration: 1e4,
            mask: !0
        });
        var a = n.getStorageSync("globalData"), i = t.current_date.getMonth() + 1, d = t.current_date.getDate(), s = t.current_date.getFullYear() + "-" + (Number(i) < 10 ? "0" + i : i) + "-" + (Number(d) < 10 ? "0" + d : d), c = Date.parse(new Date()) / 1e3, l = o.hexMD5(t.appId + r.config.AppKey + a.secret + a.memberid + t.AddrStr_ID + s + c);
        if (t.cc = n.getStorageSync("cc") ? n.getStorageSync("cc") : 6, 0 == t.isDiy && 0 == t.isPosit) {
            var u = "Tide_" + t.AddrStr_ID + "_" + t.cc, D = n.getStorageSync(u);
            if (console.log(D), D) {
                var m = (D || []).findIndex(function(e) {
                    return -1 != e.key.indexOf(s);
                });
                if (-1 != m) {
                    var h = D[m], g = Date.parse(new Date(h.date)), y = (Date.parse(new Date(new Date())) - g) % 864e5, f = Math.floor(y / 36e5);
                    if (f < 2 || isNaN(f)) {
                        var p = {};
                        return p.data = h, t.set_tides(p), n.hideToast(), void e(h);
                    }
                }
            }
        }
        n.request({
            url: r.config.Domain + "/Tides/GetTides/",
            data: {
                id: t.AddrStr_ID,
                uid: a.memberid,
                date: s,
                timestamp: c,
                sign: l,
                cc: t.cc,
                isdiy: t.isDiy,
                isposit: t.isPosit,
                latitude: t.location.latitude,
                longitude: t.location.longitude,
                hour: t.hour
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(a) {
                if (2 != a.data.ret) {
                    if (n.hideToast(), 0 == t.isDiy && 0 == t.isPosit) {
                        var i = new Date(), d = new Date(s);
                        if (i.setDate(i.getDate() + 14), d < i) {
                            a.data.key = s, a.data.date = new Date();
                            var r = "Tide_" + t.AddrStr_ID + "_" + t.cc;
                            if ((l = n.getStorageSync("TideAddrStr")) ? -1 == l.indexOf(r) && l.push(r) : l = [ r ], 
                            n.setStorageSync("TideAddrStr", l), D = n.getStorageSync(r)) {
                                var o = (D || []).findIndex(function(e) {
                                    return -1 != e.key.indexOf(s);
                                });
                                -1 == o ? D.push(a.data) : D[o] = a.data;
                            } else D = [ a.data ];
                            try {
                                var c = wx.getStorageInfoSync();
                                if (c.currentSize < .8 * c.limitSize) n.setStorageSync(r, D); else {
                                    console.log("clearTidesStorage");
                                    var l = n.getStorageSync("TideAddrStr");
                                    for (var u in l) {
                                        var D = n.getStorageSync(l[u]), m = [];
                                        for (var h in D) {
                                            var g = D[h], y = (new Date().getTime() - new Date(g.key).getTime()) / 864e5;
                                            y < 1 && y > -10 && m.push(g);
                                        }
                                        n.setStorageSync(l[u], m);
                                    }
                                }
                            } catch (e) {
                                e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
                                console.log(e);
                            }
                            console.log("保存缓存：" + r);
                        }
                    }
                    t.set_tides(a), e(a.data);
                }
            },
            error: function(e) {
                n.showToast({
                    title: "数据失败！",
                    icon: "none",
                    duration: 1e3,
                    mask: !0
                });
            },
            timeout: function(e) {
                n.showToast({
                    title: "数据失败！",
                    icon: "none",
                    duration: 1e3,
                    mask: !0
                });
            },
            fail: function(e) {
                n.showToast({
                    title: "数据失败！",
                    icon: "none",
                    duration: 1e3,
                    mask: !0
                });
            }
        });
    },
    get_AddrStr: function(e) {
        var t = n.getStorageSync("addrstr"), a = n.getStorageSync("addrstr_date"), i = Date.parse(new Date(a)), d = (Date.parse(new Date(new Date())) - i) % 864e5, o = Math.floor(d / 36e5);
        if (!t || o > 24 || isNaN(o)) {
            n.request({
                url: r.config.Domain + "/Tides/GetAddrStr",
                method: "GET",
                header: {
                    "content-type": "application/json"
                },
                success: function(t) {
                    t.data.data = [ {
                        label: "请选择",
                        level: 1,
                        value: 0,
                        children: [ {
                            label: "请选择",
                            level: 2,
                            value: 0,
                            children: [ {
                                label: "请选择",
                                level: 3,
                                value: 0
                            } ]
                        } ]
                    } ].concat(t.data.data), n.setStorageSync("addrstr", t.data), n.setStorageSync("addrstr_date", new Date()), 
                    e(t.data);
                }
            });
        } else e(t);
    },
    getMarkPoint: function(e, t, a, i) {
        var d = this, r = e * d.cc + Math.ceil(t / (60 / d.cc)), n = Number(e) + ":" + Number(t);
        return i.length > 0 && (n = i), {
            name: "",
            value: n,
            xAxis: r,
            yAxis: "null" != d.tide.TideData[r] ? d.tide.TideData[r] : d.tide.TideData1[r],
            itemStyle: {
                color: a
            }
        };
    },
    get_location: function(e) {
        n.getLocation({
            success: function(t) {
                e(t);
            }
        });
    },
    get_nearbyAddrStr: function(e, t) {
        n.request({
            url: r.config.Domain + "/Tides/GetNearbyAddrStr",
            data: {
                longitude: e.longitude,
                latitude: e.latitude
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(e) {
                t(e.data.data);
            }
        });
    },
    get_multiArray: function(e) {
        for (var t = this, a = 0; a < t.addrstr.length; a++) for (var i = 0; i < t.addrstr[a].children.length; i++) for (var d = 0; d < t.addrstr[a].children[i].children.length; d++) {
            if (t.addrstr[a].children[i].children[d].value == e) return [ a, i, d ];
        }
        return null;
    },
    set_MyAddrstr: function(e) {
        var t, a = this, i = [];
        n.getStorageSync("myUseAddrStr").length > 0 && (i = n.getStorageSync("myUseAddrStr")), 
        i.length > 0 && (t = i.find(function(t) {
            return t.value == a.addrstr[e[0]].children[e[1]].children[e[2]].value;
        })), console.log(t), null != t ? t.count += 1 : i.push({
            label: a.addrstr[e[0]].children[e[1]].children[e[2]].label,
            value: a.addrstr[e[0]].children[e[1]].children[e[2]].value,
            count: 1
        }), n.setStorageSync("myUseAddrStr", i);
    },
    dateFormat: function(e, t) {
        var a, i = {
            "Y+": t.getFullYear().toString(),
            "m+": (t.getMonth() + 1).toString(),
            "d+": t.getDate().toString(),
            "H+": t.getHours().toString(),
            "M+": t.getMinutes().toString(),
            "S+": t.getSeconds().toString()
        };
        for (var d in i) (a = new RegExp("(" + d + ")").exec(e)) && (e = e.replace(a[1], 1 == a[1].length ? i[d] : i[d].padStart(a[1].length, "0")));
        return e;
    },
    data: {
        clickNumb: "*****",
        support: "*****",
        isSupport: 0,
        multiArray: [],
        multiIndex: [ 0, 0, 0 ],
        ccList: [ "1分钟", "5分钟", "10分钟", "15分钟", "30分钟", "1小时" ],
        ccIndex: 2,
        addrStrName: "请选择",
        nearbyAddrStr: [],
        weather: {},
        tide: {},
        location: {},
        showHour24: "",
        showDay15: "",
        commentList: [],
        commentText: "",
        pedarID: 0,
        isDiy: !1,
        isPosit: !1,
        pedarName: "",
        isAD: !1,
        isAuxiliary: !0,
        WeatherHour: {},
        modeType: 2,
        isAI: !0,
        lastTapTime: 0,
        dataType: 1,
        modeWindType: 1,
        isComment: 1,
        dateList: [],
        IsGG100: !1,
        current_to_date: "",
        newDateScrollInfo: {
            scrollLeft: 0,
            itemWidth: 0,
            width: 0
        }
    },
    onLoad: function(e) {
        var t = this, a = n.getStorageSync("globalData");
        switch ((!a.vip || a.vip < 1) && t.setData({
            isAD: !0
        }), e.type) {
          case "diy":
            t.isDiy = !0, t.setData({
                isDiy: t.isDiy
            });
            break;

          case "posit":
            t.isPosit = !0, t.location.latitude = e.lat, t.location.longitude = e.lng;
        }
        if (e.id ? t.AddrStr_ID = e.id : t.AddrStr_ID = ("" + n.getStorageSync("AddrStr_ID")).length > 0 ? n.getStorageSync("AddrStr_ID") : t.AddrStr_ID = "903", 
        e.date ? new Date().getTime() > new Date(e.date).getTime() ? t.current_date = new Date() : t.current_date = new Date(e.date) : t.current_date = new Date(), 
        n.getStorageSync("modeType") && (t.modeType = n.getStorageSync("modeType"), t.setData({
            modeType: t.modeType
        })), n.getStorageSync("cc")) {
            switch (t.cc = n.getStorageSync("cc"), t.cc) {
              case 60:
                t.data.ccIndex = 0;
                break;

              case 12:
                t.data.ccIndex = 1;
                break;

              case 6:
                t.data.ccIndex = 2;
                break;

              case 4:
                t.data.ccIndex = 3;
                break;

              case 2:
                t.data.ccIndex = 4;
                break;

              case 1:
                t.data.ccIndex = 5;
            }
            t.setData({
                ccIndex: t.data.ccIndex
            });
        }
        var i = a.tideDays ? a.tideDays : 15;
        t.start_date = new Date(), t.end_date = new Date(), t.end_date.setDate(t.end_date.getDate() + (i - 1)), 
        t.start_date.setDate(t.start_date.getDate() - 5), t.setData({
            ec: {
                onInit: t.initChart
            },
            current_date: t.current_date.getFullYear() + "-" + (t.current_date.getMonth() + 1) + "-" + t.current_date.getDate(),
            start_date: t.start_date.getFullYear() + "-" + (t.start_date.getMonth() + 1) + "-" + t.start_date.getDate(),
            end_date: t.end_date.getFullYear() + "-" + (t.end_date.getMonth() + 1) + "-" + t.end_date.getDate(),
            modeWindType: n.getStorageSync("modeWindType") ? n.getStorageSync("modeWindType") : 1,
            isComment: n.getStorageSync("isComment") ? n.getStorageSync("isComment") : 1
        }), t.getDateList(), setTimeout(function() {
            t.get_info(function(e) {
                t.setData({
                    clickNumb: t.clickNumb,
                    support: t.support,
                    isSupport: t.isSupport
                });
            });
        }, 3e3), t.get_AddrStr(function(e) {
            t.addrstr = e.data;
            var a = t.get_multiArray(t.AddrStr_ID);
            (t.isDiy || t.isPosit) && (a = [ 0, 0, 0 ]), t.setData({
                multiArray: [ t.addrstr, t.addrstr[a[0]].children, t.addrstr[a[0]].children[a[1]].children ],
                multiIndex: a,
                addrStrName: t.addrstr[a[0]].children[a[1]].children[a[2]].label
            }), t.provinceIndex = t.data.multiIndex[0], t.cityIndex = t.data.multiIndex[1], 
            t.set_MyAddrstr(a);
        }), n.onCompassChange(function(e) {
            t.setData({
                rotate: 360 - e.direction.toFixed(0)
            });
        }), n.getSystemInfo({
            success: function(e) {
                t.windowHeight = e.windowHeight;
            }
        });
    },
    getDateList: function() {
        for (var e = this, t = n.getStorageSync("globalData"), a = [], i = t.tideDays ? t.tideDays : 15, r = -5; r < i; r++) {
            var o = new Date(), s = o.getMonth() + 1, c = o.getDate(), l = o.getFullYear() + "-" + (Number(s) < 10 ? "0" + s : s) + "-" + (Number(c) < 10 ? "0" + c : c);
            o.setDate(o.getDate() + r);
            var u = d.GetWeekDate(o.getDay(), 2);
            s = o.getMonth() + 1, c = o.getDate();
            var D = o.getFullYear() + "-" + (Number(s) < 10 ? "0" + s : s) + "-" + (Number(c) < 10 ? "0" + c : c), m = d.solar2lunar(new Date(D)).lunarDay, h = d.GetTideType(m), g = d.GetCSS(h);
            s = e.current_date.getMonth() + 1, c = e.current_date.getDate();
            var y = D == e.current_date.getFullYear() + "-" + (Number(s) < 10 ? "0" + s : s) + "-" + (Number(c) < 10 ? "0" + c : c) ? "select" : "", f = D == l ? "today" : "";
            a.push({
                id: D,
                weeks: u,
                date: o.getDate(),
                earthly: m,
                tide: h,
                css: g,
                today: f,
                select: y
            });
        }
        if (e.setData({
            dateList: a
        }), "" == e.data.current_to_date) {
            var p = new Date();
            s = p.getMonth() + 1, c = p.getDate();
            e.setData({
                current_to_date: p.getFullYear() + "-" + (Number(s) < 10 ? "0" + s : s) + "-" + (Number(c) < 10 ? "0" + c : c)
            });
        } else n.createSelectorQuery().selectAll(".newdate").boundingClientRect(function(t) {
            console.log("newdate", t[0]);
            var a = t[0];
            n.createSelectorQuery().selectAll(".newdate .item .select").boundingClientRect(function(t) {
                console.log("select", t[0]);
                var i = t[0], d = i.dataset.date;
                if (i.left < 0) {
                    var r = Math.round((e.data.newDateScrollInfo.scrollLeft + i.left) / e.data.newDateScrollInfo.itemWidth > 5 ? 5 : (e.data.newDateScrollInfo.scrollLeft + i.left) / e.data.newDateScrollInfo.itemWidth);
                    (s = new Date(d)).setDate(s.getDate() - r);
                    var n = s.getMonth() + 1, o = s.getDate();
                    e.setData({
                        current_to_date: s.getFullYear() + "-" + (Number(n) < 10 ? "0" + n : n) + "-" + (Number(o) < 10 ? "0" + o : o)
                    });
                }
                if (i.right >= a.width) {
                    var s;
                    r = Math.round((e.data.newDateScrollInfo.width - i.right) / e.data.newDateScrollInfo.itemWidth > 2 ? 2 : (e.data.newDateScrollInfo.width - i.right) / e.data.newDateScrollInfo.itemWidth);
                    (s = new Date(d)).setDate(s.getDate() - r);
                    n = s.getMonth() + 1, o = s.getDate();
                    e.setData({
                        current_to_date: s.getFullYear() + "-" + (Number(n) < 10 ? "0" + n : n) + "-" + (Number(o) < 10 ? "0" + o : o)
                    });
                }
            }).exec();
        }).exec();
    },
    bindNewDateScroll: function(e) {
        this.getScrollTop(e.detail.scrollLeft);
    },
    getScrollTop: function(t) {
        var a = this;
        clearTimeout(e), e = setTimeout(function() {
            n.createSelectorQuery().selectAll(".newdate .item").boundingClientRect(function(e) {
                var i = n.getStorageSync("globalData"), d = 5 + (i.tideDays ? i.tideDays : 15), r = e[0].width;
                a.setData({
                    newDateScrollInfo: {
                        scrollLeft: t,
                        itemWidth: r,
                        width: r * d
                    }
                }), console.log("滚动", a.data.newDateScrollInfo);
            }).exec();
        }, 500);
    },
    bindSelectDateList: function(e) {
        var t = e.currentTarget.dataset.date;
        this.current_date = new Date(t), this.getDate();
    },
    getDate: function() {
        var e = this, t = e.get_multiArray(e.AddrStr_ID);
        e.provinceIndex = e.data.multiIndex[0], e.cityIndex = e.data.multiIndex[1], e.get_tides(function(a) {
            e.chart.setOption(e.option), e.isDiy || e.isPosit || e.setData({
                multiArray: [ e.addrstr, e.addrstr[t[0]].children, e.addrstr[t[0]].children[t[1]].children ],
                multiIndex: t,
                addrStrName: e.addrstr[t[0]].children[t[1]].children[t[2]].label
            }), e.setData({
                current_date: e.current_date.getFullYear() + "-" + (e.current_date.getMonth() + 1) + "-" + e.current_date.getDate(),
                weather: e.weather,
                tide: e.tide
            }), e.getDateList();
        });
    },
    onReady: function() {
        var e = this;
        if (n.getStorageSync("globalData")) e.get_tides(function() {
            try {
                e.chart.setOption(e.option);
            } catch (t) {
                t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                setTimeout(function() {
                    try {
                        e.chart.setOption(e.option);
                    } catch (t) {
                        t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                        setTimeout(function() {
                            try {
                                e.chart.setOption(e.option);
                            } catch (t) {
                                t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                                setTimeout(function() {
                                    try {
                                        e.chart.setOption(e.option);
                                    } catch (e) {}
                                }, 5e3);
                            }
                        }, 4e3);
                    }
                }, 3e3);
            }
            e.setData({
                weather: e.weather,
                tide: e.tide
            });
        }); else try {
            e.get_tides(function() {
                setTimeout(function() {
                    try {
                        e.chart.setOption(e.option);
                    } catch (e) {}
                }, 3e3), e.setData({
                    weather: e.weather,
                    tide: e.tide
                });
            });
        } catch (e) {}
        var t = n.getStorageSync("isAuxiliary");
        "boolean" == typeof t && e.setData({
            isAuxiliary: t
        }), e.page = 1, e.commentList = [], e.get_comment(function(t) {
            e.setData({
                pedarID: 0,
                pedarName: "",
                commentList: e.commentList,
                commentText: ""
            });
        });
    },
    onShow: function() {
        var e = n.getStorageSync("selectDate");
        e && (n.setStorageSync("selectDate", ""), this.current_date = new Date(e), this.getDate());
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var e = this;
        return {
            title: e.tide.SeoTitle1,
            desc: e.tide.Title1,
            path: "/pages/tide/menu?path=tide&id=" + e.AddrStr_ID + "&date=" + e.current_date
        };
    },
    bindSelectDate: function(e) {
        n.navigateTo({
            url: "../tide/calendar?id=" + this.AddrStr_ID + "&isDiy=" + this.isDiy
        });
    },
    bindSelectDate2: function(e) {
        n.navigateTo({
            url: "../tide/newspaper?id=" + this.AddrStr_ID + (this.isDiy ? "&isDiy=true" : "")
        });
    },
    binSelectdPosition: function(e) {
        var t = this;
        n.chooseLocation({
            success: function(e) {
                t.get_nearbyAddrStr(e, function(e) {
                    t.setData({
                        nearbyAddrStr: e
                    });
                });
            }
        });
    },
    onPageScroll: function(e) {},
    bindComment: function(e) {
        var t = this;
        n.showToast({
            title: "数据加载中！",
            icon: "loading",
            duration: 2e4,
            mask: !0
        }), t.page += 1, t.get_comment(function(e) {
            t.setData({
                commentList: t.commentList,
                commentText: ""
            }), n.showToast({
                title: "加载完毕",
                icon: "succes",
                duration: 1e3,
                mask: !0
            });
        });
    },
    bindPickerChange: function(e) {
        var t = this, a = new Date(e.detail.value);
        a.getDate() != t.current_date.getDate() && (t.current_date = a, t.getDate());
    },
    bindCCChange: function(e) {
        var t = this, a = e.detail.value;
        switch (t.setData({
            ccIndex: a
        }), a) {
          case "0":
            t.cc = 60;
            break;

          case "1":
            t.cc = 12;
            break;

          case "2":
            t.cc = 6;
            break;

          case "3":
            t.cc = 4;
            break;

          case "4":
            t.cc = 2;
            break;

          case "5":
            t.cc = 1;
        }
        n.setStorageSync("cc", t.cc), t.getDate();
    },
    bindMultiPickerColumnChange: function(e) {
        var t = this, a = e.detail.column, i = e.detail.value;
        0 == a && (t.provinceIndex = i, t.cityIndex = 0, this.data.multiIndex = [ i, 0, 0 ]), 
        1 == a && (t.cityIndex = i, this.data.multiIndex = [ this.data.multiIndex[0], i, 0 ]), 
        2 == a && (this.data.multiIndex = [ this.data.multiIndex[0], this.data.multiIndex[1], i ]);
        try {
            this.setData({
                multiArray: [ t.addrstr, t.addrstr[t.provinceIndex].children, t.addrstr[t.provinceIndex].children[t.cityIndex].children ],
                multiIndex: this.data.multiIndex
            });
        } catch (e) {
            e = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(e);
            console.log(e, t.provinceIndex, t.addrstr[t.provinceIndex].children[t.cityIndex]);
        }
    },
    bindMultiPickerChange: function(e) {
        var t = this;
        0 != e.detail.value[0] && (t.isDiy = !1, t.isPosit = !1, this.setData({
            isDiy: t.isDiy
        }), t.AddrStr_ID != t.addrstr[e.detail.value[0]].children[e.detail.value[1]].children[e.detail.value[2]].value && (t.AddrStr_ID = t.addrstr[e.detail.value[0]].children[e.detail.value[1]].children[e.detail.value[2]].value, 
        t.getDate()));
    },
    bindSelectNearby: function(e) {
        var t = this;
        t.AddrStr_ID = e.target.dataset.id, t.isDiy = !1, t.isPosit = !1, t.setData({
            isDiy: t.isDiy
        }), t.getDate();
    },
    bindPrevious: function(e) {
        var t = this;
        t.start_date.getMonth() + 1 + "-" + t.start_date.getDate() != t.current_date.getMonth() + 1 + "-" + t.current_date.getDate() ? (t.current_date.setDate(t.current_date.getDate() - 1), 
        t.getDate()) : n.showToast({
            title: "超出日期可选范围！",
            icon: "none",
            duration: 1e3,
            mask: !0
        });
    },
    bindNext: function(e) {
        var t = this;
        t.end_date.getMonth() + 1 + "-" + t.end_date.getDate() != t.current_date.getMonth() + 1 + "-" + t.current_date.getDate() ? (t.current_date.setDate(t.current_date.getDate() + 1), 
        t.getDate()) : n.showToast({
            title: "超出日期可选范围！",
            icon: "none",
            duration: 1e3,
            mask: !0
        });
    },
    bindSupport: function(e) {
        var t = this, a = e.currentTarget.dataset.id, i = n.getStorageSync("globalData"), d = Date.parse(new Date()) / 1e3, s = o.hexMD5(t.appId + r.config.AppKey + i.memberid + a + d);
        n.request({
            url: r.config.Domain + "/Tides/CommentSupport",
            data: {
                uid: i.memberid,
                id: a,
                timestamp: d,
                sign: s
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(e) {
                var i = e.data.data, d = t.commentList.find(function(e) {
                    return e.ID == a;
                });
                d && (d.IsSupport = !d.IsSupport, d.Support = i, t.setData({
                    commentList: t.commentList
                }));
            }
        });
    },
    bindInfoSupport: function(e) {
        var t = this, a = n.getStorageSync("globalData"), i = Date.parse(new Date()) / 1e3, d = o.hexMD5(t.appId + r.config.AppKey + a.memberid + i);
        n.request({
            url: r.config.Domain + "/Tides/InfoSupport",
            data: {
                uid: a.memberid,
                timestamp: i,
                sign: d
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(e) {
                var a = e.data.data;
                t.isSupport = !t.isSupport, t.setData({
                    support: a,
                    isSupport: t.isSupport
                });
            }
        });
    },
    binComment: function(e) {
        var t = this;
        if (1 != t.isUpdata) if (e.detail.value.textarea.length < 3) n.showToast({
            title: "内容过短！",
            icon: "none",
            duration: 1e3,
            mask: !0
        }); else {
            t.isUpdata = !0;
            var a = n.getStorageSync("globalData"), i = Date.parse(new Date()) / 1e3, d = o.hexMD5(t.appId + r.config.AppKey + a.memberid + i), s = encodeURI(e.detail.value.textarea), c = t.data.pedarID;
            n.request({
                url: r.config.Domain + "/Tides/AddComment",
                data: {
                    Longitude: t.location.longitude,
                    Latitude: t.location.latitude,
                    AddrStr: "",
                    SubID: t.AddrStr_ID,
                    SubTitle: t.tide.Addrstr.AddrStr_Province + "-" + t.tide.Addrstr.AddrStr_City + "-" + t.tide.Addrstr.AddrStr_Name,
                    Content: s,
                    PedarID: c,
                    MemberID: a.memberid,
                    timestamp: i,
                    sign: d
                },
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function(e) {
                    var a = e.data;
                    0 == e.data.ret ? (n.showToast({
                        title: e.data.msg,
                        icon: "succes",
                        duration: 2e3,
                        mask: !0
                    }), t.page = 1, t.commentList = [], t.get_comment(function(e) {
                        t.setData({
                            pedarID: 0,
                            pedarName: "",
                            commentList: t.commentList,
                            commentText: ""
                        });
                    })) : n.showToast({
                        title: a.msg,
                        icon: "none",
                        duration: 2e3,
                        mask: !0
                    }), t.isUpdata = !1;
                }
            });
        }
    },
    bindSelectPedarID: function(e) {
        var t = e.currentTarget.dataset.id, a = e.currentTarget.dataset.name;
        this.setData({
            pedarID: t,
            pedarName: a
        });
    },
    bindEditTide: function(e) {
        n.navigateTo({
            url: "../tide/edit?type=edit&id=" + this.AddrStr_ID
        });
    },
    bindOpenWeather: function(e) {
        var t = this, a = "";
        1 == t.isDiy && (a = "&title=" + t.tide.Addrstr.AddrStr_City + t.tide.Addrstr.AddrStr_Name), 
        1 == t.isPosit && (a = "&title=" + t.tide.Addrstr.AddrStr_City + "区域"), n.navigateTo({
            url: "../wind/index?id=" + t.tide.Addrstr.AddrStr_ID + a
        });
    },
    bindOpenWeather2: function(e) {
        this.bindOpenWeather(e);
    },
    doubleClick: function(e) {
        var t = this, a = e.currentTarget.dataset.value, i = e.timeStamp, d = e.currentTarget.dataset.time;
        i - d > 0 && i - d < 300 && (-1 == t.data.commentText.indexOf(t.tide.Addrstr.AddrStr_Name) && (t.data.commentText = t.tide.Addrstr.AddrStr_Name + "[" + t.tide.Date.split("T")[0] + "]\n" + t.data.commentText), 
        t.setData({
            commentText: t.data.commentText + a + "\n"
        })), t.setData({
            lastTapTime: i
        });
    },
    bindOpenTide: function(e) {
        var t = this;
        console.log(e), n.showModal({
            title: "选择潮汐",
            content: "选择：" + e.currentTarget.dataset.value + "潮汐？",
            success: function(a) {
                a.confirm && (t.AddrStr_ID = e.currentTarget.dataset.id, t.getDate());
            }
        });
    },
    bindDelPedar: function(e) {
        this.setData({
            pedarID: 0,
            pedarName: ""
        });
    },
    bindZhuanHuan: function(e) {
        var t = this, a = "切换赶海模式，提供简洁数据。";
        2 == t.modeType && (a = "切换钓鱼模式，提供全面的潮汐天气数据。"), 2 == t.modeType ? t.modeType = 1 : t.modeType = 2, 
        t.setData({
            modeType: t.modeType
        }), n.setStorageSync("modeType", t.modeType), t.getDate(), n.showToast({
            title: a,
            icon: "none",
            duration: 3e3,
            mask: !0
        });
    },
    bindOpenUrl: function(e) {
        var t = "../web/index?url=" + encodeURI(e.currentTarget.dataset.url);
        n.navigateTo({
            url: t
        });
    },
    bindAuxiliary: function(e) {
        var t = this;
        t.setData({
            isAuxiliary: !t.data.isAuxiliary
        }), n.setStorageSync("isAuxiliary", t.data.isAuxiliary);
    },
    bindAD: function(e) {
        var t = this;
        n.showToast({
            title: "观看视频广告即获VIP奖励！",
            icon: "none",
            duration: 1e4,
            mask: !0
        }), wx.createRewardedVideoAd && ((s = wx.createRewardedVideoAd({
            adUnitId: "adunit-9072cbec47bf47b4"
        })).onLoad(function() {
            n.hideToast();
        }), s.onError(function(e) {}), s.onClose(function(e) {
            if (console.log(e), e && e.isEnded || void 0 === e) {
                var a = n.getStorageSync("globalData"), i = Date.parse(new Date()) / 1e3, d = o.hexMD5(t.appId + r.config.AppKey + a.secret + i);
                n.request({
                    url: r.config.Domain + "/Member/ADReward",
                    data: {
                        uid: a.memberid,
                        timestamp: i,
                        sign: d
                    },
                    method: "POST",
                    header: {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    success: function(e) {
                        a.vip = e.data.data.grade, wx.setStorageSync("globalData", a), (!a.vip || a.vip > 0) && t.setData({
                            isAD: !1
                        }), setTimeout(function() {
                            n.showToast({
                                title: "恭喜获得" + e.data.data.day + "天VIP权限！",
                                icon: "none",
                                duration: 5e3,
                                mask: !0
                            });
                        }, 1e3);
                    }
                });
            } else setTimeout(function() {
                n.showToast({
                    title: "中途退出无法获得VIP奖励哦~~",
                    icon: "none",
                    duration: 5e3,
                    mask: !0
                });
            }, 1e3);
        })), s && s.show().catch(function() {
            s.load().then(function() {
                return s.show();
            }).catch(function(e) {
                console.log("激励视频 广告显示失败");
            });
        });
    },
    bindDataType1: function() {
        this.setData({
            dataType: 1
        }), this.getDate(), n.showToast({
            title: "切换到 潮汐 曲线图",
            icon: "none",
            duration: 500,
            mask: !0
        });
    },
    bindDataType2: function() {
        this.setData({
            dataType: 2
        }), this.getDate(), n.showToast({
            title: "切换到 风浪 曲线图",
            icon: "none",
            duration: 500,
            mask: !0
        });
    },
    bindDataType3: function() {
        this.setData({
            dataType: 3
        }), this.getDate(), n.showToast({
            title: "切换到 温度 曲线图",
            icon: "none",
            duration: 500,
            mask: !0
        });
    },
    bindAddrstr: function() {
        n.openLocation({
            latitude: this.tide.Addrstr.Position_Latitude,
            longitude: this.tide.Addrstr.Position_Longitude,
            scale: 14,
            title: this.tide.TideName,
            name: this.tide.TideName,
            address: this.tide.Addrstr.AddrStr_Province + this.tide.Addrstr.AddrStr_City + this.tide.Addrstr.AddrStr_Name
        });
    }
});