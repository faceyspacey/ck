

Meteor.subscribe('users');

Template.users.clientList = function(){
    var condition = this.role_id != 'all' ? {roles: {$in: [this.role_id]}} : {};
    var users = Meteor.users.find(condition);
    //console.log(clients);
    return users;
}

Template.users.helpers({
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

Template.users.events({
    'click .user-name' : function(){
        Meteor.Router.to('/clientVenues/'+this._id);
    }
});