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
 *
 *  kegerator_request_date      Date
 *  tap_request_date            Date
 *  materials_request_date		Date
 *
 *	kegerator_install_date		Date
 *  tap_install_date			Date
 *  materials_supplied_date		Date
**/

VenueModel = function(doc){
	this.collectionName ='Venues';
	this.defaultValues = {
		kegerator_count: 0,
		tap_count: 0,
		
		kegerator_request_date: new Date,
		tap_request_date: new Date,
		materials_request_date: new Date,
		
        delivery_date : new Date(0)
	};
	
    this.afterInsert = function(){
	
    };

	this.kegeratorInstalled = function() {
		return this.kegerator_install_date > (this.kegerator_request_date || 0);
	};
	
	this.tapInstalled = function() {
		return this.tap_install_date > (this.tap_request_date || 0);
	};
	
	this.materialsSupplied = function() {
		return this.materials_supplied_date > (this.materials_request_date || 0);
	};
		
	this.needsStuff = function() {
		return !this.kegeratorInstalled() || !this.tapInstalled() || !this.materialsSupplied();
	};
	
	this.lastUpgradeTime = function() {
		var lastUpgradeTime = _.sortBy([
				this.kegerator_install_date,
				this.tap_request_date,
				this.materials_supplied_date
			], function(date) {
				return date ? date.getTime() : null;
			})[2];
			
		return moment(lastUpgradeTime).format("MM/DD") +'<br />' + moment(lastUpgradeTime).format("h:mma");
	};
		
    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

    this.kegs = function(condition) {
        var attributes = _.extend(_.extend({}, condition), {venue_id: this._id});
        return Kegs.find(attributes);
    };

    this.invoices = function(condition) {
        var attributes = _.extend(_.extend({}, condition), {venue_id: this._id});
        return Invoices.find(attributes);
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

    this.sendDeliveryMessages = function(invoiceId){
        var invoice = Invoices.findOne(invoiceId),
            adminMessage = '',
            customerMessage ='';
        Meteor.call('sendAdminEmail', this.user().getEmail(), 'Order delivered: #'+invoice.order_num, adminMessage, function(err, res){});
        Meteor.call('sendCustomerEmail', this.user().getEmail(), 'Order delivered: #'+invoice.order_num, customerMessage, function(err, res){});
    }

	//for subscriptions only
    this.lastDeliveryDate = function(payment_day, smallTime){
        var invoice = this.lastSubscriptionInvoiceForDay(payment_day);
        return invoice ? (smallTime ? invoice.actualDeliverySmallTime() : invoice.actualDeliveryDate()) : 'Not Delivered Yet';
    };
	this.lastSubscriptionInvoiceForDay = function(payment_day) {
		return Invoices.findOne({venue_id: this._id, payment_day: payment_day, type: 'subscription'}, {sort: {created_at: -1}});
	};

    this.hasUnpaidInvoice = function(){
        return Invoices.find({
            venue_id: this._id,
            type: 'subscription',
            paid: false
        }).count();
    }

    this.kegsForSubscription = function(payment_day){
        var flavors = [],
 			condition = {$or: [
            		{payment_cycle: 'weekly', payment_day: payment_day},
            		{payment_cycle: 'bi-weekly', payment_day: payment_day, odd_even: oddEvenWeek(nextDateObj(new Date(), payment_day))}
        		]},
 			kegsSortedByCycle = _.sortBy(this.kegs(condition).fetch(), 'payment_cycle'),
			kegGroups = _.groupBy(kegsSortedByCycle, function(keg){ 
				return keg.payment_cycle + '-' + keg.payment_day + '-' + keg.flavor_id + keg.randomCompensatedFlavor()._id + '-' + keg.price; 
			}); //{"weekly-monday-random-x5sa9XRpgHATsDyAQ-120": [],"bi-weekly-monday-x5sa9XRpgHATsDyAQ-x5sa9XRpgHATsDyAQ-120": []}


        _.each(kegGroups, function(kegGroup, groupKey){
            var keg = kegGroup[0],
                kegsInstance = kegGroup,
                kegs_subtotal = _.reduce(kegsInstance, function(memo, num){ return memo + num.price; }, 0);

            flavors.push({
                period: keg.payment_cycle + '-' + keg.payment_day,
                period_name: keg.payment_cycle + ' on ' + keg.payment_day,
                name: keg.randomCompensatedFlavor().name + ' keg' + (kegGroup.length > 1 ? 's' : ''),
                quantity: kegGroup.length,
                subtotal: kegs_subtotal,
                rate: keg.price,
                flavor_id: keg.flavor_id,
                flavor_icon: keg.randomCompensatedFlavor().icon,
                flavor_name: keg.randomCompensatedFlavor().name + (keg.flavor_id == 'random' ? ' (Random)' : ''),
            });
        });

        return flavors;
    }

    this.placeSubscriptionOrder = function(subscriptionAttributes) {
        var invoiceId = this.createInvoice({
            	type: 'subscription',
	            payment_day: subscriptionAttributes.payment_day,
	            requested_delivery_date: markedDeliveryDate(subscriptionAttributes.payment_day),//nextDateObj(new Date(), subscriptionAttributes.payment_day, 'noon'),
	            actual_delivery_date: new Date,
	            delivered: true
	        }),
			flavorRows = this.kegsForSubscription(subscriptionAttributes.payment_day);
			
        this.createInvoiceItems(flavorRows, invoiceId);
        this.chargeCustomer(invoiceId);

        return invoiceId;
    };

	this.placeOrder = function(orderedKegs, deliveryDate) {	
		var alertMessage;
			
		if(alertMessage = this.orderedMoreThanAvailable(orderedKegs)) {
			alert(alertMessage)
			return false;
		}

		var invoiceId = this.createInvoice({type: 'one_off', delivered: false, requested_delivery_date: deliveryDate});
		this.createInvoiceItems(orderedKegs, invoiceId, true);
		//this.chargeCustomer(invoiceId); do this upon delivery instead
			
		return invoiceId;
	};
	
	this.orderedMoreThanAvailable = function(orderedKegs) {
		var stopOrder = false,
			message = '',
			availableFlavors = {};
			
		orderedKegs.forEach(function(keg) {
			var kegFlavor = Flavors.findOne(keg.flavor_id),
				kegFlavorQuantity = kegFlavor.one_off_quantity_available;
		
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

    this.createInvoiceItems = function(kegs, invoiceId, isOneOff) {
        var total = 0,
            quantity = 0;
		
		kegs.forEach(function(item) {
            InvoiceItems.insert({
                invoice_id: invoiceId,
                user_id: this.user_id,
                venue_id: this._id,
                name: isOneOff ? item.name() : item.name,
                quantity: item.quantity,
                subtotal: item.quantity * item.rate,
                rate: item.rate,
                flavor_id: item.flavor_id,
                flavor_icon: item.flavor_icon,
                flavor_name: item.flavor_name
            });
            total += item.quantity * item.rate;
            quantity += item.quantity;

			if(isOneOff) Meteor.call('decrementFlavorQuantity', item.flavor_id, item.quantity);
        });

        this.finalizeInvoice(invoiceId, total, quantity);
    };

	//update the total and quantity amounts on the invoice
	this.finalizeInvoice = function(invoiceId, total, quantity, paid) {
		Invoices.update(invoiceId, {$set: {
			total: total,
			keg_quantity: quantity,
			is_stripe_customer: this.user().stripe_customer_token ? true : false,
			paid: false
		}});
	};
	
	this.chargeCustomer = function(invoiceId) {
		if(this.user().stripe_customer_token != undefined) {
            Meteor.call('chargeCustomer', invoiceId, function(error, result){
                Invoices.update(invoiceId, {$set: {paymentInProgress: false}});
            });
		}
		else {
			// charge non-stripe cutomers
		}
	};

    _.extend(this, Model);
	this.extend(doc);

	return this;
};