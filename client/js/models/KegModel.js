
/** KegModel attributes:
 *
 *  collectionName              'Kegs'
 *  _id                         Str
 *  venue_id                    Str
 *  user_id                     Str
 *  flavor_id                   Str
 *  type                        Int
 *  price                       Int
 *  keg_num                     Int
 *  odd_even                    Str
 *  payment_cycle               Str
 *  payment_day                 Str
 *
 */

KegModel = function(doc){
	this.collectionName ='Kegs';
    this.defaultValues = {
        payment_cycle: 'weekly',
        payment_day: 'monday',
        odd_even: oddEvenWeek(),
        price: App.prices.fiveGallons,
        type: 1,
        keg_num: 1
    };

	this.randomFlavor = function() {
		var flavors = Flavors.find({is_public: true, name: {$not: 'Random'}}),
			weekNum = getWeekNumber(new Date),
			flavorIndex = (weekNum + this.keg_num) % flavors.count();

		return flavors.fetch()[flavorIndex]; //different flavor from prev week; different kegs at same time ;)
	};
	
    this.flavor = function(){
		return Flavors.findOne(this.flavor_id);
    };

	this.randomCompensatedFlavor = function() {
		return this.flavor().name == 'Random' ? this.randomFlavor() : this.flavor();
	};
	
	this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

    this.venue = function(){
        return Venues.findOne(this.venue_id);
    };

    this.getType = function(){
        return App.kegTypes[this.type];
    }

    this.chargePeriod = function(){
        return this.payment_cycle + '-' + this.payment_day;
    };

    this.chargePeriodName = function(){
        return this.getPaymentCycle().name + ' on ' + this.getPaymentDay().name;
    };

    this.getPaymentCycle = function(){
        return _.findWhere(App.paymentCycles, {id: this.payment_cycle});
    };

    this.getPaymentDay = function(){
        return _.findWhere(App.paymentDays, {id: this.payment_day});
    };

	_.extend(this, Model);
	this.extend(doc);

    return this;
};
