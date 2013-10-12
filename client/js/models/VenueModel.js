// Since we dont store default values, we need to track what variables we have for each models.

/** VenueModel attributes:
 *
 *  _id                         Str
 *  user_id                     Str
 *  name                        Str
 *  email                       Str
 *  facebook                    Str
 *  twitter                     Str
 *  phone                       Str
 *  kegerator_count             Int
 *  tap_count                   Int
 *  delivery_date               Date
 *  kegerator_request_date      Date
 *  tap_request_date            Date
 *
*/

VenueModel = function(doc){
	this.collectionName ='Venues';
	this.defaultValues = {
		kegerator_count: 0,
		tap_count: 0,
		kegerator_request_date: new Date,
		tap_request_date: new Date,
        delivery_date : new Date(0),
	};
	
    this.afterInsert = function(){
    };

	this.kegeratorInstalled = function() {
		return this.kegerator_install_date > this.kegerator_request_date;
	};
	
	this.tapInstalled = function() {
		return this.tap_install_date > this.tap_request_date;
	};
		
    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

    this.kegs = function(condition) {
        var attributes = _.extend(_.extend({}, condition), {venue_id: this._id});
        return Kegs.find(attributes);
    };

    this.addKeg = function(attributes) {
		return Kegs.insert({
			venue_id: this._id,
			user_id: this.user_id,
			flavor_id: Flavors.findOne()._id,
			payment_cycle: 'weekly',
			payment_day: 'monday',
			keg_num: this.kegs().count() + 1,
            type: 1,
            price: App.kegTypes[1].price,
		});
    };

    this.kegsForSubscription = function(condition){
        var flavors = [];

        var oddEven =
        _.each(_.groupBy(_.sortBy(this.kegs(condition).fetch(), 'payment_cycle'), function(keg){
            return keg.payment_cycle + '-' + keg.payment_day + '-' + keg.flavor_id + '-' + keg.price;
        }), function(kegs, period){
            var keg = kegs[0],
                kegsInstance = kegs,
                kegs_subtotal = _.reduce(kegsInstance, function(memo, num){ return memo + num.price; }, 0);
            flavors.push({
                period: keg.payment_cycle + '-' + keg.payment_day,
                period_name: keg.payment_cycle + ' on ' + keg.payment_day,
                name: keg.getType().name + ' keg(s) ' + keg.payment_cycle.ucfirst()+ ', ',
                quantity: kegs.length,
                subtotal: kegs_subtotal,
                rate: keg.price,
                flavor_id: keg.flavor_id,
                flavor_icon: keg.randomCompensatedFlavor().icon,
                flavor_name: keg.randomCompensatedFlavor().name + (keg.flavor_id == 'random' ? ' (Random)' : ''),
            });
        });

        //console.log(flavors);
        return flavors;
    }

    this.placeSubscriptionOrder = function(subscriptionAttributes) {

        var invoiceId = this.createInvoice({
            type: 'subscription',
            payment_day: subscriptionAttributes.payment_day,
            requested_delivery_date: new Date,
            actual_delivery_date: new Date,
            delivered: true
        });
        var flavorRows = this.kegsForSubscription({payment_day: subscriptionAttributes.payment_day});
        this.createSubscriptionInvoiceItems(flavorRows, invoiceId);
        this.chargeCustomer();

        return invoiceId;
    };

	this.placeOrder = function(orderedKegs, deliveryDate) {	
		var alertMessage;
			
		if(alertMessage = this.orderedMoreThanAvailable(orderedKegs)) {
			alert(alertMessage)
			return false;
		}

		var invoiceId = this.createInvoice({type: 'one_off', delivered: false, requested_delivery_date: deliveryDate});
		this.createInvoiceItems(orderedKegs, invoiceId);
		this.chargeCustomer();
			
		return invoiceId;
	};
	
	this.orderedMoreThanAvailable = function(orderedKegs) {
		var stopOrder = false,
			message = '',
			availableFlavors = {};
			
		orderedKegs.forEach(function(keg) {
			var kegFlavor = Flavors.findOne(keg.flavor_id),
				kegFlavorQuantity = kegFlavor.one_off_quantity_availible;
		
			if(_.isUndefined(availableFlavors[keg.flavor_id])) availableFlavors[keg.flavor_id] = 0;
			availableFlavors[keg.flavor_id] += keg.quantity; //sum quantity used across the same flavor in multiple flavor rows
			
			//if ordered more kegs than we have available for the current flavor
			if(availableFlavors[keg.flavor_id] > kegFlavorQuantity) {
				stopOrder = true;
				message = 'Sorry, you ordered more '+ kegFlavor.name + ' kegs than we have available. Please modify your order.';
			}
		});
		
		return stopOrder ? message : false;
	};
	
	this.createInvoice = function(attributes) {
        var attributes = _.extend(_.extend({}, attributes), { user_id: this.user_id, venue_id: this._id });
		return Invoices.insert(attributes);
	};
	
	this.createInvoiceItems = function(orderedKegs, invoiceId) {
		var total = 0,
			quantity = 0;

		orderedKegs.forEach(function(keg) {
			InvoiceItems.insert({
				invoice_id: invoiceId,
				user_id: this.user_id,
				venue_id: this._id,
				quantity: keg.quantity,
				subtotal: keg.subtotal(),
                rate: keg.price,
				flavor_id: keg.flavor_id,
				flavor_icon: keg.flavor_icon,
				flavor_name: keg.flavor_name
			});
			total += keg.subtotal();
			quantity += keg.quantity;
			
			//decrement Flavor.one_off_quantity_available
			Flavors.update(keg.flavor_id, {$inc: {one_off_quantity_availible: -1 * keg.quantity}});
		});
		
		this.finalizeInvoice(invoiceId, total, quantity);
	};


    this.createSubscriptionInvoiceItems = function(invoiceItems, invoiceId) {
        var total = 0,
            quantity = 0;

        _.each(invoiceItems, function(item) {
            InvoiceItems.insert({
                invoice_id: invoiceId,
                user_id: this.user_id,
                venue_id: this._id,
                name: item.name,
                quantity: item.quantity,
                subtotal: item.subtotal,
                rate: item.rate,
                flavor_id: item.flavor_id,
                flavor_icon: item.flavor_icon,
                flavor_name: item.flavor_name
            });
            total += item.subtotal;
            quantity += item.quantity;
        });

        this.finalizeInvoice(invoiceId, total, quantity);
    };

	//update the total and quantity amounts on the invoice
	this.finalizeInvoice = function(invoiceId, total, quantity, paid) {
		Invoices.update(invoiceId, {$set: {
			total: total,
			keg_quantity: quantity,
			is_stripe_customer: this.user().stripeCustomerToken ? true : false,
			paid: false
		}});
	};
	
	this.chargeCustomer = function() {
		if(this.user().stripeCustomerToken != undefined) {
			//charge the user now
		}
		else {
			
		}
	};

    _.extend(this, Model);
	this.extend(doc);

	return this;
};