/** page_daily_flavors HELPERS, EVENTS & CALLBACKS **/

Template.page_daily_flavors.helpers({
	oddColor: function() { return oddEvenWeek() == 'odd' ? 'color: rgb(9, 97, 194)' : ''; },
	evenColor: function() { return oddEvenWeek() == 'even' ? 'color: rgb(9, 97, 194)' : ''; },
	kegsToDeliver: function(day, cycle, oddEven) {
		//determine which dayCycle function to use to determine flavor counts 
		var flavorCountFunction = day+'-'+cycle+(typeof oddEven == 'string' ? '-'+oddEven : '');

		//here's the magic: we render the same table template 6 times on the page, but with different data
		return Template.daily_kegs_table({day: day, flavorCountFunction: flavorCountFunction});
	}
});



//these flavor count functions are dynamically utilized for each keg flavor table
FlavorCountFunctions = {
	'monday-weekly': function(flavorId) {
		return Kegs.find({payment_day:'monday', payment_cycle: 'weekly'});
	},
	'thursday-weekly': function(flavorId) {
		return Kegs.find({payment_day:'thursday', payment_cycle: 'weekly'});
	},
	'monday-bi-weekly-odd': function(flavorId) {
		return Kegs.find({payment_day:'monday', payment_cycle: 'bi-weekly', oddEven: 'odd'});
	},
	'thursday-bi-weekly-odd': function(flavorId) {
		return Kegs.find({payment_day:'thursday', payment_cycle: 'bi-weekly', oddEven: 'odd'});
	},
	'monday-bi-weekly-even': function(flavorId) {
		return Kegs.find({payment_day:'monday', payment_cycle: 'bi-weekly', oddEven: 'even'});
	},
	'thursday-bi-weekly-even': function(flavorId) {
		return Kegs.find({payment_day:'thursday', payment_cycle: 'bi-weekly', oddEven: 'even'});
	}
};


/** daily_kegs_table HELPERS, EVENTS & CALLBACKS **/

Template.daily_kegs_table.helpers({
	flavors: function(flavorCountFunction) {
		var kegs = FlavorCountFunctions[flavorCountFunction]().fetch(), //e.g: Kegs.find({payment_day:'monday', payment_cycle: 'weekly'});
			flavors = _.countBy(kegs, function(keg) {
				return keg.randomCompensatedFlavor()._id;
			}); //returns {Orange: 4, Apple: 2, Cherry 7, etc:#}, but ids instead of names: {dfgljkdfg: 4, sljksdfljs:2}
		
		return _.map(flavors, function(value, key) {
			var flavor = Flavors.findOne(key);
			return {name: flavor.name, icon: flavor.icon, quantity: value};
		});
	}
});





