Template.slide_admin_unpaid_offline_invoices.helpers({
	invoices: function(){
	    return Invoices.find({paid: false, offline_customer: true}, {sort: {updated_at: -1}});
	}
});


Template.slide_admin_unpaid_offline_invoices.events({
	'click li .reply_button': function(e) {
		if(!mobileScrolling) {
	        var message = prompt('Write a message requesting payment.', 'Message');		
			this.addReplyMessage(message);
		}
	},
	'click li .pay_button': function(e) {
		if(!mobileScrolling) {
	        this.save({paid: true});
		}
	},
	'mousedown .action_button, touchstart .action_button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup .action_button, touchend .action_button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});
