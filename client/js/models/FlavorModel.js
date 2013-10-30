
/** FlavorModel attributes:
 *
 *  collectionName              'Flavors'
 *  _id                         Str
 *  created_at                  Date
 *  icon                        Str
 *  is_public                   Bool
 *  kegIcon                     Str
 *  name                        Str
 *  one_off_quantity_available  Int
 *  updated_at                  Date
 *
 */

FlavorModel = function(doc){
	this.collectionName = 'Flavors';
    this.defaultValues = {
        is_public: false
    };

    this.usage = function(){
        return Venues.find({usedFlavors: {$in: [this._id]}}).count();
    };
	
	this.oneOffQuantityAvailable = function() {
		return this.one_off_quantity_available || 0;
	};

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};


//e.g: dayCycleAttributes = {payment_day: 'monday', payment_cycle: 'bi-weekly', odd_even: 'even'}
getBrewingFlavors = function(dayCycleAttributes) {		
	var kegs =  Kegs.find(dayCycleAttributes).fetch(),
		flavors = _.countBy(kegs, function(keg) {
			return keg.randomCompensatedFlavor()._id;
		}); //returns {Orange: 4, Cherry 7}, but ids instead of names: {dfgljkdfg: 4, sljksdfljs: 7}

	return _.map(flavors, function(value, key) {
		var flavor = Flavors.findOne(key);
		return {name: flavor.name, icon: flavor.icon, quantity: value}; 
	}); //returns [{name: 'orange', etc: }, {name: 'strawberry, etc: }]
};