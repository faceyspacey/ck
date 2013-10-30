Template.slide_my_orders.helpers({
	isInvoices: function() {
		return Invoices.find({venue_id: currentVenue()._id}, {sort: {order_num: -1}}).fetch() == 0 ? false : true;
	},
	invoices: function() {
		return Invoices.find({venue_id: currentVenue()._id}, {sort: {order_num: -1}});
	}
});

Template.slide_my_orders.events({
	'click li': function() {
		if(!mobileScrolling) {
			Session.set('title_add_on', this.order_num);
			Session.set('current_invoice_id', this._id);
			nextPage();
		}
	},
	'mousedown li, touchstart li': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup li, touchend li': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});





