var e, t = require("../../@babel/runtime/helpers/interopRequireWildcard")(require("../../ec-canvas/echarts")), a = new (require("../../utils/calendar-converter.js").CalendarConverter)(), r = require("../../utils/config.js"), o = r.config.sys, n = require("../../utils/md5.js");

getApp();

Page({
    WeatherDay: {},
    WeatherHour: {},
    option: {},
    chart: {},
    windowHeight: 0,
    day15Height: 0,
    appId: o.getAccountInfoSync().miniProgram.appId,
    change: !1,
    current_date: new Date(),
    initChart: function(e, a, r) {
        var o = this;
        return o.chart = t.init(e, null, {
            width: a,
            height: r
        }), e.setChart(o.chart), o.chart.on("rendered", function() {}), o.chart;
    },
    get_WeatherDay: function(e, a) {
        var i = this, l = o.getStorageSync("globalData"), c = Date.parse(new Date()) / 1e3, d = n.hexMD5(i.appId + r.config.AppKey + l.secret + l.memberid + e + "day" + c);
        o.request({
            url: r.config.Domain + "/Tides/GetWeather_v2",
            data: {
                id: e,
                uid: l.memberid,
                type: "day",
                timestamp: c,
                sign: d
            },
            method: "GET",
            header: {
                "content-type": "application/json"
            },
            success: function(e) {
                if (!e.data || 1 == e.data.ret) return o.showToast({
                    title: "数据加载失败！",
                    icon: "none",
                    duration: 1e3,
                    mask: !0
                }), void a({});
                i.WeatherDay = e.data.data;
                var r = i.WeatherDay.list, n = [], l = [], c = [], d = [], s = [];
                for (var u in r) {
                    var h = r[u].key.split("-");
                    n.push(h[1] + "-" + h[2]), l.push(r[u].wind_max.wind_scale), c.push(r[u].wind_max.wave_height_avg), 
                    d.push(r[u].temperature_min), s.push(r[u].temperature_max);
                }
                i.option = {
                    grid: [ {
                        top: 63,
                        left: 25,
                        right: 10,
                        bottom: 30
                    } ],
                    backgroundColor: "#122b3a",
                    color: [ "#1f5b59", "#fa2424" ],
                    title: {
                        text: "未来" + i.WeatherDay.list.length + "天,风浪一览",
                        subtext: "仅供参考",
                        textStyle: {
                            color: "#fff",
                            fontSize: 15
                        }
                    },
                    tooltip: {
                        trigger: "axis",
                        position: [ 5, 21 ],
                        formatter: function(e) {
                            var t = e[0].dataIndex, a = r[t].key + "，" + r[t].skycon + "，";
                            return a += r[t].wind_direction_txt + "风:" + r[t].wind_min.wind_scale + "~" + r[t].wind_max.wind_scale + "级；", 
                            a += r[t].wind_max.water_surface_image + ":" + r[t].wind_min.wave_height + "~" + r[t].wind_max.wave_height + "米；", 
                            a += r[t].temperature_min + "~" + r[t].temperature_max + "°C；";
                        }
                    },
                    legend: {
                        data: [ "风", "浪", "温度" ],
                        selected: {
                            "温度": !1
                        },
                        right: 10,
                        textStyle: {
                            color: "#fff",
                            fontSize: 12
                        }
                    },
                    calculable: !0,
                    xAxis: [ {
                        type: "category",
                        data: n,
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
                        name: "风",
                        barWidth: 10,
                        type: "line",
                        data: l,
                        smooth: !0,
                        areaStyle: {
                            normal: {
                                color: new t.graphic.LinearGradient(0, 0, 0, 1, [ {
                                    offset: 0,
                                    color: "#1f5b59"
                                }, {
                                    offset: 1,
                                    color: "#143340"
                                } ])
                            }
                        },
                        symbol: "none"
                    }, {
                        name: "浪",
                        type: "line",
                        data: c,
                        smooth: !0,
                        areaStyle: {
                            normal: {
                                barBorderRadius: 3,
                                color: new t.graphic.LinearGradient(0, 0, 0, 1, [ {
                                    offset: 0,
                                    color: "#fa2424"
                                }, {
                                    offset: 1,
                                    color: "#143340"
                                } ])
                            }
                        },
                        symbol: "none"
                    }, {
                        name: "温度",
                        type: "bar",
                        barGap: "-100%",
                        label: {
                            show: !0,
                            position: "top",
                            textStyle: {
                                color: "#fff",
                                fontSize: 8
                            },
                            formatter: function(e) {
                                return e.value + "°C";
                            }
                        },
                        itemStyle: {
                            color: new t.graphic.LinearGradient(0, 0, 0, 1, [ {
                                offset: 0,
                                color: "rgba(20,200,212,0.5)"
                            }, {
                                offset: 1,
                                color: "rgba(20,200,212,0)"
                            } ])
                        },
                        z: -12,
                        data: s
                    }, {
                        name: "温度",
                        type: "bar",
                        label: {
                            show: !0,
                            position: "top",
                            textStyle: {
                                color: "#fff",
                                fontSize: 8
                            },
                            formatter: function(e) {
                                return e.value + "°C";
                            }
                        },
                        itemStyle: {
                            color: new t.graphic.LinearGradient(0, 0, 0, 1, [ {
                                offset: 0,
                                color: "#14c8d4"
                            }, {
                                offset: 1,
                                color: "#43eec6"
                            } ])
                        },
                        data: d
                    } ]
                }, a(e.data.data);
            }
        });
    },
    get_WeatherHour: function(e, t) {
        var a = this, i = o.getStorageSync("globalData"), l = Date.parse(new Date()) / 1e3, c = n.hexMD5(a.appId + r.config.AppKey + i.secret + i.memberid + e + "hour" + l);
        o.request({
            url: r.config.Domain + "/Tides/GetWeather_v2",
            data: {
                id: e,
                uid: i.memberid,
                type: "hour",
                timestamp: l,
                sign: c
            },
            method: "GET",
            header: {
                "content-type": "application/json"
            },
            success: function(e) {
                if (!e.data || 1 == e.data.ret) return o.showToast({
                    title: "数据加载失败！",
                    icon: "none",
                    duration: 1e3,
                    mask: !0
                }), void t({});
                for (var r in a.WeatherHour = e.data.data, a.WeatherHour.group) for (var n in a.WeatherHour.group[r].list) switch (a.WeatherHour.group[r].list[n].wind.wind_scale) {
                  case 0:
                  case 1:
                    a.WeatherHour.group[r].list[n].wind.wind_color = "#00FF00";
                    break;

                  case 2:
                    a.WeatherHour.group[r].list[n].wind.wind_color = "#00DD00";
                    break;

                  case 3:
                    a.WeatherHour.group[r].list[n].wind.wind_color = "#FFFF33";
                    break;

                  case 4:
                    a.WeatherHour.group[r].list[n].wind.wind_color = "#FFCC22";
                    break;

                  case 5:
                    a.WeatherHour.group[r].list[n].wind.wind_color = "#FFAA33";
                    break;

                  case 6:
                    a.WeatherHour.group[r].list[n].wind.wind_color = "#FF8800";
                    break;

                  case 7:
                    a.WeatherHour.group[r].list[n].wind.wind_color = "#FF7744";
                    break;

                  case 8:
                    a.WeatherHour.group[r].list[n].wind.wind_color = "#FF5511";
                    break;

                  case 9:
                    a.WeatherHour.group[r].list[n].wind.wind_color = "#FF3333";
                    break;

                  default:
                    a.WeatherHour.group[r].list[n].wind.wind_color = "#FF0000";
                }
                t(e.data.data);
            }
        });
    },
    data: {
        id: 903,
        WeatherDay: {},
        WeatherHour: {},
        ec: {},
        height: 1440,
        hourStyle: "",
        calendar: "display: none;",
        modeWindType: 1,
        dateList: [],
        current_to_date: "",
        newDateScrollInfo: {
            scrollLeft: 0,
            itemWidth: 0,
            width: 0,
            tag: 0
        }
    },
    onLoad: function(e) {
        var t = this;
        e.id && (t.data.id = e.id), t.setData({
            ec: {
                onInit: t.initChart
            },
            modeWindType: o.getStorageSync("modeWindType") ? o.getStorageSync("modeWindType") : 1
        }), o.getSystemInfo({
            success: function(e) {
                t.windowHeight = e.windowHeight;
                var a = o.createSelectorQuery();
                a.select("#day15").boundingClientRect(), a.exec(function(e) {
                    t.day15Height = e[0].height;
                });
            }
        });
    },
    onReady: function() {
        var e = this;
        e.get_WeatherDay(e.data.id, function(t) {
            e.setData({
                WeatherDay: t
            }), e.getScrollTop(0), e.getDateList(), e.get_WeatherHour(e.data.id, function(t) {
                e.setData({
                    WeatherHour: t
                }), e.chart.setOption(e.option);
                var a = wx.createSelectorQuery();
                a.select(".windlist").boundingClientRect(), a.exec(function(t) {
                    e.setData({
                        height: t[0].height
                    });
                });
            });
        });
    },
    onPageScroll: function(e) {},
    select: function(e) {
        var t = new Date(), a = t.getMonth() + 1 < 10 ? "0" + (t.getMonth() + 1) : t.getMonth() + 1, r = new Date(t.getFullYear() + "-" + a + "-" + t.getDate()), o = new Date(e.detail) - r, n = (o = Math.abs(o), 
        Math.floor(o / 864e5));
        this.setData({
            currentTab: n
        });
    },
    bindCalendarClost: function(e) {
        this.setData({
            calendar: "display: none;"
        });
    },
    bindrili: function() {
        var e = this;
        this.setData({
            calendar: ""
        }), 0 == e.change && (e.selectComponent("#Calendar").toggleType(), e.change = !0);
    },
    bindWindChange: function(e) {
        var t = this.WeatherHour.group[e.detail.current].list[0].datetime.split("T")[0];
        this.current_date = new Date(t), this.getDateList();
    },
    getDateList: function() {
        for (var e = this, t = (o.getStorageSync("globalData"), []), r = e.data.WeatherDay.list.length, n = 0; n < r; n++) {
            var i = new Date(), l = i.getMonth() + 1, c = i.getDate(), d = i.getFullYear() + "-" + (Number(l) < 10 ? "0" + l : l) + "-" + (Number(c) < 10 ? "0" + c : c);
            i.setDate(i.getDate() + n);
            var s = a.GetWeekDate(i.getDay(), 2);
            l = i.getMonth() + 1, c = i.getDate();
            var u = i.getFullYear() + "-" + (Number(l) < 10 ? "0" + l : l) + "-" + (Number(c) < 10 ? "0" + c : c), h = a.solar2lunar(new Date(u)).lunarDay, g = a.GetTideType(h), f = a.GetCSS(g);
            l = e.current_date.getMonth() + 1, c = e.current_date.getDate();
            var w = u == e.current_date.getFullYear() + "-" + (Number(l) < 10 ? "0" + l : l) + "-" + (Number(c) < 10 ? "0" + c : c) ? "select" : "", p = u == d ? "today" : "";
            t.push({
                id: u,
                weeks: s,
                date: i.getDate(),
                earthly: h,
                tide: g,
                css: f,
                today: p,
                select: w,
                tag: n
            });
        }
        if (e.setData({
            dateList: t
        }), "" == e.data.current_to_date) {
            var m = new Date();
            l = m.getMonth() + 1, c = m.getDate();
            e.setData({
                current_to_date: m.getFullYear() + "-" + (Number(l) < 10 ? "0" + l : l) + "-" + (Number(c) < 10 ? "0" + c : c)
            });
        } else o.createSelectorQuery().selectAll(".newdate").boundingClientRect(function(t) {
            console.log("newdate", t[0]);
            var a = t[0];
            o.createSelectorQuery().selectAll(".newdate .item .select").boundingClientRect(function(t) {
                console.log("select", t[0]);
                var r = t[0], o = r.dataset.date;
                if (r.left < 0) {
                    var n = Math.round((e.data.newDateScrollInfo.scrollLeft + r.left) / e.data.newDateScrollInfo.itemWidth > 5 ? 5 : (e.data.newDateScrollInfo.scrollLeft + r.left) / e.data.newDateScrollInfo.itemWidth);
                    (c = new Date(o)).setDate(c.getDate() - n);
                    var i = c.getMonth() + 1, l = c.getDate();
                    e.setData({
                        current_to_date: c.getFullYear() + "-" + (Number(i) < 10 ? "0" + i : i) + "-" + (Number(l) < 10 ? "0" + l : l)
                    });
                }
                if (r.right >= a.width) {
                    var c;
                    n = Math.round((e.data.newDateScrollInfo.width - r.right) / e.data.newDateScrollInfo.itemWidth > 2 ? 2 : (e.data.newDateScrollInfo.width - r.right) / e.data.newDateScrollInfo.itemWidth);
                    (c = new Date(o)).setDate(c.getDate() - n);
                    i = c.getMonth() + 1, l = c.getDate();
                    e.setData({
                        current_to_date: c.getFullYear() + "-" + (Number(i) < 10 ? "0" + i : i) + "-" + (Number(l) < 10 ? "0" + l : l)
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
            o.createSelectorQuery().selectAll(".newdate .item").boundingClientRect(function(e) {
                var r = o.getStorageSync("globalData"), n = 5 + (r.tideDays ? r.tideDays : 15), i = e[0].width;
                a.setData({
                    newDateScrollInfo: {
                        scrollLeft: t,
                        itemWidth: i,
                        width: i * n
                    }
                }), console.log("滚动", a.data.newDateScrollInfo);
            }).exec();
        }, 500);
    },
    bindSelectDateList: function(e) {
        var t = e.currentTarget.dataset.tag;
        this.current_date = new Date(e.currentTarget.dataset.date), this.setData({
            currentTab: t
        }), this.getDateList();
    }
});