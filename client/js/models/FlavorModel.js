FlavorModel = function(doc){
	this.collectionName = 'Flavors';
    this.defaultValues = {
        name: '',
        icon: '',
        keg_icon: '',
        is_public: false
    };

    this.usage = function(){
        return Venues.find({usedFlavors: {$in: [this._id]}}).count();
    };
	
	this.oneOffQuantityAvailable = function() {
		return this.one_off_quantity_availible || 0;
	};

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};