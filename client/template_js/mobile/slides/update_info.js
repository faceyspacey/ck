Template.slide_update_info.events({
	'mouseup #panel_edit_basic_info_link, tap #panel_edit_basic_info_link': function() {
		Session.set('step_type', 'panel_edit_basic_info');
		nextPage();
	},
	'mouseup #panel_edit_billing_info_link, tap #panel_edit_billing_info_link': function() {
		Session.set('step_type', 'panel_edit_billing_info');
		nextPage();
	},
	'mouseup #panel_change_password_link, tap #panel_change_password_link': function() {
		Session.set('step_type', 'panel_change_password');
		nextPage();
	},
	'touchstart li': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend li': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});