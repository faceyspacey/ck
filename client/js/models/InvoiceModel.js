
InvoiceModel = function(doc){
	
	//one downside of your defaultValues and getObjectValues() tools is you cannot rely on getObjectValues()
	//returning pure database object props/vals until you add the kegs to the defaultValues object.
	//I have been using your getObjectValues() method to look at pure database object props/vals.
	//so I added a new method to get these base prop/vals: getMongoValues().
    var defaultValues = {
        _id: '',
        user_id: '',
        amount: 0,
        status: 0,
        createdAt: 0,
		venue_id: '',
		day: '',
		month: '',
		year: '',
		type: '',
		delivered: '',
		utc_delivery_time: '',
		keg_quantity: 0
    };
    this.errors = {};

    this.save = function(attributes){
        if( this._id ){
            Invoices.update(this._id, {$set: this.getObjectValues(attributes, true)}); //why send all props/values to the server? waste of bandwidth
			//you could write this simply like this:
			//Invoices.update(this._id, {$set: attributes});
        } else {
            var id = '';
            if(id = Invoices.insert(this.getObjectValues(attributes, true))) { //i like how you save default values here however :)
                this._id = id;
            }
        }
        return this._id;
    }

    this.user = function(){
        if( !this.user_id )
            return false;

        return Meteor.users.findOne(this.user_id);
    }

	//only one_off invoices are guaranteed to have a single Venue model associated with it
	this.venue = function(){
        if( !this.venue_id )
            return false;

        return Venues.findOne(this.venue_id);
    };

	this.invoiceItems = function(){
        return InvoiceItems.find({invoice_id: this._id});
    };

	this.requestedDeliveryDayOfWeek = function() {
		return moment(this.requested_delivery_date).format('ddd');
	};
	
	this.actualDeliveryDate = function() {
		return moment(this.actual_delivery_date).format("ddd, MMM Do, h:mm a");
	};
	
	this.actualPaidDate = function() {
		return moment(this.actual_paid_date).format("ddd, MMM Do, h:mm a");
	};

	//Matheus, would you say the main purpose of this function is to provide default values?
    this.getObjectValues = function(doc, withOutId){
        if( typeof doc == 'undefined' ) doc = {}; //after model is created, call without doc to get object values minus model functions

        var object = {};

        _.extend(object, defaultValues); //apply default values

		//apply default values
        for(i in defaultValues){
            if( typeof this[i] != 'undefined' )
                object[i] = this[i];
        }

		//override default values if any actual values
        _.extend(object, doc);

        if(withOutId == true) delete object._id; //withOutId is used for the save() method which can't have the _id property

        return object;
    }

	//this is used to get base mongo props/vals without all the model functions (including props not in defaultValues, unlike getObjectValues())
	this.getMongoValues = function() {
		var mongoValues = {};
		for(var prop in this) {
			if(!_.isFunction(this[prop])) mongoValues[prop] = this[prop];
		}
		delete mongoValues.errors;
		return mongoValues;
	}
	
	//populate model object with database object props/values upon initial retrieval from database
    _.extend(this, this.getObjectValues(doc));

    return this;
};
