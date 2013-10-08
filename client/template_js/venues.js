/** page_venues HELPERS, EVENTS & CALLBACKS **/

Template.page_venues.helpers({
	venues: function(){
	    var condition = this.user_id ? {user_id: this.user_id} : {};
	    return Venues.find(condition, {sort: {name: 1}});
	},
	model: function() {
		if(Session.get('venue_id') == 'new_venue') return new VenueModel;
		if(Session.get('venue_id')) return  Venues.findOne(Session.get('venue_id'));
		return false; 
	}
});

Template.page_venues.events({
    'click .open-dialog-btn' : function(e){
        Session.set('venue_id', 'new_venue');
    }
});


/** venue_grid_row HELPERS, EVENTS & CALLBACKS **/

Template.venue_grid_row.events({
	'click .delete-venue-btn' : function(e){
        if(confirm('Are you sure you want to delete this venue?')) Venues.remove(this._id);
    },
	'click .edit-venue-btn': function(e) {
		Session.set('venue_id', this._id);
	},
	'click .set-kegs-btn': function(e) {
		Router.go('setKegs', {id: this._id});
	},
	'click .request-kegerator-btn': function(e) {
		Router.go('requestKegerator', {id: this._id})
	}
});


/** keg_charges_table HELPERS, EVENTS & CALLBACKS **/

Template.keg_charges_table.helpers({
	kegCharges: function(venue){

	    var array = [];
	    var charges = this.getKegCharges();
	    for(var i in charges){
	        var cyclesArray = [];
	        for(var c in charges[i].cycles){
	            var flavorsArray = [];
	            for(var d in charges[i].cycles[c].flavors){
	                flavorsArray.push(charges[i].cycles[c].flavors[d]);
	            }
	            charges[i].cycles[c].flavors = flavorsArray;
	            cyclesArray.push(charges[i].cycles[c]);
	        }
	        charges[i].cycles = cyclesArray;
	        array.push(charges[i]);
	    }
	    return array;
	}
});

Template.keg_charges_table.events({
    'click .keg-charges-cycle-total': function(event){
        var cycleBox = $(event.toElement).parents().filter('.keg-charges-cycle');
        $(cycleBox).toggleClass('closed');
        //console.log(cycleBox);
    }
});


/** venue_form HELPERS, EVENTS & CALLBACKS **/

Template.venue_form.events({
	'click .add-venue-btn' : function(e){
        this.save({
			name: $('#venueForm_name').val(),
			address: $('#venueForm_address').val(),
			email: $('#venueForm_email').val(),
			phone: $('#venueForm_phone').val(),
			facebook: $('#venueForm_facebook').val(),
			twitter:$('#venueForm_twitter').val()
		});

		Session.set('venue_id', null);
    },
	'click .close-dialog-btn' : function(event){
        Session.set('venue_id', null);
    }
});











