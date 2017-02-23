(function(Date) {

Date.prototype.format = function(format, lang) {
    var date = this,
        formatters = Date.format.formatters;

    lang = lang||Date.format.lang;

    return format.replace(/(\\?)(.)/g, function(_, esc, chr) {
        return (esc === '' && formatters[chr]) ? formatters[chr].call(date, lang) : chr;
    });
};

Date.format = {
    escape: function(text) {
        if (!Date.format.escapeRegex) {
            var keys = '',
                formatters = Date.format.formatters;
            for (var k in formatters) {
                if (formatters.hasOwnProperty(k)) {
                    keys += k;
                }
            }
            Date.format.escapeRegex = new RegExp('([' + keys + '\\\\])', 'g');
        }
        return text.replace(Date.format.escapeRegex, '\\$1');
    },
    lang: 'en',
    translation: {
        en: {
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            ordinals: ['st', 'nd', 'rd', 'th'],
            am: 'am',
            pm: 'pm'
        }
    },
    formatters: {
        // Day
        d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
        D: function() { return Date.format.translation[arguments[0]].dayNamesShort[this.getDay()]; },
        j: function() { return this.getDate(); },
        l: function() { return Date.format.translation[arguments[0]].dayNames[this.getDay()]; },
        N: function() { return (this.getDay() === 0 ? 7 : this.getDay()); },
        S: function() { var ords = Date.format.translation[arguments[0]].ordinals, date = this.getDate(); return (date % 10 === 1 && date !== 11 ? ords[0] : (date % 10 === 2 && date !== 12 ? ords[1] : (date % 10 === 3 && date !== 13 ? ords[2] : ords[3]))); },
        w: function() { return this.getDay(); },
        z: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((this - d) / 86400000); },

        // Week
        W: function() { var target = new Date(this.valueOf()), dayNr = (this.getDay() + 6) % 7; target.setDate(target.getDate() - dayNr + 3); var firstThursday = target.valueOf(); target.setMonth(0, 1); if (target.getDay() !== 4) { target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7); } var week = 1 + Math.ceil((firstThursday - target) / 604800000); return (week < 10 ? '0' + week : week); },

        // Month
        F: function() { return Date.format.translation[arguments[0]].monthNames[this.getMonth()]; },
        m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
        M: function() { return Date.format.translation[arguments[0]].monthNamesShort[this.getMonth()]; },
        n: function() { return this.getMonth() + 1; },
        t: function() { var year = this.getFullYear(), nextMonth = this.getMonth() + 1; if (nextMonth === 12) { year = year++; nextMonth = 0; } return new Date(year, nextMonth, 0).getDate(); },

        // Year
        L: function() { var year = this.getFullYear(); return (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)); },
        o: function() { var d = new Date(this.valueOf()); d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear(); },
        Y: function() { return this.getFullYear(); },
        y: function() { return ('' + this.getFullYear()).substr(2); },

        // Time
        a: function() { return this.getHours() < 12 ? Date.format.translation[arguments[0]].am : Date.format.translation[arguments[0]].pm; },
        A: function() { return this.getHours() < 12 ? Date.format.translation[arguments[0]].am.toUpperCase() : Date.format.translation[arguments[0]].pm.toUpperCase(); },
        B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); },
        g: function() { return this.getHours() % 12 || 12; },
        G: function() { return this.getHours(); },
        h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
        H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
        i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
        s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
        u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m + '000'; },
        v: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ? '0' : '')) + m; },

        // Timezone
        e: function() { var matches = /\((.*)\)/.exec(this.toString()); return (matches && matches[1])||null; },
        I: function() { var DST = null; for (var i = 0; i < 12; i++) { var d = new Date(this.getFullYear(), i, 1), offset = d.getTimezoneOffset(); if (DST === null) DST = offset; else if (offset < DST) { DST = offset; break; } else if (offset > DST) break; } return (this.getTimezoneOffset() === DST) | 0; },
        O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + Math.floor(Math.abs(this.getTimezoneOffset() / 60)) + (Math.abs(this.getTimezoneOffset() % 60) == 0 ? '00' : ((Math.abs(this.getTimezoneOffset() % 60) < 10 ? '0' : '')) + (Math.abs(this.getTimezoneOffset() % 60))); },
        P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + Math.floor(Math.abs(this.getTimezoneOffset() / 60)) + ':' + (Math.abs(this.getTimezoneOffset() % 60) == 0 ? '00' : ((Math.abs(this.getTimezoneOffset() % 60) < 10 ? '0' : '')) + (Math.abs(this.getTimezoneOffset() % 60))); },
        T: function() { return this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); },
        Z: function() { return -this.getTimezoneOffset() * 60; },

        // Full Date/Time
        c: function() { return this.format('Y-m-d\\TH:i:sP'); },
        r: function() { return this.toString(); },
        U: function() { return this.getTime() / 1000; }
    }
};

})(Date);
