
Flavors = new Meteor.Collection('flavors');

Meteor.publish("flavors", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) ){
        return Flavors.find({}); // everything
    } else {
        return Flavors.find({is_public: true}); // publicated flavors
    }
});


Flavors.allow({
    insert: function(userId, doc) {
        doc.user_id = userId;
        doc.createdAt = +(new Date());
        doc.updatedAt = +(new Date());

        return Roles.userIsInRole(userId, ['admin']);
    },
    update: function(userId, doc, fields, modifier) {
        doc.updatedAt = +(new Date());

        return Roles.userIsInRole(userId, ['admin']);
    },
    remove: function(userId, doc) {

        return Roles.userIsInRole(userId, ['admin']);
    },
    fetch: ['user_id, createdAt, updatedAt']
});

