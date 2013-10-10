/** page_kegerator_installs HELPERS, EVENTS & CALLBACKS **/

Template.page_kegerator_installs.helpers({
	venues: function(){
	    return Venues.find({}, {sort: {kegerator_request_date: -1, tap_request_date: -1}});
	}
});

Template.page_kegerator_installs.events({
    'click .kegerator-installed-button': function() {
		Venues.update(this._id, {$set: {kegerator_install_date: new Date}, $inc: {kegerator_count: 1}});
    },
	'click .tap-installed-button': function() {
		Venues.update(this._id, {$set: {tap_install_date: new Date}, $inc: {tap_count: 1}});
    }
});