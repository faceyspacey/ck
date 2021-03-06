Template.slide_order.helpers({
	order: function() {
		return Invoices.findOne(Session.get('current_invoice_id'));
	},
	invoiceItems: function() {
		return Invoices.findOne(Session.get('current_invoice_id')).invoiceItems();
	}
});

Template.slide_order.events({
	'mouseup .reply-button': function() {
		var message = prompt('Send us a quick message about the order. Anything wrong? All gravy?');
		currentInvoice().addReplyMessage(message);
	},
	'touchstart .reply-button, mousedown .reply-button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend .reply-button, mouseup .reply-button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});