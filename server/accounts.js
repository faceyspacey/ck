
Meteor.publish("users", function () {
    if( Roles.userIsInRole(this.userId, ['admin']) )
        return Meteor.users.find({}); // everything
    else
        return Meteor.users.find({_id: this.userId});
});

Meteor.users.allow({
    insert: function(userId, doc) {
            return true;
    },
    update: function(userId, doc, fields, modifier) {
        if( (doc._id == userId) )
            return true;
        else
            return false;
    },
    remove: function() {
        if( Roles.userIsInRole(this.userId, ['admin']) )
        return true;
    }
});


Accounts.onCreateUser(function(options, user){
    var emailsWithRoles = [
        {email: "90.matheus@gmail.com", roles: ['admin']},
        {email: "james@faceyspacey.com", roles: ['admin']},
        {email: "Tyler@consciouskombucha.com", roles: ['admin']},
        {email: "test1@email.com", roles: ['advanced-role']}
    ];

    var foundRoles = false;
    for(var i = 0; i < emailsWithRoles.length; i++){
        if( emailsWithRoles[i].email == user.emails[0].address ){
            Roles.addUsersToRoles(user._id, emailsWithRoles[i].roles);
            user.roles = emailsWithRoles[i].roles;
            foundRoles = true;
        }
    }
    if( !foundRoles ){
        Roles.addUsersToRoles(user._id, ['customer']);
        user.roles = ['customer'];
    }

    if (options.profile)
        user.profile = options.profile;
    return user;
})


