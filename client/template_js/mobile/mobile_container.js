Template.mobile_container.rendered = function() {
	var resizeScreen = _.once(function() {
		new Resizeable; //this is used to make this mobile screen work on all device sizes & orientations. dont worry about it too much
		
		//add touched bg to select flavor rows
		$('#mobile_container ul li').live(START_EV, function() {
			$(this).addClass('touched-bg');
		}).live(END_EV, function() {
			$(this).removeClass('touched-bg');
		});
		
		//add touched class to toolbar buttons
		$('#mobile_container .toolbar-button').live(START_EV, function() {
			$(this).addClass('touched');
		}).live(END_EV, function() {
			$(this).removeClass('touched');
		});
		
		//slide forward when SAVE buttons are pressed (or if the flavor row is pressed)
		$('.save-button, li').live(END_EV, function() {
			$('#sliding_page_wrapper').hardwareAnimate({translateX: -400}, 500, 'easeInBack');
		});
		
		//slide backwards when back button is pressed
		$('.toolbar-back').live(START_EV, function() {
			$('#sliding_page_wrapper').hardwareAnimate({translateX: 400}, 500, 'easeInBack');
		});
		
		//fake day/cyle radio form checkmarks etc
		$('.radio-button.radio-cycle:not(.radio-button-selected)').live(END_EV, function() {
			$('.radio-button.radio-cycle').removeClass('radio-button-selected');
			$(this).addClass('radio-button-selected');
		});
		$('.radio-button.radio-day:not(.radio-button-selected)').live(END_EV, function() {
			$('.radio-button.radio-day').removeClass('radio-button-selected');
			$(this).addClass('radio-button-selected');
		});
	});
	resizeScreen();
};


Template.mobile_container.events({
	'mouseup #step_1_complete, tap #step_1_complete': function() {
		//validate that both the venue and address fields are complete (display a simple alert)
		//add an error class to an invalid field to generate the red border: http://snapplr.com/9d9a
	},
	'mouseup #signup_step_2 li, tap #signup_step_2 li': function() {
		//show our actual flavors
		//store in a simple session variable the id of the selected flavor
	},
	'mouseup #step_3_complete, tap #step_3_complete': function() {
		//use jquery to find the selected fake radios and store it in 2 session vars
		//also validate the page--make sure the user checked one of each set of radios (display a simple alert)
	},
	'mouseup #step_4_complete, tap #step_4_complete': function() {
		//validate that fields are filled, that a proper email is used.
		//validate that the phone is a 10 digit number not including a possible starting 1 that the user might enter.
		//parse the string so that if they enter 19177417981, we store it as 9177417981, but we allow the user to enter a starting 1. 
		//remove any spaces or hyphens from the number we store, and also count the characters after removing any hyphens or spaces.
		//then create the user: http://docs.meteor.com/#accounts_createuser using the profile object to store the name and phone.
		//at this time, create the first venue, and link it to the user in the db, same with the keg;
	},
	'mouseup #step_5_complete, tap #step_5_complete': function() {
		//i'll leave this up to you, but alert the user of any issues, and highlight bad fields with the red error class
		//upon completion, send the user to My Venues
	}
});
//GLOBAL TO DOS:
//1)  change the title of the toolbar with each page change

//2) after the user signs up on step 4, remove the back button (cuz there is no point changing what we already stored in the db). 
//and then if they don't pay, take them to this page instead of the billing info page next time they login. ALSO, remove the back button from step 1.

//3) don't slide to the next page with my hardwareAnimate functions if there is an error obviously
//also what would be cool is if you made the page bounce if there is an error (and before showing the alert),  like this:
//$('#sliding_page_wrapper').hardwareAnimate({translateX: -200}, 300, 'easeInElastic', function() {
//	  $('#sliding_page_wrapper').hardwareAnimate({translateX: 200}, 300, 'easeOutElastic');
//});
//that's not correct necessarily. also try easeOutBounce and easeInBounce, maybe in combination with the elastic easing
//the idea is to slide a little bit forward and bounce back and land with more bouncing and shaking

//4) using jquery add a hover state that changes the opacity to .9 on hover to all the buttons. dont do it in css.
//$('.toolbar-button').live('mouseenter', function() {
//    $(this).css('opacity', .9);	
//}).live('mouseleave', function() {
//    $(this).css('opacity', 1)	
//});
//that's my lazy-man way of quickly adding hover states on lots of buttons that I always use. 

//5) for the fields i used CSS3 placeholder values, but that won't work on older browsers. replace it
//with the old fashioned way in js (i.e. real values), but make it look the same. as soon as you click a field, empty the placeholder value
//and if the user blurs without providing any new text, supply the placeholder value. make sure ur validation of empty fields
//do not validate the placeholder values. check to make sure that the text != 'Venue Name' for example. 

