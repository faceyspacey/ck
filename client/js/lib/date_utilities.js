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

nextDateObj = function(d, dayOfWeek, partOfDay){
    dayOfWeek = dayOfWeek ? dayOfWeek.toLowerCase() : 'mon';
    var today = d ? new Date(d) : new Date(),
        indexOfDay = dayOfWeek.length == 3 ? shortDaysArray().indexOf(dayOfWeek) : longDaysArray().indexOf(dayOfWeek),
        correction = (today.getDay() == 0 || today.getDay() == indexOfDay) ? indexOfDay : indexOfDay+7,
        nextMonday = new Date(today.getFullYear(), today.getMonth(), today.getDate()-today.getDay()+correction);

    switch(partOfDay){
        case 'end':         return new Date(nextMonday.getTime() + 24*60*60*1000 - 1); // 23:59:59.999
        case 'noon':        return new Date(nextMonday.getTime() + 12*60*60*1000); // 12:00:00.0
        case 'start':       return nextMonday; // 00:00:00.0
        default:            return nextMonday;
    }
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

shortDaysArray = function() {
    return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
};

longDaysArray = function() {
    return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
};

Date.prototype.add = function(miliseconds){
    this.setTime( this.getTime() + parseInt(miliseconds) );
    return this;
};
