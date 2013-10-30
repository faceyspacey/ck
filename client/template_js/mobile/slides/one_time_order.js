Template.slide_one_time_order.helpers({
	quantities: function() {
		return [
			{quantity: 1, name: '1 Keg'},
			{quantity: 2, name: '2 Kegs'},
			{quantity: 3, name: '3 Kegs'},
			{quantity: 4, name: '4 Kegs'},
			{quantity: 5, name: '5 Kegs'},
			{quantity: 6, name: '6 Kegs'},
			{quantity: 7, name: '7 Kegs'},
			{quantity: 8, name: '8 Kegs'},
			{quantity: 9, name: '9 Kegs'},
			{quantity: 10, name: '10 Kegs'}
		];
	},
	days: function() {
		return _.range(1,32);
	},
	months: function() {
		return monthsArray();
	},
	years: function() {
		return _.range(2013, 2022);
	},
	venues: function() {
		return  Venues.find();
	},
	selectedVenue: function() {
		return currentVenue()._id == this._id ? 'selected' : '';
	}
});

Template.slide_one_time_order.events({
	'mouseup .save-button': function(e) {
		console.log('pressed');
		OrderedFlavors = new Meteor.Collection(null, { //create local-only (temporary) mini-mongo collection
		    reactive: true,
		    transform: function (doc) { return new OrderedFlavorModel(doc); }
		});

			
		var keg = new OrderedFlavorModel({
				flavor_id: currentFlavor()._id,
				flavor_name: currentFlavor().name,
				flavor_icon: currentFlavor().icon,
				quantity: parseInt($('#quantity_dropdown').val())
			}),
			venue = Venues.findOne($('select#venue_dropdown').val()),
			deliveryDate = moment({
					day: $("#day_dropdown").val(), 
					month: $("#month_dropdown").val(), 
					year: $("#year_dropdown").val()
				}).toDate(),
			invoiceId = currentVenue().placeOrder([keg], deliveryDate);
			
		if(!invoiceId) alert('Oops. Something whent wrong with your order. Please try again.');
		else prevPage(2);
		
	},
	'touchstart .save-button, mousedown .save-button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend .save-button, mouseup .save-button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});

Template.slide_one_time_order.rendered = function() {
	//set the delivery date month and day dropdowns to the current month and next day
	$("#day_dropdown")[0].selectedIndex = (new Date).getUTCDate() - 1;
	$("#month_dropdown")[0].selectedIndex = (new Date).getMonth();
	$("#year_dropdown").val((new Date).getFullYear());
};