
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
 *  user_id                     Str
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