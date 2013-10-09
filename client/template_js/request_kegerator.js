/** page_request_kegerator HELPERS, EVENTS & CALLBACKS **/

//this page has some imperfections. the venue dropdown needs to be factored in properly.
//we should change the overall model for the page when this dropdown is adjusted
//via a Session property similar to this based on the select change event
Template.page_request_kegerator.helpers({
	venue: function() {
		return Venues.findOne(this.venue_id);
	},
    kegeratorTypes: function(){
		return App.kegeratorTypes;
    },
	selectedKegeratorType: function(selectedId){
	    return selectedId == this.id ? 'selected' : '';
	},
	venues: function(){
		return Venues.find({user_id: Meteor.userId()})
    },
	selectedVenue: function(selectedId){
	    return selectedId == this._id ? 'selected' : '';
	}
});

Template.page_request_kegerator.events({
    'click #request-kegerator-btn': function(){
		var venue = Venues.findOne($('#kegeratorForm_venue_id').val());
		
		Kegerators.insert({
			user_id: venue.user_id,
			venue_id: venue._id,
        	type_id: $('#kegeratorForm_type_id').val(),
			installed: false,
			requested_date: new Date
		});
		
        venue.save({need_kegerator: true, kegerator_request_date: new Date});
    },
    'change #kegeratorForm_venue_id': function(){
        this.venueId = $('#kegeratorForm_venue_id').val();
    }
});
