Template.slide_user_info.helpers({
	saveButtonText: function() {
		return Session.get('step_type') == 'signup' ? 'NEXT' : 'Save Info';
	}
});

Template.slide_user_info.events({
	'mouseup .save-button, tap .save-button': function() {		
		var email = $('input[type=email]').val(),
			phone = $('input[type=phone]').val();
		
		//if phone, email and password are valid		
		if(isValidPhone(phone) && isValidEmail(email) && $('input[type=password]').val() != '') {				
				nextPage();
		}
		else {
			//invalid submission: add error classes to inputs and alert() the user
			if(!isValidPhone(phone)) $('input[type=phone]').addClass('error');
			if(!isValidEmail(email)) $('input[type=email]').addClass('error');
			if($('input[type=password]').val() == '') $('input[type=password]').addClass('error');
			alert('Please provide a valid phone, email address and password');
		}
	}
});