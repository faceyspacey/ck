/** page_orderKegs HELPERS, EVENTS & CALLBACKS **/

Template.page_order_kegs.helpers({
	availableFlavors: function() {
		return Flavors.find({one_off_quantity_availible: {$gt: 0}}).count() || false;
	},
	orderedFlavors: function() {
		return OrderedFlavors.find();
	}
});

Template.page_order_kegs.events({
	'click #add_another_flavor': function(e) {
		var OrderedFlavorId = OrderedFlavors.insert({});
		return false;
	},
	'click #order_kegs': function(e) {
		var venue = Venues.findOne($('select#venue_dropdown').val()),
			orderedKegs = OrderedFlavors.find().fetch(), //fetch now so u dont need to rewind() the cursor
			deliveryDate = moment({
					day: $("#day_dropdown").val(), 
					month: $("#month_dropdown").val(), 
					year: $("#year_dropdown").val()
				}),
			invoiceId = venue.placeOrder(orderedKegs, deliveryDate);
			
		if(!invoiceId) return; //order failed
		
		FlashMessages.sendSuccess('Your Order has been placed.');
		Router.go('/myVenues');
	}
});


/** flavor_row HELPERS, EVENTS & CALLBACKS **/

Template.flavor_row.helpers({
	quantities: function() {
		return _.range(1, Flavors.findOne(this.flavor_id).oneOffQuantityAvailable() + 1);
	},
	flavors: function() {
		return Flavors.find({
				one_off_quantity_availible: {$gt: 0}
			});
	},
	prices: function() {
		return [
			'100',
			'120',
			'150',
		];
	},
	kegTypes: function() {
		return [
			'5 Gallons',
			'15 Gallons'
		];
	},
	quantitySelected: function(quantity) {
		return quantity == this ? 'selected' : '';
	},
	flavorSelected: function(flavorId) {
		return flavorId == this._id ? 'selected' : '';
	},
	priceSelected: function(price) {
		return price == this ? 'selected' : '';
	},
	priceSelected: function(price) {
		return price == this ? 'selected' : '';
	},
	kegTypeSelected: function(kegType) {
		return kegType == this ? 'selected' : '';
	}
});

Template.flavor_row.events({
	'change select.quantity_dropdown': function(e) {
		OrderedFlavors.update(this._id, {$set: {
				quantity: parseInt($(e.currentTarget).val())
			} 
		});
		return false;
	},
	'change select.flavor_dropdown': function(e) {
		var flavorId = $(e.currentTarget).val();
		OrderedFlavors.update(this._id, {$set: {
				flavor_id: Flavors.findOne(flavorId)._id,
				flavor_icon: Flavors.findOne(flavorId).icon,
				flavor_name: Flavors.findOne(flavorId).name
			} 
		});
	},
	'change select.price_dropdown': function(e) {
		OrderedFlavors.update(this._id, {$set: {
				price: parseInt($(e.currentTarget).val())
			} 
		});
		return false;
	},
	'change select.keg_type_dropdown': function(e) {
		OrderedFlavors.update(this._id, {$set: {
				keg_type: $(e.currentTarget).val()
			} 
		});
		return false;
	},
	'click .remove-keg-btn': function() {
		OrderedFlavors.remove(this._id);
	}
});


/** place_one_off_order HELPERS, EVENTS & CALLBACKS **/

Template.place_one_off_order.helpers({
	days: function() {
		return _.range(1,32);
	},
	months: function() {
		return monthsArray();
	},
	years: function() {
		return _.range(2013, 2016)
	},
	venues: function() {
		return  Roles.userIsInRole(Meteor.userId(), ['admin']) ? Venues.find() : Venues.find({user_id: Meteor.userId()});
	},
	total: function() {
		var total = 0;
		OrderedFlavors.find().forEach(function(keg) {
			total += keg.subtotal();
		});

		return total;
	}
});

Template.place_one_off_order.rendered = function() {
	//set the delivery date month and day dropdowns to the current month and next day
	$("#day_dropdown")[0].selectedIndex = (new Date).getUTCDate() - 1;
	$("#month_dropdown")[0].selectedIndex = (new Date).getMonth();
	$("#year_dropdown").val((new Date).getFullYear());
};


