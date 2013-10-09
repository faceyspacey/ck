
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
		doc.created_at = new Date;
        doc.updated_at = new Date;
        doc.request_date = new Date;

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
