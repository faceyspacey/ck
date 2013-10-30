Template.slide_flavors.events({
	'click li': function(e) {
		if(!mobileScrolling) {
			Session.set('current_flavor_id', this._id);
			nextPage();
		}
	},
	'mousedown li, touchstart li': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup li, touchend li': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});

Template.slide_flavors.helpers({
	flavors: function() {
		return Flavors.find({is_public: true});
	}
});