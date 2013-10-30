Template.slide_change_password.events({
	'mouseup .save-button': function() {
		var oldPassword = $('#old_password').val(),
			newPassword = $('#new_password').val();
			
		Accounts.changePassword(oldPassword, newPassword, function(error) {
			if(error) alert("Something's wrong with the passwords you entered. Please try again.");
			else prevPage(2);
		});
	},
	'touchstart .save-button, mousedown .save-button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend .save-button, mouseup .save-button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});