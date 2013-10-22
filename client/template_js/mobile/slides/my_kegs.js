Template.slide_my_kegs.helpers({
	isKegs: function() {
		return currentVenue().kegs().fetch().length == 0 ? false : true;
	},
	kegs: function() {
		return currentVenue().kegs();
	}
});

Template.slide_my_kegs.events({
	'mouseup li, tap li': function() {
		Session.set('step_type', 'panel_my_keg_subscriptions');
		Session.set('current_keg_id', this._id);
		nextPage();
	},
	'touchstart li': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend li': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});