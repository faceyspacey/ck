Kegs = new Meteor.Collection("kegs");

Meteor.publish("kegs", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return Kegs.find();
    else return Kegs.find({user_id: this.userId});
});

Kegs.allow({
    insert: function(userId, doc) {
        doc.created_at = new Date;
        doc.updated_at = new Date;
        return userId ? true : false;
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = new Date;
        return ((doc.user_id === userId) || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function(userId, doc) {
        return ((doc.user_id === userId) || Roles.userIsInRole(userId, ['admin']));
    },
    fetch: ['user_id, created_at, updated_at']
});
