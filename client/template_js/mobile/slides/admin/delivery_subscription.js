//MONDAY
Template.slide_admin_delivery_subscription_monday.helpers({
	venues: function(){
        var kegs = Kegs.find({
				$or: [
            		{payment_day: 'monday', payment_cycle: 'bi-weekly', odd_even: oddEvenWeek(nextDateObj(new Date, 'monday'))},
            		{payment_day: 'monday', payment_cycle: 'weekly'},
        		]
			}
		).fetch(),
		venue_ids = _.keys(_.groupBy(kegs, 'venue_id'));

        return Venues.find({_id: {$in: venue_ids}}, {sort: {name: 1}});
    },
	flavors: function(venue) {
		return venue.kegsForSubscription('monday');
	},
    canBeDelivered: function() {
        return Invoices.find({$and: [
            {requested_delivery_date: {$gte: mondayStart()}},
            {requested_delivery_date: {$lte: mondayEnd()}},
            {payment_day: 'monday',
            venue_id: this._id,
            type: 'subscription'},
        ]}).count() == 0;
    }
});


Template.slide_admin_delivery_subscription_monday.events({
	'click li .action_button': function(e) {
		if(!mobileScrolling) {
	        if(confirm('Are all ordered items delivered to this venue? ('+this.name+')')) {
				iScrollElementsDontDestroy['subscription_monday'] = true;
				this.placeSubscriptionOrder({payment_day: 'monday'});
			}
		}
	},
	'mousedown .action_button, touchstart .action_button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup .action_button, touchend .action_button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});



//THURSDAY
Template.slide_admin_delivery_subscription_thursday.helpers({
	venues: function(){
        var kegs = Kegs.find({
				$or: [
            		{payment_day: 'monday', payment_cycle: 'bi-weekly', odd_even: oddEvenWeek(nextDateObj(new Date, 'thursday'))},
            		{payment_day: 'monday', payment_cycle: 'weekly'},
        		]
			}
		).fetch(),
		venue_ids = _.keys(_.groupBy(kegs, 'venue_id'));

        return Venues.find({_id: {$in: venue_ids}}, {sort: {name: 1}});
    },
	flavors: function(venue) {
		return venue.kegsForSubscription('thursday');
	},
    canBeDelivered: function() {
        return Invoices.find({$and: [
            {requested_delivery_date: {$gte: thursdayStart()}},
            {requested_delivery_date: {$lte: thursdayEnd()}},
            {payment_day: 'thursday',
            venue_id: this._id,
            type: 'subscription'},
        ]}).count() == 0;
    }
});


Template.slide_admin_delivery_subscription_thursday.events({
	'click li .action_button': function(e) {
		if(!mobileScrolling) {
	        if(confirm('Are all ordered items delivered to this venue? ('+this.name+')')) {
				iScrollElementsDontDestroy['subscription_thursday'] = true;
				this.placeSubscriptionOrder({payment_day: 'thursday'});
			}
		}
	},
	'mousedown .action_button, touchstart .action_button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup .action_button, touchend .action_button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});





