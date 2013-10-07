Template.page_oneOffs.recentOneOffs = function(){
	var recentOneOffs = Invoices.find({
		type: 'one_off',
		is_stripe_customer: true,
		requested_delivery_date: {$gt: moment().subtract('days', 3).toDate()}
	});
	
    return recentOneOffs.count() ? recentOneOffs : false;
};

Template.page_oneOffs.recentOneOffsNonStripe = function(){
	var recentOneOffs = Invoices.find({
		type: 'one_off',
		is_stripe_customer: false,
		requested_delivery_date: {$gt: moment().subtract('days', 3).toDate()}
	});
	
    return recentOneOffs.count() ? recentOneOffs : false;
};

Template.delivered_one_off.events({
	'click .delivered': function() {
		Invoices.update(this._id, {$set: {
				delivered: true,
				actual_delivery_date: new moment().toDate()
			}
		});
	}
});

Template.non_stripe_paid.events({
	'click .paid': function() {
		Invoices.update(this._id, {$set: {
				paid: true,
				actual_paid_date: new moment().toDate()
			}
		});
	}
});