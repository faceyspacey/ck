
VenueModel = function(doc){
    var defaultValues = {
        collectionName: 'Venues',
        _id: '',
        user_id: '',
        name: '',
        address: '',
        email: '',
        phone: '',
        facebook: '',
        //kegerators: 0,
        twitter: '',
        need_kegerator: true,
        kegeRequestedAt: 0,
        delivered: true,
        deliveredAt: 0,
        instagram: '',
        youtube: '',
        usedFlavors: '',
        createdAt: 0,
        updatedAt: 0
    };

    //var requiredAttrs = ['name', 'address', 'email'];
    this.errors = {};

    this.save = function(attributes){
        if( this._id ){
            Venues.update(this._id, {$set: this.getObjectValues(attributes, true)});
        }else{
            var id = '';
            if( id = Venues.insert(this.getObjectValues(attributes, true)) ){
                this._id = id;
                this.addAfterSave();
            }
        }
        return this._id;
    }

    this.addAfterSave = function(){
        var kegerator = new KegeratorModel();
        kegerator.save({venue_id: this._id});
    }

    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

    this.getKegs = function(options){
        var condition = {};
        _.extend(condition, options);
        _.extend(condition, {venue_id: this._id});
        return Kegs.find(condition);
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
        if( this.kegeratorsToInstall().count() ){
            this.need_kegerator = true;
        }else{
            this.need_kegerator = false;
            this.kegeRequestedAt = 0;
        }
        this.save();
    }

    this.makeDelivered = function(){
        this.delivered = true;
        var d = new Date();
        this.deliveredAt = d.toUTC();
        this.save();
    }

    this.readyToDeliver = function(){
        this.delivered = false;
        this.deliveredAt = 0;
        this.save();
    }

    this.formattedDeliveredAt = function(){
        if( !this.deliveredAt )
            return '-';

        // time calculated in Californian time
        var caliTime = App.calcTime(this.deliveredAt, -8);

        var date = App.checkTime(caliTime.getDate());
        var month = App.checkTime(caliTime.getMonth() + 1);
        var year = caliTime.getFullYear();
        var hour = Math.abs(caliTime.getHours()-12);
        var min = App.checkTime(caliTime.getMinutes());
        var signal = caliTime.getHours() >= 12 ? 'pm' : 'am';

        return year +'-'+ month +'-'+ date +' '+ hour +':'+ min + signal;
    }

    this.getRareFlavorToday = function(id, day){
        var venue = id ? Venues.findOne(id) : Venues.findOne(this._id);
        if( !venue ) return [];

		//prepare condition to search for kegs in getKegs()
        var currentWeek = oddEvenWeek();
        var currentDay = day ? day : getWeekDay();
        var condition = {$or: [
            {paymentCycle: 'bi-weekly', oddEven: currentWeek, paymentDay: currentDay},
            {paymentCycle: 'weekly', paymentDay: currentDay},
        ]};

        if( !(venue.getKegs(condition).count() > 0) )
            return [{name: 'No kegs for '+currentDay, icon: ''}];

		//find kegs with pre-set flavors for delivery on the current day
        var flavors = _.countBy(venue.getKegs(condition).fetch(), function(keg) {
            return keg.flavor_id;
        });
        var flavorKeys = _.keys(flavors);

		//mark kegs without pre-set flavors (i.e. random kegs) to quantity of 0
        _.each(Flavors.find({_id: {$nin: flavorKeys}}).fetch(), function(flavor) {
            flavors[flavor._id] = 0;
        });

		//produce collection of least used flavors by venue
        var min = App.minOfAssociative(flavors, true);
        return Flavors.find({_id: {$in: min.keys}});
    }

    this.getRandomFlavorToday = function(id, day){
        var venue = id ? Venues.findOne(id) : Venues.findOne(this._id);
        if( !venue ) return [];

        //prepare condition to search for kegs in getKegs()
        var currentWeek = oddEvenWeek();
        var currentDay = day ? day : getWeekDay();
        var condition = {$or: [
            {flavor_id: 'random', paymentCycle: 'bi-weekly', oddEven: currentWeek, paymentDay: currentDay},
            {flavor_id: 'random', paymentCycle: 'weekly', paymentDay: currentDay},
        ]};

        if( !(venue.getKegs(condition).count() > 0) )
            return [{name: 'No random kegs for '+currentDay, icon: ''}];

        var flavors = _.shuffle(Flavors.find({is_public: true, _id: {$nin: ['random']}}).fetch());
        return [flavors[0]];
    }

    this.addKeg = function(attributes){
        if(typeof attributes == 'undefined') attributes = {};

		attributes.venue_id = this._id;
		attributes.user_id = this.user_id;

        attributes.flavor_id = 'random';
        attributes = (new KegModel()).getObjectValues(attributes);
        delete attributes._id;

        var keg = new KegModel(attributes);
        var keg_id = keg.save();

       // Kegs.update(kegId, {$set: attributes});

        this.updateUsedFlavors();

        return keg_id;
    };

    this.updateKeg = function(keg_id, attributes){
        if( typeof keg_id == 'undefined' || typeof attributes == 'undefined' )
            return;

		//add bi-weekly oddEven week, but only the first time that the keg is made bi-weekly
		if(attributes.paymentCycle == 'bi-weekly' && Kegs.findOne(keg_id).paymentCycle != 'bi-weekly') attributes.oddEven = oddEvenWeek();
		
        Kegs.update(keg_id, {$set: attributes});

        this.updateUsedFlavors();

        return true;
    }

    this.removeKeg = function(kegId){
  		Kegs.remove(kegId);
        this.updateUsedFlavors();
        return true;
    };

    this.updateUsedFlavors = function(){
        var flavors = [];

        this.getKegs().forEach(function(keg){
            if( flavors.indexOf(keg.flavor_id) < 0 )
                flavors.push(keg.flavor_id);
        });

        Venues.update(this._id, {$set: {usedFlavors: flavors}});

        return flavors;
    };

    this.getHalfRandomFlavor = function(venue){
        if( typeof venue == 'undefined' )
            venue = this;

        var flavors = _.countBy(venue.getKegs().fetch(), function(keg) {
            return keg.flavor_id;
        });
        var flavorKeys = _.keys(flavors);

        _.each(Flavors.find({_id: {$nin: flavorKeys}}).fetch(), function(flavor) {
            flavors[flavor._id] = 0;
        });

        var min = App.minOfAssociative(flavors, true);
        return min.keys[Math.floor((Math.random()*min.keys.length))];
    }

    this.displayKegs = function(){

        var kegsHtml = '<div class="venue-kegs-container">';
        var flavors = [];
        var flavorsArray = []
        var fees = 0;
        this.getKegs().forEach(function(keg){
            kegsHtml +=     '<div class="table-keg-div">' +
                                '<div class="table-keg-flavor-div" style="background-image:url('+keg.flavorIcon()+');"></div>' +
                                '<b>'+keg.flavor().name + '</b> keg: <span class="keg-fee"><b>$120</b> '+keg.paymentCycle+'/'+keg.paymentDay+'</span>' +
                            '</div>';
            fees += 120;
        });
        kegsHtml +=     '</div>';

        return kegsHtml;

    }

    this.getKegCharges = function(model){
        model = model ? model : this;

        var charging = [];
        _.each(App.paymentCycles, function(cycle){
            charging.push({
                onlyOne: false,
                id: cycle.id,
                name: cycle.name,
                count: model.getKegs({paymentCycle: cycle.id}).count(),
                total: _.reduce(_.pluck(model.getKegs({paymentCycle: cycle.id}).fetch(), 'price'), function(memo, num){ return memo + num; }, 0),
                cycles: (function(cycle){
                    var cycles = [];
                    _.each(App.paymentDays, function(day){
                        cycles.push({
                            name: cycle.name+' on '+day.name,
                            count: model.getKegs({paymentCycle: cycle.id, paymentDay: day.id}).count(),
                            total:  _.reduce(_.pluck(model.getKegs({paymentCycle: cycle.id, paymentDay: day.id}).fetch(), 'price'), function(memo, num){ return memo + num; }, 0),
                            flavors: (function(cycle, day){
                                var flavors = [];
                                _.each(_.groupBy(model.getKegs({paymentCycle: cycle.id, paymentDay: day.id}).fetch(), function(keg){ return keg.flavor_id;}), function(kegs, flavor_id){
                                        var flavor = Flavors.findOne(flavor_id);
                                        flavors.push({
                                            icon: flavor.icon,
                                            name: flavor.name,
                                            count: kegs.length,
                                            total: _.reduce(_.pluck(model.getKegs({paymentCycle: cycle.id, paymentDay: day.id, flavor_id: flavor_id}).fetch(), 'price'), function(memo, num){ return memo + num; }, 0),
                                        });
                                });
                                return flavors;
                            })(cycle, day),
                        });
                    });
                    return cycles;
                })(cycle),
            });
        });

        var nonEmptyCycles = [];
        _.each(charging, function(cycle){ if( cycle.count > 0 ){nonEmptyCycles.push(cycle.id);} });
        if( nonEmptyCycles.length == 1 )
            charging[0].onlyOne = true;

        return charging;
    }

    this.getKegChargesNew = function(venueModel){
        var venue = venueModel ? venueModel : this;

        var charging = [];
        _.each(App.paymentCycles, function(cycle){
            //console.log(cycle);
            _.each(App.paymentDays, function(day){
                //console.log(day);
                _.each(_.groupBy(Kegs.find({venue_id: venue._id, paymentCycle: cycle.id, paymentDay: day.id}).fetch(), function(keg){ return keg.paymentCycle+'-'+keg.paymentDay; }), function(kegType){

                    _.each(_.groupBy(kegType, function(keg){ return keg.flavor_id; }), function(kegs, flavor_id){
                        var flavor = Flavors.findOne(flavor_id);
                        charging.push({
                            flavor_name: flavor.name,
                            flavor_icon: flavor.icon,
                            payment_period: kegs[0].chargePeriodName(),
                            kegs_count: kegs.length,
                            total: kegs.length * 120,
                        });
                    });
                });
            });
        });

        return charging;
    }

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
			requested_delivery_date: deliveryDate.toDate()
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

    this.getObjectValues = function(doc, withOutId){
        if( typeof doc == 'undefined' )
            doc = {};

        var object = {};

        _.extend(object, defaultValues);

        for(i in defaultValues){
            if( typeof this[i] != 'undefined' )
                object[i] = this[i];
        }

        _.extend(object, doc);

        if( withOutId == true )
            delete object._id;

        return object;
    }

    _.extend(this, this.getObjectValues(doc));

    return this;
};