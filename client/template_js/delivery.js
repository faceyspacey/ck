/** page_delivery HELPERS, EVENTS & CALLBACKS **/

Template.page_delivery.helpers({
    mondayObject: { payment_day: 'monday' },
    thursdayObject: { payment_day: 'thursday' },
});


/** delivery_table HELPERS, EVENTS & CALLBACKS **/

Template.delivery_table.helpers({
    venues: function(){
        var venue_ids = _.keys(_.groupBy(Kegs.find({payment_day: this.payment_day}).fetch(), 'venue_id'));
        return Venues.find({_id: {$in: venue_ids}}, {sort: {name: 1}});
    },
    kegsToDeliverByFlavor: function(dayObject){
        var flavors = [];
        _.each(_.groupBy(Kegs.find({payment_day: dayObject.payment_day, venue_id: this._id}).fetch(), function(keg){ return keg.randomCompensatedFlavor()._id;}), function(kegs, flavor_id){
            var flavor = Flavors.findOne(flavor_id);
            flavors.push({
                icon: flavor.icon,
                name: flavor.name,
                count: kegs.length
            });
        });
        return flavors;
    },
    canBeDelivered: function(searchObject){
        return Invoices.find({
                created_at: {$gte: nextDateObj(new Date, searchObject.day, 'start')},
                venue_id: this._id,
                type: 'subscription'
        }).count() == 0 && Invoices.find({
                venue_id: this._id,
                type: 'subscription',
                paid: false
        }).count() == 0;
    }
});

Template.delivery_table.events({
    'click .delivered-venue-btn': function(e){
        var payment_day = $(e.target).data('pday');
        if( confirm('Are all ordered items delivered to this venue? ('+this.name+')') )
            this.placeSubscriptionOrder({payment_day: payment_day});
    }
});

