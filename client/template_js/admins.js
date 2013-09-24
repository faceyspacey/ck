

Template.admins.adminList = function(){
    var admins = Meteor.users.find({roles: {$nin: ['client']}});
    //console.log(clients);
    return admins;
}

Template.admins.helpers({
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

Template.admins.events({
    'click .user-name' : function(){
        Meteor.Router.to('/clientVenues/'+this._id);
    }
});