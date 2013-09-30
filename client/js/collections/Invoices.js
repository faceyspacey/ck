
Invoices = new Meteor.Collection('invoices', {
    reactive: true,
    transform: function(doc){ return new InvoiceModel(doc); },
});

Meteor.subscribe('invoices');