/*!
 * Date#format()
 *  Quick reference at http://php.net/date
 *
 * http://github.com/jacwright/date.format
 *
 * MIT License
 */
(function(Date) {

/**
 * Simulates PHP's date function
 *
 * @param {string} format - The format of the outputted date string.
 * @param [string] lang - Optional language identifier. When omitted, `Date.format.lang` will be used.
 *
 * @return {string} Returns a formatted date string.
 *
 * Notes:
 *  - DO NOT rely on the "e" option, it does not work the same way across browsers.
 *  - Option "T" may give different timezone abbreviation from PHP.
 *
 *  Day
 *  d   Day of the month, 2 digits with leading zeros                   01 to 31
 *  D   A textual representation of a day, three letters                Mon through Sun
 *  j   Day of the month without leading zeros                          1 to 31
 *  l   A full textual representation of the day of the week            Sunday through Saturday
 *  N   ISO-8601 numeric representation of the day of the week          1 (for Monday) through 7 (for Sunday)
 *  S   English ordinal suffix for the day of the month, 2 characters   st, nd, rd or th
 *  w   Numeric representation of the day of the week                   0 (for Sunday) through 6 (for Saturday)
 *  z   The day of the year (starting from 0)                           0 through 365
 *
 *  Week
 *  W   ISO-8601 week number of year, weeks starting on Monday          Example: 42 (the 42nd week in the year)
 *
 *  Month
 *  F   A full textual representation of a month                        January through December
 *  m   Numeric representation of a month, with leading zeros           01 through 12
 *  M   A short textual representation of a month, three letters        Jan through Dec
 *  n   Numeric representation of a month, without leading zeros        1 through 12
 *  t   Number of days in the given month                               28 through 31
 *
 *  Year
 *  L   Whether it's a leap year                                        1 if it is a leap year, 0 otherwise
 *  o   ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.
 *  Y   A full numeric representation of a year, 4 digits               Examples: 1999 or 2003
 *  y   A two digit representation of a year                            Examples: 99 or 03
 *
 *  Time
 *  a   Lowercase Ante meridiem and Post meridiem                       am or pm
 *  A   Uppercase Ante meridiem and Post meridiem                       AM or PM
 *  B   Swatch Internet time                                            000 through 999
 *  g   12-hour format of an hour without leading zeros                 1 through 12
 *  G   24-hour format of an hour without leading zeros                 0 through 23
 *  h   12-hour format of an hour with leading zeros                    01 through 12
 *  H   24-hour format of an hour with leading zeros                    00 through 23
 *  i   Minutes with leading zeros                                      00 to 59
 *  s   Seconds, with leading zeros                                     00 through 59
 *  u   Microseconds                                                    Example: 654321
 *  v   Milliseconds                                                    Example: 654
 *
 *  Timezone
 *  e   Timezone identifier                                             Examples: UTC, GMT
 *  I   Whether or not the date is in daylight saving time              1 if Daylight Saving Time, 0 otherwise
 *  O   Difference to Greenwich time (GMT) in hours                     Example: +0200
 *  P   Difference to Greenwich time (GMT) with colon between hours and minutes; Example: +02:00
 *  T   Timezone abbreviation                                           Examples: EST, MDT
 *  Z   Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.; -43200 through 50400
 *
 *  Full Date/Time
 *  c   ISO 8601 date                                                   2004-02-12T15:19:21+00:00
 *  r   RFC 2822 formatted date                                         Thu, 21 Dec 2000 16:01:07 +0200
 *  U   Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)      1487778422
 *
 *  Non-PHP-standard formatters
 *  V   Week number without leading zero
 *  k   Suffix (st nd rd th) for week numbers
 *  Q   Quarter of the year
 *  q   Suffix (st nd rd th) for quarter of the year
 *
 */
Date.prototype.format = function(format, lang) {
    var date = this,
        formatters = Date.format.formatters;

    lang = lang||Date.format.lang;

    return format.replace(/(\\?)(.)/g, function(_, esc, chr) {
        return (esc === '' && formatters[chr]) ? formatters[chr].call(date, lang) : chr;
    });
};

Date.format = {
    /**
     * Escapes characters in format strings
     *
     * Usage:
     *  myDate.format('W ' + Date.format.escape('of') + ' Y');
     *
     * @param {string} text - Text to escape.
     *
     * @return {string} Returns the escaped text.
     */
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
        U: function() { return this.getTime() / 1000; },

        // *** non-standard formatters below ***

        // Week number without leading zero
        V: function() { var target = new Date(this.valueOf()), dayNr = (this.getDay() + 6) % 7; target.setDate(target.getDate() - dayNr + 3); var firstThursday = target.valueOf(); target.setMonth(0, 1); if (target.getDay() !== 4) { target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7); } return 1 + Math.ceil((firstThursday - target) / 604800000); },

        // Suffix (st nd rd th) for week numbers
        k: function() { var ords = Date.format.translation[arguments[0]].ordinals, wk = Date.format.formatters.V.apply(this, arguments); return (wk % 10 === 1 && wk !== 11 ? ords[0] : (wk % 10 === 2 && wk !== 12 ? ords[1] : (wk % 10 === 3 && wk !== 13 ? ords[2] : ords[3]))); },

        // Quarter of the year
        Q: function() { return Math.floor(this.getMonth() / 3) + 1; },

        // Suffix (st nd rd th) for quarter of the year
        q: function() { var ords = Date.format.translation[arguments[0]].ordinals, qu = Date.format.formatters.Q.apply(this, arguments); return (qu % 10 === 1 && qu !== 11 ? ords[0] : (qu % 10 === 2 && qu !== 12 ? ords[1] : (qu % 10 === 3 && qu !== 13 ? ords[2] : ords[3]))); }
    }
};

})(Date);
