Template.slide_admin_brewing_todo.helpers({
	flavors: function() {		
		return getBrewingFlavors({$or: [
			{payment_cycle: 'weekly'},
            {payment_cycle: 'bi-weekly', odd_even: oddEvenWeek()}
        ]});
	}
});


Template.slide_admin_brewing_todo.events({
	'mousedown .action_button, touchstart .action_button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup .action_button, touchend .action_button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});
