
Kegs = new Meteor.Collection("kegs");

/*
Meteor.publish("kegs", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) ){
        return Kegs.find({}); // everything
    } else {
        return Kegs.find({user_id: this.userId}); // owned kegs
    }
});*/

Meteor.publish("kegs", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) ){
        return Kegs.find(); // everything
    }else{
        return Kegs.find({user_id: this.userId});
    }
});


Kegs.allow({
    insert: function(userId, doc) {
        doc.createdAt = (new Date()).getTime();
        doc.updatedAt = (new Date()).getTime();

        return userId ? true : false;
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
