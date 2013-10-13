Messages = new Meteor.Collection('messages');

Meteor.publish("messages", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return Messages.find({});
    else return Messages.find({user_id: this.userId});
});


Messages.allow({
    insert: function(userId, doc) {
        doc.user_id = userId;
        doc.created_at = new Date;
        doc.updated_at = new Date;
        doc.message_num = Messages.find().count()+1;

        return Roles.userIsInRole(userId, ['admin']) || userId;
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = new Date;
        return Roles.userIsInRole(userId, ['admin']);
    },
    remove: function(userId, doc) {
        return Roles.userIsInRole(userId, ['admin']);
    },
    fetch: ['user_id, created_at, updated_at, message_num']
});