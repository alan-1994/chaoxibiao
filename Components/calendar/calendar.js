var t = new (require("../../utils/calendar-converter.js").CalendarConverter)(), e = require("../../utils/config.js").config.sys;

require("../../utils/md5.js"), getApp();

Component({
    properties: {
        defaultValue: {
            type: String,
            value: ""
        },
        weekText: {
            type: Array,
            value: [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ]
        },
        lastMonth: {
            type: String,
            value: "◀"
        },
        nextMonth: {
            type: String,
            value: "▶"
        },
        start: {
            type: Number,
            value: "-7"
        },
        end: {
            type: Number,
            value: "0"
        }
    },
    data: {
        thisMonthDays: [],
        empytGridsBefore: [],
        empytGridsAfter: [],
        title: "",
        format: "",
        year: 0,
        month: 0,
        date: 0,
        toggleType: "large",
        scrollLeft: 0,
        YEAR: 0,
        MONTH: 0,
        DATE: 0
    },
    onLoad: function() {},
    ready: function() {
        var t = e.getStorageSync("globalData");
        0 == this.data.end && this.setData({
            end: t.tideDays ? t.tideDays - 1 : 14
        }), this.today();
    },
    methods: {
        toggleType: function() {
            console.log(this.data.toggleType), this.setData({
                toggleType: "mini" == this.data.toggleType ? "large" : "mini"
            }), this.display(this.data.year, this.data.month, this.data.date);
        },
        scrollCalendar: function(t, e, a) {
            var s = this, i = 0, n = 125 / 750 * wx.getSystemInfoSync().windowWidth;
            wx.getSystemInfo({
                success: function(r) {
                    0 == a ? (i = 0, t == s.data.YEAR && e == s.data.MONTH && (i = 65 * s.data.DATE - r.windowWidth / 2 - 22.5)) : i = a * n - r.windowWidth / 2 - 22.5, 
                    s.setData({
                        scrollLeft: i
                    });
                }
            });
        },
        display: function(t, e, a) {
            this.setData({
                year: t,
                month: e,
                date: a,
                title: t + "年" + this.zero(e) + "月"
            }), this.createDays(t, e), this.createEmptyGrids(t, e), this.scrollCalendar(t, e, a);
        },
        today: function() {
            var t = this.data.defaultValue ? new Date(this.data.defaultValue) : new Date(), e = t.getFullYear(), a = t.getMonth() + 1, s = t.getDate(), i = e + "-" + this.zero(a) + "-" + this.zero(s);
            this.setData({
                format: i,
                select: i,
                year: e,
                month: a,
                date: s,
                YEAR: e,
                MONTH: a,
                DATE: s
            }), this.display(e, a, s), this.triggerEvent("select", i);
        },
        select: function(t) {
            var e = t.currentTarget.dataset.date, a = this.data.year + "-" + this.zero(this.data.month) + "-" + this.zero(e), s = new Date(), i = (new Date(this.data.year + "-" + (this.data.month < 10 ? "0" + this.data.month : this.data.month) + "-" + (e < 10 ? "0" + e : e)) - s) / 864e5;
            i < this.data.start || i > this.data.end ? wx.showToast({
                title: "超出日期可选范围！",
                icon: "none",
                duration: 1e3,
                mask: !0
            }) : (this.setData({
                title: this.data.year + "年" + this.zero(this.data.month) + "月" + this.zero(e) + "日",
                select: a,
                year: this.data.year,
                month: this.data.month,
                date: e
            }), this.triggerEvent("select", a), this.scrollCalendar(this.data.year, this.data.month, e));
        },
        lastMonth: function() {
            var t = 1 == this.data.month ? 12 : this.data.month - 1, e = 1 == this.data.month ? this.data.year - 1 : this.data.year;
            this.display(e, t, 0);
        },
        nextMonth: function() {
            var t = 12 == this.data.month ? 1 : this.data.month + 1, e = 12 == this.data.month ? this.data.year + 1 : this.data.year;
            this.display(e, t, 0);
        },
        getThisMonthDays: function(t, e) {
            return new Date(t, e, 0).getDate();
        },
        createDays: function(t, e) {
            for (var a = [], s = this.getThisMonthDays(t, e), i = 1; i <= s; i++) {
                var n = this.GetLunarCalendar(t + "-" + (Number(e) < 10 ? "0" + e : e) + "-" + (Number(i) < 10 ? "0" + i : i)), r = this.GetTideType(n), h = this.GetCSS(r), o = new Date(), d = "on", l = (new Date(t + "-" + (e < 10 ? "0" + e : e) + "-" + (i < 10 ? "0" + i : i)) - o) / 864e5;
                (l < this.data.start || l > this.data.end) && (d = ""), a.push({
                    date: i,
                    dateFormat: this.zero(i),
                    monthFormat: this.zero(e),
                    week: this.data.weekText[new Date(Date.UTC(t, e - 1, i)).getDay()],
                    earthly: n,
                    tide: r,
                    type: h,
                    on: d
                });
            }
            this.setData({
                thisMonthDays: a
            });
        },
        createEmptyGrids: function(t, e) {
            for (var a = new Date(Date.UTC(t, e - 1, 1)).getDay(), s = [], i = [], n = 0 == a ? 7 : a, r = this.getThisMonthDays(t, e), h = e - 1 < 0 ? this.getThisMonthDays(t - 1, 12) : this.getThisMonthDays(t, e - 1), o = 1; o <= n; o++) s.push(h - (n - o));
            for (var d = 42 - r - n - 7 >= 0 ? 42 - r - n - 7 : 42 - r - n, l = 1; l <= d; l++) i.push(l);
            this.setData({
                empytGridsAfter: i,
                empytGridsBefore: s
            });
        },
        zero: function(t) {
            return t >= 10 ? t : "0" + t;
        },
        GetTideType: function(e) {
            return t.GetTideType(e);
        },
        GetLunarCalendar: function(e) {
            return t.solar2lunar(new Date(e)).lunarDay;
        },
        GetCSS: function(e) {
            return t.GetCSS(e);
        }
    }
});