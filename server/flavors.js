
Flavors = new Meteor.Collection('flavors');
Meteor.publish("all-flavors", function () {
    return Flavors.find(); // everything
});
Meteor.publish("public-flavors", function () {
    return Flavors.find({is_public: 1}); // publicated flavors
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