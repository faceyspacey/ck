Template.slide_admin_delivery_one_time.helpers({
	invoices: function(){
       	return Invoices.find({
			type: 'one_off'
		});
    }
});


Template.slide_admin_delivery_one_time.events({
	'click li .action_button': function(e) {
		if(!mobileScrolling) {
	        if(confirm('Are all ordered items delivered to this venue? ('+this.name+')')) {
				Invoices.findOne(this._id).chargeCustomer(this._id);
				Invoices.update(this._id, {$set: {
						delivered: true,
						actual_delivery_date: new moment().toDate()
					}
				});
		
			}
		}
	},
	'mousedown .action_button, touchstart .action_button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup .action_button, touchend .action_button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});
