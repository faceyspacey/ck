Template.slide_change_password.events({
	'mouseup .save-button, tap .save-button': function() {
		var oldPassword = $('#old_password').val(),
			newPassword = $('#new_password').val();
			
		Accounts.changePassword(oldPassword, newPassword, function(error) {
			if(error) alert("Something's wrong with the passwords you entered. Please try again.");
			else prevPage(2);
		});
	}
});