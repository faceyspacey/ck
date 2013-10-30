/** mobile_layout HELPERS, EVENTS & CALLBACKS **/

Template.mobile_layout.helpers({
	isMobile: function() {
		return isMobile;
	},
	isSuperAdminAndOnDesktop: function() {
		return App.isSuperAdmin() && !isMobile;
	}
});

Template.mobile_layout.events({
	'focus input, mousedown select': function(e) {
		$(e.currentTarget).removeClass('error');
	}
});

Template.mobile_layout.rendered = function() {
	setupSignupForm();
};

