InvoiceItems = new Meteor.Collection("invoice_items", {
    reactive: true
});

Meteor.subscribe('invoice_items');