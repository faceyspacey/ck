
Venues = new Meteor.Collection("venues");

Meteor.publish("venues", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) ){
        return Venues.find(); // everything
    }else{
        return Venues.find({user_id: this.userId});
    }
});


Venues.allow({
    insert: function(userId, doc) {
        doc.createdAt = (new Date()).getTime();
        doc.updatedAt = (new Date()).getTime();
        return (userId && (doc.user_id = userId));
    },
    update: function(userId, doc, fields, modifier) {
        doc.updatedAt = (new Date()).getTime();

        return ((doc.user_id === userId) || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function(userId, doc) {
        return ((doc.user_id === userId) || Roles.userIsInRole(userId, ['admin']));
    },
    fetch: ['user_id, createdAt, updatedAt']
});
