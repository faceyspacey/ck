/** page_delivery HELPERS, EVENTS & CALLBACKS **/

Template.page_delivery.helpers({
	venues: function(){
	    var condition = this.user_id ? {user_id: this.user_id} : {};
	    condition.delivered = false;
	    //console.log(Venues.find(condition, {sort: {name: 1}}));
	    return Venues.find(condition, {sort: {name: 1}});
	},
    info: function(){
        return ' <span class="label">Kegs count:</span> <br/><b>'+this.getKegs().count()+' keg(s)</b><br/>' +
            '<span class="label">Kegerators:</span> <br/><b>'+this.getKegerators().count()+' kegerators <br/>('+this.getKegeratorTaps()+' taps)</b>';
    }
});

Template.page_delivery.events({
    'click .delivered-venue-btn': function(){
        if( confirm('Are all ordered items delivered to this venue? ('+this.name+')') )
            this.makeDelivered();
    },
});




