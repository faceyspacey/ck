
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
        if( Roles.userIsInRole(userId, ['admin']) )
            return true;
        else
            return false;
    },
    update: function(userId, doc, fields, modifier) {
        if( Roles.userIsInRole(userId, ['admin']) )
            return true;
        else
            return false;
    },
    remove: function(userId, doc) {
        if( Roles.userIsInRole(userId, ['admin']) )
            return true;
        else
            return false;
    }
});

