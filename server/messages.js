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

        var max = Messages.findOne({}, {sort: {message_num: -1}});
        doc.message_num = parseInt(max ? max.message_num : 0) +1;

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