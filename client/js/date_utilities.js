getWeekNumber = function(d) {
    // Copy date so don't modify original
    d = d ? new Date(d) : new Date();
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNumber = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    // Return week number
    return weekNumber;
}

oddEvenWeek = function(d) {
	var weekNumber = getWeekNumber(d);
	return weekNumber % 2 ? 'odd' : 'even';
}

getWeekDay = function(d){
    d = d ? new Date(d) : new Date();
    var day = d.getDay();
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[day];
}



Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

Date.prototype.toUTC = function(time) {
    if( time )
        var d = new Date(time);
    else
        var d = this;

    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    return d.getTime() + ((d.getTimezoneOffset()+(d.dst() ? 60 : 0)) * 60000);
}

