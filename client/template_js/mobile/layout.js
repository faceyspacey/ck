/** mobile_layout HELPERS, EVENTS & CALLBACKS **/

Template.mobile_layout.events({
	'focus input, mousedown select': function(e) {
		$(e.currentTarget).removeClass('error');
	}
});

Template.mobile_layout.rendered = function() {
	setupSignupForm();
};