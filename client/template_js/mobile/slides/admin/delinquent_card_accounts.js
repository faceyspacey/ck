Template.slide_admin_unpaid_offline_invoices.helpers({
	users: function(){
	    return Meteor.users.find({valid_card: false}, {sort: {updated_at: -1}});
	}
});


Template.slide_admin_unpaid_offline_invoices.events({
	'click li .action_button': function(e) {
		if(!mobileScrolling) {
	        var message = prompt('You are about to notify them that their card is not working. Feel free to add a note', 'Note (Optional)');		
			Meteor.call('sendCustomerEmail', this.getEmail(), 'Please update your credit card with Conscious Kombucha. We are currently unable to charge past due balances.'+(message != 'Note (Optional)' ? ' NOTE: ' + message : ''));
		}
	},
	'mousedown .action_button, touchstart .action_button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup .action_button, touchend .action_button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});
