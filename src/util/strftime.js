var monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
];
var monthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
    "Nov", "Dec"
];
var dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];
var dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var suffixes = {
    1: 'st',
    2: 'nd',
    3: 'rd',
    'default': 'th'
};

// prototype extensions
var _date = {
    daysInMonth: function(d) {
        var feb = _date.isLeapYear(d) ? 29 : 28;
        return [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    },

    getTimezone: function(d) {
        return d.toString().replace(
            /^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1"
        ).replace(
            /^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3"
        );
    },

    getGMTOffset: function(d) {
        return (d.getTimezoneOffset() > 0 ? "-" : "+") +
            _number.pad(Math.floor(d.getTimezoneOffset() / 60), 2) +
            _number.pad(d.getTimezoneOffset() % 60, 2);
    },

    getDayOfYear: function(d) {
        var num = 0;
        for (var i = 0; i < d.getMonth(); ++i) {
            num += _date.daysInMonth(d)[i];
        }
        return num + d.getDate();
    },

    // Startday is an integer of which day to start the week measuring from
    // TODO: that comment was retarted. fix it.
    getWeekOfYear: function(d, startDay) {
        // Skip to startDay of this week
        var now = this.getDayOfYear(d) + (startDay - d.getDay());
        // Find the first startDay of the year
        var jan1 = new Date(d.getFullYear(), 0, 1);
        var then = (7 - jan1.getDay() + startDay);
        return _number.pad(Math.floor((now - then) / 7) + 1, 2);
    },

    isLeapYear: function(d) {
        var year = d.getFullYear();
        return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    },

    getFirstDayOfMonth: function(d) {
        var day = (d.getDay() - (d.getDate() - 1)) % 7;
        return (day < 0) ? (day + 7) : day;
    },

    getLastDayOfMonth: function(d) {
        var day = (d.getDay() + (_date.daysInMonth(d)[d.getMonth()] - d.getDate())) % 7;
        return (day < 0) ? (day + 7) : day;
    },

    getSuffix: function(d) {
        var str = d.getDate().toString();
        var index = parseInt(str.slice(-1));
        return suffixes[index] || suffixes['default'];
    },

    applyOffset: function(date, offset_seconds) {
        date.setTime(date.valueOf() - offset_seconds * 1000);
        return date;
    },

    century: function(d) {
        return parseInt(d.getFullYear().toString().substring(0, 2), 10);
    }
};

var _number = {
    pad: function(value, size, ch) {
        if (!ch) ch = '0';
        var result = value.toString();
        var pad = size - result.length;

        while (pad-- > 0) {
            result = ch + result;
        }

        return result;
    }
};


var format_codes = {
    a: function(d) {
        return dayNamesShort[d.getDay()];
    },
    A: function(d) {
        return dayNames[d.getDay()];
    },
    b: function(d) {
        return monthNamesShort[d.getMonth()];
    },
    B: function(d) {
        return monthNames[d.getMonth()];
    },
    c: function(d) {
        return d.toLocaleString();
    },
    C: function(d) {
        return _date.century(d);
    },
    d: function(d) {
        return _number.pad(d.getDate(), 2);
    },
    e: function(d) {
        return _number.pad(d.getDate(), 2, ' ');
    },
    H: function(d) {
        return _number.pad(d.getHours(), 2);
    },
    I: function(d) {
        return _number.pad(d.getHours() % 12 || 12, 2);
    },
    j: function(d) {
        return _number.pad(_date.getDayOfYear(d), 3);
    },
    k: function(d) {
        return _number.pad(d.getHours(), 2, ' ');
    },
    l: function(d) {
        return _number.pad(d.getHours() % 12 || 12, 2, ' ');
    },
    L: function(d) {
        return _number.pad(d.getMilliseconds(), 3);
    },
    m: function(d) {
        return _number.pad(d.getMonth() + 1, 2);
    },
    M: function(d) {
        return _number.pad(d.getMinutes(), 2);
    },
    p: function(d) {
        return (d.getHours() < 12 ? 'AM' : 'PM');
    },
    P: function(d) {
        return (d.getHours() < 12 ? 'am' : 'pm');
    },
    q: function(d) {
        return _date.getSuffix(d);
    },
    s: function(d) {
        return Math.round(d.valueOf() / 1000);
    },
    S: function(d) {
        return _number.pad(d.getSeconds(), 2);
    },
    u: function(d) {
        return d.getDay() || 7;
    },
    U: function(d) {
        return _date.getWeekOfYear(d, 0);
    },
    w: function(d) {
        return d.getDay();
    },
    W: function(d) {
        return _date.getWeekOfYear(d, 1);
    },
    x: function(d) {
        return d.toLocaleDateString();
    },
    X: function(d) {
        return d.toLocaleTimeString();
    },
    y: function(d) {
        return d.getFullYear().toString().substring(2, 4);
    },
    Y: function(d) {
        return d.getFullYear();
    },
    // TODO: guessing the pad function won't work with negative numbers?
    // TODO: getTimezoneOffset returns a positive number for GMT-7. Verify my
    // assumption that it will return negative for GMT+x
    z: function(d) {
        var tz = d.getTimezoneOffset() / 60 * 100;
        return (tz > 0 ? '-' : '+') + _number.pad(tz, 4);
    },
    "%": function() {
        return '%';
    }
};
format_codes.h = format_codes.b;
format_codes.N = format_codes.L;

var strftime = function(d, format) {
    // I used to use string split with a regex and a capturing block here,
    // which I thought was really clever, but apparently this exact feature is
    // fucked in IE. In every other browser (and languages), the captured
    // blocks are present in the output. E.g.
    // var pairs = "hello%athere".split(/(%.)/);
    // => ['hello', '%a', 'there']
    // IE however, just treats it the same as if no capturing block is present
    // => ['hello', 'there']
    // An alternate implementation of split is available here
    // http://blog.stevenlevithan.com/archives/cross-browser-split
    // Because that's a large amount of code for this one specific use case,
    // I've just decided to loop through a regex instead.

    var output = '';
    var remaining = format;

    while (true) {
        var r = /%./g;
        var results = r.exec(remaining);

        // No more format codes. Add the remaining text and return
        if (!results) {
            return output + remaining;
        }

        // Add the preceding text
        output += remaining.slice(0, r.lastIndex - 2);
        remaining = remaining.slice(r.lastIndex);

        // Add the format code
        var ch = results[0].charAt(1);
        var func = format_codes[ch];
        output += func ? func.call(this, d) : '%' + ch;
    }
};

module.exports = strftime;
