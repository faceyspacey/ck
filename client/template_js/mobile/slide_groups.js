/** signup_slides HELPERS, EVENTS & CALLBACKS **/
Template.signup_slides.helpers({
	isMobile: function() {
		return isMobile;
	}
});

var signupRendered = false,
	invalidCardRendered = false;
Template.signup_slides.rendered = function() {
	if(Session.get('invalid_card') && !invalidCardRendered) {
		invalidCardRendered = true;
		console.log('invalid card from sign_slides rendered');
		Session.set('slide_step', 4);
		$('#slide_billing_info p').text('Please supply a new card to pay for past charges.');
		$('#sliding_page_wrapper').hardwareAnimate({translateX: $('#mobile_container').width() * 4 * -1}, 1, 'easeInBack');
	}
	
	$('#mobile_container').animate({opacity: 1}, (signupRendered ? 0 : 2000), 'easeInQuart');
	rotateInMobileContainerSignup((signupRendered ? 0 : 2000));
	signupRendered = true;
};



/** panel_slides HELPERS, EVENTS & CALLBACKS **/
Template.panel_slides.helpers({
	isMobile: function() {
		return isMobile;
	}
});

var panelRendered = false;
Template.panel_slides.rendered = function() {
	$('#mobile_container').animate({opacity: 1}, (panelRendered ? 0 : 2000), 'easeInQuart');
	rotateInMobileContainerPanel();
	panelRendered = true;
};


/** sliding_page_wrapper HELPERS, EVENTS & CALLBACKS **/

Template.sliding_page_wrapper.helpers({
	slides: function() {
		return getSlideGroupTemplates(Session.get('step_type'));
	},
	renderSlide: function(slide) {
		return Template[slide]();
	}
});

Template.sliding_page_wrapper.rendered = function() {
	resizeable.resizeAllElements();
};


var rotateIn = function() {	
		Meteor.setTimeout(function() {
			$('#mobile_container').rotate({
			    angle: 0, 
		        animateTo:1080,
				duration: 1500,
		        easing: $.easing.easeInBack
			 });
		}, 10);
	},
	rotateInMobileContainerSignup = _.once(rotateIn),
	rotateInMobileContainerPanel = _.once(rotateIn);