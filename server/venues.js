
Venues = new Meteor.Collection('venues');

Meteor.publish("venues", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) ){
        return Venues.find(); // everything
    }else{
        return Venues.find({user_id: this.userId});
    }
});

Venues.allow({
    insert: function(userId, doc) {
        doc.user_id = userId;
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        if( (doc.user_id == userId) )
            return true;
        else
            return false;
    },
    remove: function(userId, doc) {
        if( Roles.userIsInRole(userId, ['admin']) || (doc.user_id == userId) )
            return true;
    }
});
