/** page_daily_flavors HELPERS, EVENTS & CALLBACKS **/

Template.page_daily_flavors.helpers({
	oddColor: function() { return oddEvenWeek() == 'odd' ? 'color: rgb(9, 97, 194)' : ''; },
	evenColor: function() { return oddEvenWeek() == 'even' ? 'color: rgb(9, 97, 194)' : ''; },
	
	/** dayCycleAttributes **/
	mondayWeekly: {payment_day: 'monday', payment_cycle: 'weekly'},
	thursdayWeekly: {payment_day: 'thursday', payment_cycle: 'weekly'},
	mondayBiWeeklyOdd: {payment_day: 'monday', payment_cycle: 'bi-weekly', odd_even: 'odd'},
	thursdayBiWeeklyOdd: {payment_day: 'thursday', payment_cycle: 'bi-weekly', odd_even: 'odd'},
	mondayBiWeeklyEven: {payment_day: 'monday', payment_cycle: 'bi-weekly', odd_even: 'even'},
	thursdayBiWeeklyEven: {payment_day: 'thursday', payment_cycle: 'bi-weekly', odd_even: 'even'}
});


/** daily_kegs_table HELPERS, EVENTS & CALLBACKS **/

Template.daily_kegs_table.helpers({
	flavors: function(dayCycleAttributes) {		
		var kegs =  Kegs.find(dayCycleAttributes).fetch(),
			flavors = _.countBy(kegs, function(keg) {
				return keg.randomCompensatedFlavor()._id;
			}); //returns {Orange: 4, Cherry 7}, but ids instead of names: {dfgljkdfg: 4, sljksdfljs: 7}
	
		return _.map(flavors, function(value, key) {
			var flavor = Flavors.findOne(key);
			return {name: flavor.name, icon: flavor.icon, quantity: value}; 
		}); //returns [{name: 'orange', etc: }, {name: 'strawberry, etc: }]
	}
});


/** offline_customer_kegs HELPERS, EVENTS  & CALLBACKS  **/

Template.offline_customer_kegs.helpers({
	flavors: function() {
		var flavors = Flavors.find({is_public: true, name: {$not: 'Random'}}),
			flavorsCount = flavors.count(),
			venuesCount = Venues.find({stripe_customer_token: undefined}).count()
			offlineFlavors = [];
				
		flavors.forEach(function(flavor) {
			offlineFlavors.push({
				name: flavor.name,
				icon: flavor.icon,
				quantity: Math.ceil(venuesCount/flavorsCount)
			});
		});


		return offlineFlavors;
	}
});





