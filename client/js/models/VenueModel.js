VenueModel = function(doc){
	this.collectionName ='Venues';
	this.defaultValues = {
        user_id: '',
        name: '',
        address: '',
        email: '',
        phone: '',
        facebook: '',
        //kegerators: 0,
        twitter: '',
        need_kegerator: true,
        kegerator_request_date: 0,
        delivered: true,
        delivery_date: 0,
        instagram: '',
        youtube: '',
        usedFlavors: '',
        created_at: 0,
        updated_at: 0
    };

    this.afterInsert = function(){
        var kegerator = new KegeratorModel();
        kegerator.save({venue_id: this._id});
    };

    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

    this.kegs = function() {
        return Kegs.find({venue_id: this._id});
    };

    this.getKegerators = function(options){
		var condition = {};
        _.extend(condition, options);
        _.extend(condition, {venue_id: this._id});
        return Kegerators.find(condition);
    };
    this.getKegeratorTaps = function(){
        var taps = 0;
        Kegerators.find({venue_id: this._id}).forEach(function(kegerator){
            taps += kegerator.taps();
        });

        return taps;
    };

    this.installedKegerators = function(){
        return this.getKegerators({installed: true});
    };
    this.kegeratorsToInstall = function(){
        return this.getKegerators({installed: {$not: true}});
    };

    this.checkKegeratorRequests = function(){
        if(this.kegeratorsToInstall().count()) this.save({need_kegerator: false});
        else this.save({need_kegerator: false, kegerator_request_date: 0});
    };

    this.makeDelivered = function(){
        this.save({delivered: true, delivery_date: new Date});
    };

    this.readyToDeliver = function(){
		this.save({delivered: false, delivery_date: 0});
    };

    this.formattedDeliveredAt = function() {
		return this.delivery_date ? '-' : moment(this.deliveredAt).format("ddd, MMM Do, h:mm a");
    };

    this.addKeg = function(attributes) {
		return Kegs.insert({
			venue_id: this._id,
			user_id: this.user_id,
			flavor_id: Flavors.findOne()._id,
			payment_cycle: 'weekly',
			payment_day: 'monday',
			keg_num: this.kegs().count() + 1
		});
    };

	this.placeOrder = function(orderedKegs, deliveryDate) {	
		var alertMessage;
			
		if(alertMessage = this.orderedMoreThanAvailable(orderedKegs)) {
			alert(alertMessage)
			return false;
		}
		
		var invoiceId = this.createInvoice(deliveryDate);
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
	
	this.createInvoice = function(deliveryDate) {	
		return Invoices.insert({
			type: 'one_off',
			delivered: false,
			order_num: Invoices.find().count() + 1,
			user_id: this.user_id,
			venue_id: this._id,
			requested_delivery_date: deliveryDate
		});
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

	//update the total and quantity amounts on the invoice
	this.finalizeInvoice = function(invoiceId, total, quantity) {
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