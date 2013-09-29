
Kegerators = new Meteor.Collection("kegerators");

Meteor.publish("kegerators", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) ){
        return Kegerators.find(); // everything
    }else{
        return Kegerators.find({user_id: this.userId});
    }
});


Kegerators.allow({
    insert: function(userId, doc) {
        doc.createdAt = (new Date()).getTime();
        doc.updatedAt = (new Date()).getTime();

        return Roles.userIsInRole(userId, ['admin']);
    },
    update: function(userId, doc, fields, modifier) {
        doc.updatedAt = (new Date()).getTime();

        return Roles.userIsInRole(userId, ['admin']);
    },
    remove: function(userId, doc) {

        return Roles.userIsInRole(userId, ['admin']);
    },
    fetch: ['user_id, createdAt, updatedAt']
});
