/** GLOBAL CODE FOR THIS FILE **/

var signupSteps = ['Add Your Venue', 'Select a Flavor', 'Delivery Times', 'Signup Info', 'Pay'],
	currentStep = 0,
	incrementStep = function() {
		currentStep += 1;
		Session.set('signup_step', currentStep);
	},
	decrementStep = function() {
		currentStep -= 1;
		Session.set('signup_step', currentStep);
	},
	nextPage = function() {
		incrementStep();
		$('#sliding_page_wrapper').hardwareAnimate({translateX: -400}, 500, 'easeInBack');
	},
	prevPage = function() {
		decrementStep();
		$('#sliding_page_wrapper').hardwareAnimate({translateX: 400}, 500, 'easeInBack');
	},
	resizeable = new Resizeable;
	setupSignupForm = _.once(function() {
		
		//prepare the slider wrapper to have the sub pages floated left and fitting properly
		resizeable.resizeAllElements(); 

		//add touched class to toolbar buttons & flavor rows
		$('#mobile_container .toolbar-button, #mobile_container ul li').live(START_EV, function() {
			$(this).addClass('touched');
		}).live(END_EV, function() {
			$(this).removeClass('touched');
		});
	
		//slide backwards when back button is pressed
		$('.toolbar-back').live(END_EV, prevPage);
	
		//fake day/cyle radio form checkmarks etc
		$('.radio-button.radio-cycle:not(.radio-button-selected)').live(END_EV, function() { //cycle fake radios
			$('.radio-button.radio-cycle').removeClass('radio-button-selected');
			$(this).addClass('radio-button-selected');
		});
		$('.radio-button.radio-day:not(.radio-button-selected)').live(END_EV, function() { //day fake radios
			$('.radio-button.radio-day').removeClass('radio-button-selected');
			$(this).addClass('radio-button-selected');
		});
		
		//setup hover states on buttons for desktop browsers
		$('.toolbar-button').live('mouseenter', function() {
		    $(this).css('opacity', .9);	
		}).live('mouseleave', function() {
		    $(this).css('opacity', 1)	
		});
		
		//use shim to make placeholder input attributes work in older browsers :) :) :)
		$.fn.placeholder();
		
		//set current step to 0 so the page 1 title shows in the toolbar
		Session.set('signup_step', currentStep);
	});



/** signup_toolbar HELPERS, EVENTS & CALLBACKS **/

Template.signup_toolbar.helpers({
	pageTitle: function() {
		return signupSteps[Session.get('signup_step')]; //reactive title!
	},
	showBackButton: function() {
		return Session.get('signup_step') != 0 && Session.get('signup_step') != 4; //hide back button sometimes
	}
});



/** step_2 HELPERS, EVENTS & CALLBACKS **/

Template.step_2.helpers({
	flavors: function() {
		return Flavors.find();
	}
});



/** signup_slider_wrapper HELPERS, EVENTS & CALLBACKS **/

Template.signup_slider_wrapper.events({
	//STEP 1
	'mouseup #step_1_complete, tap #step_1_complete': function() {
		$('#signup_step_1 input').each(function() {
			if($(this).val() == '' || $(this).val() == $(this).attr('placeholder')) $(this).addClass('error');
		});
		
		if($('#signup_step_1 input').hasClass('error')) alert('please complete the form');
		else nextPage();
	},
	//STEP 2
	'mouseup #signup_step_2 li, tap #signup_step_2 li': function() {
		Session.set('signup_flavor_id', this._id);
		nextPage();
	},
	//STEP 3
	'mouseup #step_3_complete, tap #step_3_complete': function() {
		if($('.radio-button-selected').length < 2) alert('Please select the day and timing of your keg delivery');
		else {
			var cycle = $('.radio-day').index($('.radio-button-selected')) ? 'weekly' : 'bi-weekly',
				day = $('.radio-day').index($('.radio-button-selected')) ? 'thursday' : 'monday';

			Session.set('signup_cycle', cycle);
			Session.set('signup_day', day);
			
			nextPage();
		}
	},
	//STEP 4
	'mouseup #step_4_complete, tap #step_4_complete': function() {		
		var email = $('input[type=email]').val(),
			phone = $('input[type=phone]').val();
		
		//if phone, email and password are valid		
		if(isValidPhone(phone) && isValidEmail(email) && $('input[type=password]').val() != '') {
			//create new user
			Accounts.createUser({
				email: email,
				password: $('input[type=password]').val(),
				profile: {
					name: $('#signup_venue_name').val(),
					phone: isValidPhone(phone) //returns cleaned phone #
				}
			}, function(error) {
				if(error) {
					alert('Oops! Something went wrong. Please try again.');
					return;
				}
				
				//insert & link venue to user
				var venue_id = Venues.insert({
					name: $('#signup_venue_name').val(),
					address: $('#signup_venue_address').val(),
					user_id: Meteor.userId()
				});
				
				//insert and link keg to venue
				Kegs.insert({
					venue_id: venue_id,
					user_id: Meteor.userId(),
					flavor_id: Session.get('signup_flavor_id'),
					payment_day: Session.get('signup_day'),
					payment_cycle: Session.get('signup_cycle'),
					odd_even: oddEvenWeek(moment().add('days', 7).toDate()),
					keg_num: 1,
		            type: 1,
		            price: App.kegTypes[1].price
				});
				
				//set user_id so subscriptions update & refresh is not needed
				Session.set('new_user_id', Meteor.userId());
				nextPage();
			});
		}
		else {
			//invalid submission: add error classes to inputs and alert() the user
			if(!isValidPhone(phone)) $('input[type=phone]').addClass('error');
			if(!isValidEmail(email)) $('input[type=email]').addClass('error');
			if($('input[type=password]').val() == '') $('input[type=password]').addClass('error');
			alert('Please provide a valid phone, email address and password');
		}
	},
	//STEP 5
	'mouseup #step_5_complete, tap #step_5_complete': function() {
		var card = {
		    	number: $('#signup_credit_card').val(),
			    cvc: $('#signup_cvv_code').val(),
			    expMonth: $('#signup_card_month').val(),
			    expYear: $('#signup_card_year').val()
			};
		
		Stripe.createToken(card, function(status, response) {
			if(status === 200) {
		        var stripeCardToken = response.id;
			    Meteor.call('updateBillingInfo', stripeCardToken, function() {
					Meteor.users.update(Meteor.userId(), {$set: {valid_card: true}}); //do this so router knows immediately from mini-mongo
					Router.go('myVenues');
				});
		    } 
			else {
				$('#signup_step_5 input, #signup_step_5 select').addClass('error');
				alert('Something is wrong with the card you provided. Please double check it.')
			}
		});
	},
	'focus input, mousedown select': function(e) {
		$(e.currentTarget).removeClass('error');
	}
});

Template.signup_slider_wrapper.rendered = function() {
	setupSignupForm();
};