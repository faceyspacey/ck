Template.page_mobile_step_1.rendered = function() {
	console.log('rendered');
	var resizeScreen = _.once(function() {
		new Resizeable;
		console.log('resized!');
		
		$('#mobile_container ul li').live(START_EV, function() {
			$(this).addClass('touched-bg');
		}).live(END_EV, function() {
			$(this).removeClass('touched-bg');
		});
		
		$('#mobile_container .toolbar-button').live(START_EV, function() {
			$(this).addClass('touched');
		}).live(END_EV, function() {
			$(this).removeClass('touched');
		});
		
		$('.toolbar-next, .save-button, li').live(END_EV, function() {
			$('#sliding_page_wrapper').hardwareAnimate({translateX: -400}, 500, 'easeInBack');
		});
		
		$('.toolbar-back').live(START_EV, function() {
			$('#sliding_page_wrapper').hardwareAnimate({translateX: 400}, 500, 'easeInBack');
		});
		
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
}