Template.slide_user_info.helpers({
	saveButtonText: function() {
		return Session.get('step_type') == 'signup' ? 'NEXT' : 'Save Info';
	},
	disabled: function() { return '';
		return Session.get('slide_step') < 3 ? 'disabled="disabled"' : '';
	}
});

Template.slide_user_info.preserve({
	'input[id]': function (node) { return node.id; }
});

Template.slide_user_info.events({
	'mouseup .save-button': function() {		
		var email = $('input[type=email]').val(),
			phone = $('input[type=tel]').val();
		
		//if phone, email and password are valid		
		if(isValidPhone(phone) && isValidEmail(email) && $('input[type=password]').val() != '') {				
				nextPage();
		}
		else {
			//invalid submission: add error classes to inputs and alert() the user
			if(!isValidPhone(phone)) $('input[type=tel]').addClass('error');
			if(!isValidEmail(email)) $('input[type=email]').addClass('error');
			if($('input[type=password]').val() == '') $('input[type=password]').addClass('error');
			alert('Please provide a valid phone, email address and password');
		}
	},
	'mousedown .save-button, touchstart .save-button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup .save-button, touchend .save-button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});
