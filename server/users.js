Meteor.publish("users", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return Meteor.users.find({}); // everything
    else return Meteor.users.find({_id: this.userId});
});

Meteor.users.allow({
    insert: function(userId, doc) {
            return true;
    },
    update: function(userId, doc, fields, modifier) {
        return ((doc._id == userId) || Roles.userIsInRole(this.userId, ['admin']));
    },
    remove: function() {
        return ((doc._id == userId) || Roles.userIsInRole(this.userId, ['admin']));
    }
});


Accounts.onCreateUser(function(options, user){
    var emailsWithRoles = [
        {email: "90.matheus@gmail.com", roles: ['admin']},
        {email: "james@faceyspacey.com", roles: ['admin']},
        {email: "tyler@consciouskombucha.com", roles: ['admin']},
		{email: "tylerbeerman@gmail.com", roles: ['admin']},
		{email: "sales@consciouskombucha.com", roles: ['admin']},
		{email: "james@consciouskombucha.com", roles: ['admin']}
    ];

    var foundRoles = false;
    for(var i = 0; i < emailsWithRoles.length; i++){
        if( emailsWithRoles[i].email == user.emails[0].address ){
            Roles.addUsersToRoles(user._id, emailsWithRoles[i].roles);
            user.roles = emailsWithRoles[i].roles;
            foundRoles = true;
        }
    }

    if(!foundRoles){
        Roles.addUsersToRoles(user._id, ['client']);
        user.roles = ['client'];
    }

    if (options.profile) user.profile = options.profile;
    else user.profile = {};

    return user;
});


