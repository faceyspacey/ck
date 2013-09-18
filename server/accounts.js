var users = [
    {   name: "Matheus Simon",  email: "90.matheus@gmail.com", roles:['admin'] },
    {   name: "James Gillmore",  email: "james@faceyspacey.com", roles:['admin'] }
];


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

/*
_.each(users, function (user) {
    var id;

    id = Accounts.createUser({
        email: user.email,
        password: user.password,
        profile: { name: user.name }
    });

    if (user.roles.length > 0) {
        Roles.addUsersToRoles(id, user.roles);
    }

});*/