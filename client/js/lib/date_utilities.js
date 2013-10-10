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

dayOfWeek = function(month, day, year) {
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	return days[(new Date(month + ' ' + day + ' ' + year)).getDay()];
};

monthsArray = function() {
	return [
		{index:0, name: 'January'},
		{index:1, name: 'February'},
		{index:2, name: 'March'},
		{index:3, name: 'April'},
		{index:4, name: 'May'},
		{index:5, name: 'June'},
		{index:6, name: 'July'},
		{index:7, name: 'August'},
		{index:8, name: 'September'},
		{index:9, name: 'October'},
		{index:10, name: 'November'},
		{index:11, name: 'December'}
	];
};