

Meteor.subscribe('users');

Template.clients.clientList = function(){
    var clients = Meteor.users.find({roles: {$in: ['client']}});
    //console.log(clients);
    return clients;
}

Template.clients.helpers({
    'listRoles': function(roles){
        if( typeof roles == 'undefined' || roles.length < 1 )
            return '-';

        var rolesText = "";
        for( var i = 0; i < roles.length; i++ ){
            rolesText += roles[i] + (i < roles.length-1 ? ',' : '') + ' <br />';
        }
        return rolesText;
    },
    'venues': function(){
        var venues = Venues.find({user_id: this._id});

        return venues.count()+' venues';
    }
});