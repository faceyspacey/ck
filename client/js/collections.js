Meteor.subscribe('users');


Venues = new Meteor.Collection("venues", {
    reactive: true,
    transform: function (doc) { return new VenueModel(doc); }
});
Meteor.subscribe('venues');


Kegs = new Meteor.Collection("kegs", {
    reactive: true,
    transform: function (doc) { return new KegModel(doc); }
});

Meteor.subscribe("kegs");


Flavors = new Meteor.Collection('flavors', {
    reactive: true,
    transform: function (doc) { return new FlavorModel(doc); }
});
Meteor.subscribe('flavors');


Invoices = new Meteor.Collection('invoices', {
    reactive: true,
    transform: function(doc){ return new InvoiceModel(doc); },
});
Meteor.subscribe('invoices');


InvoiceItems = new Meteor.Collection("invoice_items", {
    reactive: true,
	transform: function (doc) { return new InvoiceItemModel(doc); }
});
Meteor.subscribe('invoice_items');


Messages = new Meteor.Collection("messages", {
    reactive: true,
    transform: function (doc) { return new MessageModel(doc); }
});
Meteor.subscribe('messages');