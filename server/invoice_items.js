InvoiceItems = new Meteor.Collection("invoice_items");

Meteor.publish("invoice_items", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) ) return InvoiceItems.find({}); // everything
    else return InvoiceItems.find({user_id: this.userId});
});

InvoiceItems.allow({
    insert: function(userId, doc) {
        doc.createdAt = +(new Date());
        doc.updatedAt = +(new Date());
        doc.user_id = userId;
        return userId;
    },
    update: function(userId, doc, fields, modifier) {
        doc.updatedAt = +(new Date());
        return ((doc.user_id === userId) || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function(userId, doc) {
        return ((doc.user_id === userId) || Roles.userIsInRole(userId, ['admin']));
    },
    fetch: ['user_id, createdAt, updatedAt']
});