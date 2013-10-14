/** page_set_kegs HELPERS, EVENTS & CALLBACKS **/

Template.page_set_kegs.helpers({
    venue: function() {
        return Venues.findOne(this.venue_id);
    },
    kegs: function(){
        return Venues.findOne(this.venue_id).kegs();
    }
});

Template.page_set_kegs.events({
    'click .add-keg-btn' : function(e){
        Venues.findOne(this.venue_id).addKeg();
    }
});


/** subscription_keg_row HELPERS, EVENTS & CALLBACKS **/

Template.subscription_keg_row.helpers({
	flavors: function(){
        return Flavors.find({is_public: true});
    },
	cycles: function(){
		return App.paymentCycles;
	},
	days: function(){
		return App.paymentDays;
	},
	flavorSelected: function(flavorId) {
		return flavorId == this._id ? 'selected' : '';
	},
	cycleSelected: function(cycleId) {
		return cycleId == this.id ? 'checked="checked"' : '';
	},
	daySelected: function(dayId) {
		return dayId == this.id ? 'checked="checked"' : '';
	}
});

Template.subscription_keg_row.events({
	'click .remove-keg-btn' : function(e, instance){
        if(confirm('Are you sure you want to drop this keg?')) Kegs.remove(this._id);
    },
    'change .keg-flavor-select' : function(e, instance){
		Kegs.update(this._id, {$set: {flavor_id: e.target.value}});
    },
    'change .radio-cycle' : function(e, instance){
		var attributes = {payment_cycle: e.target.value};
		if(e.target.value == 'bi-weekly') attributes.odd_even = oddEvenWeek(moment().add('days', 7).toDate());
		
		Kegs.update(e.target.title, {$set: attributes});
    },
    'change .radio-day' : function(e, instance) {
		Kegs.update(e.target.title, {$set: {payment_day: e.target.value}});
    }
});

