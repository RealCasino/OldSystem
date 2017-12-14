(function ($) {
    Date.CultureInfo = {dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]};
    Date.prototype.getMonthName = function (abbrev) {
        return abbrev ? $.Localization.getProperty(Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]) : $.Localization.getProperty(Date.CultureInfo.monthNames[this.getMonth()]);
    };
    Date.prototype.getDayName = function () {
        return $.Localization.getProperty(Date.CultureInfo.dayNames[this.getDay()]);
    };
    function parseDateUTC(input) {
        var reg = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
        var parts = reg.exec(input);
        return parts ? (new Date(Date.UTC(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]))) : null
    }
    $.DateFormat = function (dateString, format) {
        var date;
        if (dateString.indexOf("GMT")) {
            date = new Date(dateString);
        } else {
            date = parseDateUTC(dateString);
        }
        var p = function p(s) {
            return(s.toString().length == 1) ? "0" + s : s;
        };
        return format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?/g, function (format) {
            switch (format) {
                case"hh":
                    return p(date.getHours() < 13 ? date.getHours() : (date.getHours() - 12));
                case"h":
                    return date.getHours() < 13 ? date.getHours() : (date.getHours() - 12);
                case"HH":
                    return p(date.getHours());
                case"H":
                    return date.getHours();
                case"mm":
                    return p(date.getMinutes());
                case"m":
                    return date.getMinutes();
                case"ss":
                    return p(date.getSeconds());
                case"s":
                    return date.getSeconds();
                case"yyyy":
                    return date.getFullYear();
                case"yy":
                    return date.getFullYear().toString().substring(2, 4);
                case"dddd":
                    return date.getDayName();
                case"dd":
                    return p(date.getDate());
                case"d":
                    return date.getDate().toString();
                case"MMMM":
                    return date.getMonthName();
                case"MMM":
                    return date.getMonthName(true);
                case"MM":
                    return p((date.getMonth() + 1));
                case"M":
                    return date.getMonth() + 1;
                default:
                    return"";
            }
        });
    }
})(jQuery);


