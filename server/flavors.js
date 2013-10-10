Flavors = new Meteor.Collection('flavors');

Meteor.publish("flavors", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return Flavors.find({});
    else return Flavors.find({is_public: true});
});


Flavors.allow({
    insert: function(userId, doc) {
        doc.user_id = userId;
        doc.created_at = new Date;
        doc.updated_at = new Date;
        return Roles.userIsInRole(userId, ['admin']);
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = new Date;
        return Roles.userIsInRole(userId, ['admin']);
    },
    remove: function(userId, doc) {
        return Roles.userIsInRole(userId, ['admin']);
    },
    fetch: ['user_id, created_at, updated_at']
});

