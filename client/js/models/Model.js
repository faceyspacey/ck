Model = {
	errors: {},
	collection: function(){
        switch(this.collectionName){
            case 'Flavors': return Flavors;
            case 'InvoiceItems': return InvoiceItems;
            case 'Invoices': return Invoices;
            case 'Kegerators': return Kegerators;
            case 'Kegs': return Kegs;
            case 'OrderedFlavors': return OrderedFlavors;
            case 'Users': return Meteor.users;
            case 'Venues': return Venues;
        }
    },
	save: function(attributes){
        if(this._id) this.collection().update(this._id, {$set: attributes});
        else {
            var insertValues = this.prepareDefaults(attributes);
			this._id = this.collection().insert(insertValues);
				
            if(this._id) this.afterInsert();
        }
        return this._id;
    },
	afterInsert: function() {
		
	},
	prepareDefaults: function(attributes){
		var object = {};
		_.extend(object, this.defaultValues, attributes); 
		return object;
    },
	getMongoValues: function() {
		var mongoValues = {};
		for(var prop in this) {
			if(!_.isFunction(this[prop])) mongoValues[prop] = this[prop];
		}
		delete mongoValues.errors;
		return mongoValues;
	},
	extend: function(doc) {
		_.extend(this, this.defaultValues, doc);
	}
};