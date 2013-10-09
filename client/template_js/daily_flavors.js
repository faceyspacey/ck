/** page_daily_flavors HELPERS, EVENTS & CALLBACKS **/

Template.page_daily_flavors.helpers({
	oddColor: function() { return oddEvenWeek() == 'odd' ? 'color: rgb(9, 97, 194)' : ''; },
	evenColor: function() { return oddEvenWeek() == 'even' ? 'color: rgb(9, 97, 194)' : ''; },
	kegsToDeliver: function(day, cycle, oddEven) {
		return Template.daily_kegs_table({day: day, cycle: cycle, oddEven: oddEven});
	}
});


/** daily_kegs_table HELPERS, EVENTS & CALLBACKS **/

Template.daily_kegs_table.helpers({
	flavors: function(day, cycle, oddEven) {
		var attributes = {payment_day: day, payment_cycle: cycle};		
		if(_.isString(oddEven)) attributes.oddEven = oddEven;			
		var kegs =  Kegs.find(attributes).fetch();

		var flavors = _.countBy(kegs, function(keg) {
			return keg.randomCompensatedFlavor()._id;
		}); //returns {Orange: 4, Apple: 2, Cherry 7, etc:#}, but ids instead of names: {dfgljkdfg: 4, sljksdfljs:2}
	
		return _.map(flavors, function(value, key) {
			var flavor = Flavors.findOne(key);
			return {name: flavor.name, icon: flavor.icon, quantity: value};
		});
	}
});





