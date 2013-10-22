Template.slide_venue_info.events({
	'mouseup .save-button, touchend .save-button': function(e) {
		$('#slide_venue_info input').each(function() {
			if($(this).val() == '' || $(this).val() == $(this).attr('placeholder')) $(this).addClass('error');
		});
		
		if($('#slide_venue_info input').hasClass('error')) alert('Please complete the form.');
		else nextPage();
	},
	'touchstart .save-button, mousedown .save-button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend .save-button, mouseup .save-button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});

