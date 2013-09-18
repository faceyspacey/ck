
Venues = new Meteor.Collection('venues');
Meteor.publish("all-venues", function () {
    return Venues.find(); // everything
});
Meteor.publish("my-venues", function () {
    return Venues.find({user_id: this.userId}); // everything
});


Venues.allow({
    insert: function(userId, doc) {
        doc.user_id = userId;
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        if( (doc._id == userId) )
            return true;
        else
            return false;
    },
    remove: function(userId, doc) {
        if( Roles.userIsInRole(userId, ['admin']) || (doc.user_id == userId) )
            return true;
    }
});
