Template.slide_cycle_day.helpers({
	saveButtonText: function() {
		return Session.get('step_type') == 'signup' ? 'NEXT' : 'SAVE CHANGES';
	},
	updateKeg: function() {
		return Session.get('step_type') == 'panel_my_keg_subscriptions';
	},
	radioCycleSelected: function(cycle) {
		if(!currentKeg()) return '';
		if(currentKeg().payment_cycle == cycle) return 'radio-button-selected';
	},
	radioDaySelected: function(day) {
		if(!currentKeg()) return '';
		if(currentKeg().payment_day == day) return 'radio-button-selected';
	}
});


Template.slide_cycle_day.events({
	'mouseup .save-button': function() {
		if($('.radio-button-selected').length < 2) alert('Please select the day and timing of your keg delivery');
		else {
			var cycle = $('.radio-cycle').index($('.radio-cycle.radio-button-selected')) ? 'bi-weekly' : 'weekly',
				day = $('.radio-day').index($('.radio-day.radio-button-selected')) ? 'thursday' : 'monday',
				kegId = Session.get('current_keg_id');

			//current user adding or editing a keg
			if(Meteor.user()) {
				//editing a keg
				if(kegId) {
					var options = {
						flavor_id: Session.get('current_flavor_id'),
						payment_day: day,
						payment_cycle: cycle,
					};
					
					//do this so the cycle stays on the same odd or even week
					if(Session.get('keg_cycle') == 'bi-weekly' && Kegs.findOne(kegId).payment_cycle != 'bi-weekly') {
						odd_even: oddEvenWeek(moment().add('days', 7).toDate())
					}
					Kegs.update(kegId, {$set: options});
					prevPage();
				}
				//adding a new keg
				else {
					Kegs.insert({
						venue_id: currentVenue()._id,
						user_id: Meteor.userId(),
						flavor_id: Session.get('current_flavor_id'),
						payment_day: day,
						payment_cycle: cycle,
						odd_even: oddEvenWeek(moment().add('days', 7).toDate()),
						keg_num: currentVenue().kegs().count() + 1,
			            type: 1,
			            price: App.kegTypes[1].price
					});
					prevPage(2);
				}
			}
			//signup stage, setting cycle and day for saving in a later slide
			else {
				Session.set('keg_cycle', cycle);
				Session.set('keg_day', day);
				nextPage();
			}
		}
	},
	'mouseup .radio-cycle, touchend .radio-cycle': function(e) {
		$('.radio-cycle').removeClass('radio-button-selected');
		$(e.currentTarget).addClass('radio-button-selected');
	},
	'mouseup .radio-day, touchend .radio-day': function(e) {
		$('.radio-day').removeClass('radio-button-selected');
		$(e.currentTarget).addClass('radio-button-selected');
	},
	'mouseup .delete-button': function() {
		Kegs.remove(Session.get('current_keg_id'));
		prevPage();
	},
	'touchstart .save-button, mousedown .save-button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend .save-button, mouseup .save-button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});