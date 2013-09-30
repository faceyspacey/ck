

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
    'click .user-profile-btn' : function(){
        var user = Meteor.users.findOne(this._id);
        if( !user )
            return alert('User not found.');

        if( Meteor.userId() == this._id )
            Router.go('myProfile');
        else
            Router.go('profile', {id: this._id});
    },
    'click .user-venues-btn' : function(){
        var user = Meteor.users.findOne(this._id);
        if( !user )
            return alert('User not found.');

        if( Meteor.userId() == this._id )
            Router.go('myVenues');
        else
            Router.go('clientVenues', {id: this._id});
    },
    'click .user-orders-btn' : function(){
        var user = Meteor.users.findOne(this._id);
        if( !user )
            return alert('User not found.');

        if( Meteor.userId() == this._id )
            Router.go('myOrders');
        else
            Router.go('clientOrders', {id: this._id});
    }
});