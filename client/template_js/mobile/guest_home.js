Template.guest_home.helpers({
	'showSignupButton': function() {
		return !Meteor.user();
	}
});

Template.guest_home.events({
	'mousedown #homepage-signup-button, touchstart #homepage-signup-button': function(e) {
		$(e.currentTarget).css({
			bottom: '-=6',
			boxShadow: 'inset 0 1px 10px 1px #5c8bee, 0 1px 0 #1d2c4d, 0 2px 0 #1f3053, 0 4px 3px 0 #111111'
		});
	},
	'mouseup #homepage-signup-button, touchend #homepage-signup-button': function(e) {
		e.preventDefault(); //the event somehow triggered focusing in on the signup input fields and making the ios keyboard show
		e.stopPropagation();
		
		buttonPressed = true;
		$(e.currentTarget).css({
			bottom: '+=6',
			boxShadow: 'inset 0 1px 10px 1px #5c8bee, 0 1px 0 #1d2c4d, 0 6px 0 #1f3053, 0 8px 4px 1px #111111'
		});
		
		console.log('going to signup');
		Router.go('signup');	
	}
});