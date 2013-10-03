Template.daily_flavors.flavors = function() { return Flavors.find(); };
Template.daily_flavors.oddColor = function() { return oddEvenWeek() == 'odd' ? 'color: rgb(9, 97, 194)' : ''; };
Template.daily_flavors.evenColor = function() { return oddEvenWeek() == 'even' ? 'color: rgb(9, 97, 194)' : ''; };

//these flavor count functions are dynamically utilized for each keg flavor table
FlavorCountFunctions = {
	'monday-weekly': function(flavorId) {
		return Kegs.find({paymentDay:'monday', paymentCycle: 'weekly', flavor_id: flavorId}).count();
	},
	'thursday-weekly': function(flavorId) {
		return Kegs.find({paymentDay:'thursday', paymentCycle: 'weekly', flavor_id: flavorId}).count();
	},
	'monday-bi-weekly-odd': function(flavorId) {
		return Kegs.find({paymentDay:'monday', paymentCycle: 'bi-weekly', oddEven: 'odd', flavor_id: flavorId}).count();
	},
	'thursday-bi-weekly-odd': function(flavorId) {
		return Kegs.find({paymentDay:'thursday', paymentCycle: 'bi-weekly', oddEven: 'odd', flavor_id: flavorId}).count();
	},
	'monday-bi-weekly-even': function(flavorId) {
		return Kegs.find({paymentDay:'monday', paymentCycle: 'bi-weekly', oddEven: 'even', flavor_id: flavorId}).count();
	},
	'thursday-bi-weekly-even': function(flavorId) {
		return Kegs.find({paymentDay:'thursday', paymentCycle: 'bi-weekly', oddEven: 'even', flavor_id: flavorId}).count();
	}
};

Template.daily_flavors.kegsToDeliver = function(flavors, day, cycle, oddEven) {
	//determine which dayCycle function to use to determine flavor counts 
	var flavorCountFunction = day+'-'+cycle+(typeof oddEven == 'string' ? '-'+oddEven : '');
	
	//here's the magic: we render the same table template 6 times on the page, but with different data
	return Template.daily_kegs_table({flavors: flavors, day: day, flavorCountFunction: flavorCountFunction});
};

//this is a function helper nested in the flavor each iterations of the daily_kegs_table
Template.daily_kegs_table.kegQuantity = function(flavorId, flavorCountFunction) {
	return FlavorCountFunctions[flavorCountFunction](flavorId);
};



