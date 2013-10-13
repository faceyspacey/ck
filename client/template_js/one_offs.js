/** page_oneOffs EVENTS, HELPERS & CALLBACKS **/

Template.page_one_offs.helpers({
	recentOneOffs: function(){
		var recentOneOffs = Invoices.find({
			type: 'one_off',
			is_stripe_customer: true,
			requested_delivery_date: {$gt: moment().subtract('days', 3).toDate()}
		});

	    return recentOneOffs.count() ? recentOneOffs : false;
	},
	recentOneOffsNonStripe: function(){
		var recentOneOffs = Invoices.find({
			type: 'one_off',
			is_stripe_customer: false,
			requested_delivery_date: {$gt: moment().subtract('days', 3).toDate()}
		});

	    return recentOneOffs.count() ? recentOneOffs : false;
	},
    invoiceItems: function (){
        return this.invoiceItems();
    }
});


/** delivered_one_off EVENTS, HELPERS & CALLBACKS **/

Template.delivered_one_off.events({
	'click .delivered': function() {
		Invoices.update(this._id, {$set: {
				delivered: true,
				actual_delivery_date: new moment().toDate()
			}
		});
	}
});


/** non_stripe_paid EVENTS, HELPERS & CALLBACKS **/

Template.non_stripe_paid.events({
	'click .paid': function() {
		Invoices.update(this._id, {$set: {
				paid: true,
				actual_paid_date: new moment().toDate()
			}
		});
	}
});