/** page_orderKegs HELPERS **/

Template.page_orderKegs.availableFlavors = function() {
	return Flavors.find({one_off_quantity_availible: {$gt: 0}}).count() || false;
};

Template.page_orderKegs.orderedFlavors = function() {
	return OrderedFlavors.find();
};



/** flavor_row HELPERS **/

Template.flavor_row.quantities = function() {
	return _.range(1, Flavors.findOne(this.flavor_id).oneOffQuantityAvailable() + 1);
};

Template.flavor_row.flavors = function() {
	return Flavors.find({
			one_off_quantity_availible: {$gt: 0}
		});
};

Template.flavor_row.prices = function() {
	return [
		'100',
		'120',
		'150',
	];
};

Template.flavor_row.kegTypes = function() {
	return [
		'5 Gallons',
		'15 Gallons'
	];
};


Template.flavor_row.quantitySelected = function(quantity) {
	return quantity == this ? 'selected' : '';
};

Template.flavor_row.flavorSelected = function(flavorId) {
	return flavorId == this.getObjectValues()._id ? 'selected' : '';
};

Template.flavor_row.priceSelected = function(price) {
	return price == this ? 'selected' : '';
};

Template.flavor_row.kegTypeSelected = function(kegType) {
	return kegType == this ? 'selected' : '';
};




/** place_one_off_order HELPERS **/

//set the delivery date month and day dropdowns to the current month and next day
Template.place_one_off_order.rendered = function() {
	$("#day_dropdown")[0].selectedIndex = (new Date).getUTCDate() - 1;
	$("#month_dropdown")[0].selectedIndex = (new Date).getMonth();
	$("#year_dropdown").val((new Date).getFullYear());
};



Template.place_one_off_order.days = function() {
	return _.range(1,32);
};

Template.place_one_off_order.months = function() {
	return monthsArray();
};

Template.place_one_off_order.years = function() {
	return _.range(2013, 2016)
};

Template.place_one_off_order.venues = function() {
	return  Roles.userIsInRole(Meteor.userId(), ['admin']) ? Venues.find() : Venues.find({user_id: Meteor.userId()});
};

Template.place_one_off_order.total = function() {
	var total = 0;
	OrderedFlavors.find().forEach(function(keg) {
		total += keg.subtotal();
	});
	
	return total;
};



/** ALL EVENTS (page_orderKegs & flavor_row & place_one_off_order) **/

Template.page_orderKegs.events({
	'click #add_another_flavor': function(e) {
		var OrderedFlavorId = OrderedFlavors.insert({});
		return false;
	},
	'click #order_kegs': function(e) {
		//stop order if more kegs than available are ordered of one of the flavors
		var stopOrder = false,
			message = '',
			availableFlavors = {};
			
		OrderedFlavors.find().forEach(function(keg) {
			var kegFlavor = Flavors.findOne(keg.flavor_id),
				kegFlavorQuantity = kegFlavor.one_off_quantity_availible;
		
			if(_.isUndefined(availableFlavors[keg.flavor_id])) availableFlavors[keg.flavor_id] = 0;
			availableFlavors[keg.flavor_id] += keg.quantity; //sum quantity used across the same flavor in multiple flavor rows
			
			if(availableFlavors[keg.flavor_id] > kegFlavorQuantity) {
				stopOrder = true;
				message = 'Sorry, you ordered more '+ kegFlavor.name + ' kegs than we have available. Please modify your order.';
			}
		});
		
		if(stopOrder) {
			alert(message);
			return;
		}
		
			
		//create Invoice
		var total = 0,
			kegQuantity = 0, 
			venueOwnerUser = Meteor.users.findOne(Venues.findOne($('select#venue_dropdown').val()).user_id),
			deliveryDate = moment({
					day: $("#day_dropdown").val(), 
					month: $("#month_dropdown").val(), 
					year: $("#year_dropdown").val()
				}),
			invoiceId = Invoices.insert({
				type: 'one_off',
				delivered: false,
				order_num: Invoices.find().count() + 1,
				user_id: venueOwnerUser._id,
				venue_id: $('select#venue_dropdown').val(),
				requested_delivery_date: deliveryDate.toDate()
			});
		
		//createe InvoiceItems
		OrderedFlavors.find().forEach(function(keg) {	
			InvoiceItems.insert({
				invoice_id: invoiceId,
				user_id: venueOwnerUser._id,
				venue_id: $('select#venue_dropdown').val(),
				quantity: keg.quantity,
				subtotal: keg.subtotal(),
				flavor_id: keg.flavor_id,
				flavor_icon: keg.flavor_icon,
				flavor_name: keg.flavor_name
			});
			total += keg.subtotal();
			kegQuantity += keg.quantity;
			
			//decrement Flavor.one_off_quantity_available
			Flavors.update(keg.flavor_id, {$inc: {one_off_quantity_availible: -1 * keg.quantity}});
		});
		
		//update Invoice with total amount and keg_quantity from Invoice Items
		Invoices.update(invoiceId, {$set: {
			total: total,
			keg_quantity: kegQuantity,
			is_stripe_customer: venueOwnerUser.stripeCustomerToken ? true : false,
			paid: false
		}});
		
		if(Meteor.user.stripeCustomerToken != undefined) {
			//charge the user now
		}
		else {
			
		}
		
		FlashMessages.sendSuccess('Your Order has been placed.');
		Router.go('/myVenues');
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



