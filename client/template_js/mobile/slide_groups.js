/** signup_slides HELPERS, EVENTS & CALLBACKS **/

Template.signup_slides.helpers({
	slides: function() {
		return getSlideGroupTemplates(Session.get('step_type'));
	},
	renderSlide: function(slide) {
		return Template[slide]();
	}
});

Template.signup_slides.rendered = function() {
	resizeable.resizeAllElements();
	
	if(Session.get('invalid_card')) {
		Session.set('slide_step', 4);
		$('#signup_step_5 p').text('Please supply a new card to pay for past charges.');
		$('#sliding_page_wrapper').hardwareAnimate({translateX: $('#mobile_container').width() * 4 * -1}, 1, 'easeInBack');
		Session.set('invalid_card', false);
	}
};



/** panel_slides HELPERS, EVENTS & CALLBACKS **/

Template.panel_slides.helpers({
	slides: function() {
		return getSlideGroupTemplates(Session.get('step_type'));
	},
	renderSlide: function(slide) {
		return Template[slide]();
	}
});

Template.panel_slides.rendered = function() {
	resizeable.resizeAllElements();
};