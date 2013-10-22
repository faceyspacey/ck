InvoiceItems = new Meteor.Collection("invoice_items");

Meteor.publish("invoice_items", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) ) return InvoiceItems.find({}); // everything
    else return InvoiceItems.find({user_id: this.userId});
});

InvoiceItems.allow({
    insert: function(userId, doc) {
        doc.created_at = new Date;
        doc.updated_at = new Date;
        doc.user_id = userId;

        return (doc.user_id === userId || Roles.userIsInRole(userId, ['admin']));
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = new Date;
        return (doc.user_id === userId || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function(userId, doc) {
        return (doc.user_id === userId || Roles.userIsInRole(userId, ['admin']));
    },
    fetch: ['user_id', 'created_at', 'updated_at']
});