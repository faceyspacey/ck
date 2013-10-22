Meteor.users._transform = function(doc) {
	return new UserModel(doc);
};

Venues = new Meteor.Collection("venues", {
    reactive: true,
    transform: function (doc) { return new VenueModel(doc); }
});

Kegs = new Meteor.Collection("kegs", {
    reactive: true,
    transform: function (doc) { return new KegModel(doc); }
});

Flavors = new Meteor.Collection('flavors', {
    reactive: true,
    transform: function (doc) { return new FlavorModel(doc); }
});

Invoices = new Meteor.Collection('invoices', {
    reactive: true,
    transform: function(doc){ return new InvoiceModel(doc); },
});

InvoiceItems = new Meteor.Collection("invoice_items", {
    reactive: true,
	transform: function (doc) { return new InvoiceItemModel(doc); }
});

Messages = new Meteor.Collection("messages", {
    reactive: true,
    transform: function (doc) { return new MessageModel(doc); }
});

Meteor.subscribe('users');
Meteor.subscribe('invoices');
Meteor.subscribe('invoice_items');
Meteor.subscribe('messages');
Meteor.subscribe('venues');
Meteor.subscribe('kegs');
Meteor.subscribe('flavors');

