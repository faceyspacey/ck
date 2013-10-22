/** page_venues HELPERS, EVENTS & CALLBACKS **/

Template.page_venues.helpers({
	venues: function(){
		var userId = Session.get('new_user_id') || this.user_id, //this is how i solved other collections not showing after signup
			condition = userId ? {user_id: userId} : {};
			
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
		if(confirm("Are you sure you'd like another (FREE!) kegerator for your venue?")) {
			Venues.update(this._id, {$set: {kegerator_request_date: new Date}});
		}
	},
	'click .add-double-tap-btn': function(e) {
		if(confirm("Are you sure you'd like to replace your current tap tower with a {FREE!) double tower?")) {
			Venues.update(this._id, {$set: {tap_request_date: new Date}});
		}
	},
	'click .request-materials-btn': function(e) {
		if(confirm("Are you sure you would like to request additional promotional materials?")) {
			Venues.update(this._id, {$set: {materials_request_date: new Date}});
		}
	}
});


/** keg_charges_table HELPERS, EVENTS & CALLBACKS **/

Template.keg_charges_table.helpers({
	kegs: function(){
        return this.kegs().count() ? this.kegs() : '';
	}
});

Template.keg_charges_table.events({
    'click .keg-charges-cycle-total': function(event){
        var cycleBox = $(event.toElement).parents().filter('.keg-charges-cycle');
        $(cycleBox).toggleClass('closed');
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











