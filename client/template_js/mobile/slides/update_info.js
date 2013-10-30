Template.slide_update_info.events({
	'click #panel_edit_basic_info_link': function() {
		if(!mobileScrolling) {
			Session.set('step_type', 'panel_edit_basic_info');
			nextPage();
		}
	},
	'click #panel_edit_billing_info_link': function() {
		if(!mobileScrolling) {
			Session.set('step_type', 'panel_edit_billing_info');
			nextPage();
		}
	},
	'click #panel_change_password_link': function() {
		if(!mobileScrolling) {
			Session.set('step_type', 'panel_change_password');
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