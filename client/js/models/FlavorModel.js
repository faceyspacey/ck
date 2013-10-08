
FlavorModel = function(doc){
    var defaultValues = {
        collectionName: 'Flavors',
        _id: '',
        name: '',
        icon: '',
        kegIcon: '',
        is_public: false,
        user_id: '',
        createdAt: 0,
        updatedAt: 0,
    };
    this.errors = {};

    this.save = function(attributes){
        if( this._id ){
            Flavors.update(this._id, {$set: this.getObjectValues(attributes, true)});
        }else{
            var id = '';
            if( id = Flavors.insert(this.getObjectValues(attributes, true)) ){
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

    this.usage = function(){
        return Venues.find({usedFlavors: {$in: [this._id]}}).count();
    }
	
	this.oneOffQuantityAvailable = function() {
		return this.one_off_quantity_availible || 0
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