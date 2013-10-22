Template.slide_flavors.events({
	'mouseup li, tap li': function(e) {
		Session.set('current_flavor_id', this._id);
		$(e.currentTarget).addClass('touched');
		nextPage();
	},
	'touchstart li': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend li': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});

Template.slide_flavors.helpers({
	flavors: function() {
		return Flavors.find({is_public: true});
	}
});