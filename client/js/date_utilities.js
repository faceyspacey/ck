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

