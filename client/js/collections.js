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


Deps.autorun(function() {
	console.log('user signed up!');
	
	var user_id = Session.get('new_user_id'); //this simply triggers reactivity so we have the right subscriptions once signed up
	Meteor.subscribe('users');
	Meteor.subscribe('venues', user_id);
	Meteor.subscribe('kegs');
	Meteor.subscribe('flavors');
	Meteor.subscribe('invoices');
	Meteor.subscribe('invoice_items');
	Meteor.subscribe('messages');
})
