
LineItems = new Meteor.Collection("lineitems");

Meteor.publish("lineitems", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) ){
        return LineItems.find(); // everything
    }else{
        return LineItems.find({user_id: this.userId});
    }
});


LineItems.allow({
    insert: function(userId, doc) {

        return userId;
    },
    update: function(userId, doc, fields, modifier) {

        return ((doc.user_id === userId) || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function(userId, doc) {

        return ((doc.user_id === userId) || Roles.userIsInRole(userId, ['admin']));
    },
});
