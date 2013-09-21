


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


Meteor.methods({
    addAdmins: function (userId) {
        //return userId;
        var admins = [
            {   name: "Matheus Simon",  email: "90.matheus@gmail.com", roles:['admin'] },
            {   name: "James Gillmore",  email: "james@faceyspacey.com", roles:['admin'] },
            {   name: "Tyler Beerman",  email: "Tyler@consciouskombucha.com", roles:['admin'] }
        ];
        this.unblock();

        _.each(admins, function (admin) {

            //var currUser = Meteor.users.findOne({emails: {$elemMatch: { address: "90.matheus@gmail.com" }}});

            if( userId ){
                var currUser = Meteor.users.findOne(userId);
                if ( currUser.emails[0].address == admin.email && admin.roles.length > 0) {
                    Meteor.users.update(userId, {$set: {'profile.name': admin.name}});
                    Roles.addUsersToRoles(currUser._id, admin.roles);
                }
            }

        });
    }
});


