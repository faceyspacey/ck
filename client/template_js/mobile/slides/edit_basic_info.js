Template.slide_edit_basic_info.helpers({
	user: function() {
		return Meteor.user();
	}
});

Template.slide_edit_basic_info.events({
	'mouseup .save-button': function() {		
		console.log('saving info');
		var name = $('input[type=name]').val(),
			email = $('input[type=email]').val(),
			phone = $('input[type=phone]').val();
		
		//if phone, email and password are valid		
		if(isValidPhone(phone) && isValidEmail(email) && name != '') {
				prevPage(2);
				setTimeout(function() {
					Meteor.users.update(Meteor.userId(), {$set: {
						emails: [{address: email}],
						profile: {
								name: name,
								phone: isValidPhone(phone) //returns cleaned phone # too
							}
						}
					});
				}, 600);	
		}
		else {
			//invalid submission: add error classes to inputs and alert() the user
			if(!isValidPhone(phone)) $('input[type=phone]').addClass('error');
			if(!isValidEmail(email)) $('input[type=email]').addClass('error');
			if($('input[type=password]').val() == '') $('input[type=password]').addClass('error');
			alert('Please provide a valid phone, email address and name');
		}
		
	},
	'touchstart .save-button, mousedown .save-button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend .save-button, mouseup .save-button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});