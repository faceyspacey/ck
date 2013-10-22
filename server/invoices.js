Invoices = new Meteor.Collection('invoices');

Meteor.publish("invoices", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return Invoices.find({}); // everything
    else return Invoices.find({user_id: this.userId}); // own invoices
});

Invoices.allow({
    insert: function(userId, doc) {
        doc.created_at = new Date;
        doc.updated_at = new Date;

        var max = Invoices.findOne({}, {sort: {order_num: -1}});
        doc.order_num = parseInt(max ? max.order_num : 0) +1;

        return (doc.user_id === userId || Roles.userIsInRole(userId, ['admin']));
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = new Date;
        return (doc.user_id === userId || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function(userId, doc) {
        return (doc.user_id === userId || Roles.userIsInRole(userId, ['admin']));
    },
    fetch: ['user_id', 'created_at', 'updated_at', 'order_num']
});


