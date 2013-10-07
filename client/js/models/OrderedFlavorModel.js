OrderedFlavorModel = function(doc){
	
	//one downside of your defaultValues and getObjectValues() tools is you cannot rely on getObjectValues()
	//returning pure database object props/vals until you add the kegs to the defaultValues object.
	//I have been using your getObjectValues() method to look at pure database object props/vals.
	//so I added a new method to get these base prop/vals: getMongoValues().
	
	var defaultFlavor = Flavors.findOne({
			one_off_quantity_availible: {$gt: 0}
		});
		
    var defaultValues = {
        _id: '',
        user_id: Meteor.userId(),
        quantity: 1,
		price: App.prices.fiveGallonsOneOff,
		keg_type: '5 Gallons',
		flavor_id: defaultFlavor._id,
		flavor_icon: defaultFlavor.icon,
		flavor_name: defaultFlavor.name
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

	this.subtotal = function() {
		return this.quantity * this.price;
	};

	//Matheus, would you say the main purpose of this function is to provide default values?
    this.getObjectValues = function(doc, withOutId){
        if( typeof doc == 'undefined' ) doc = {}; //after model is created, call without doc to get object values minus model functions

        var object = {};

        _.extend(object, defaultValues); //you don't need this line cuz the for in statement below handles it

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
