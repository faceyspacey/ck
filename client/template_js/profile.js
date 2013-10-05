
Template.profile.helpers({
    'paymentCycleOptions' : function(){
        var html = '';
        var user = Meteor.users.findOne(Session.get('profileId'));
        if( !user )
            return html;

        var cyclesAvailable = App.paymentCycles();
        console.log(cyclesAvailable);
        for(i in cyclesAvailable){
            html += '<option value="'+cyclesAvailable[i].id+'" '+(user.profile.paymentCycle == cyclesAvailable[i].id ? 'selected="selected"' : '')+'>'+cyclesAvailable[i].name+'</option>';
        }

        return html;
    },
    'user' : function(){
        return Meteor.users.findOne(this.user_id);
    },
    'userKegCharges': function(user_id){
        return User.renderKegCharges(user_id);
    }
});

Template.profile.events({
    'click #edit-profile-btn' : function(){
        var user = Meteor.users.findOne(this.user_id);
        if( !user )
            return alert('User not found.');

        if( Meteor.userId() == this.user_id )
            Router.go('myProfileEdit');
        else
            Router.go('editProfile', {id: this.user_id});
    },
    'click .user-venues-btn' : function(){
        var user = Meteor.users.findOne(this.user_id);
        if( !user )
            return alert('User not found.');

        if( Meteor.userId() == this.user_id )
            Router.go('myVenues');
        else
            Router.go('clientVenues', {id: this.user_id});
    },
    'click .user-orders-btn' : function(){
        var user = Meteor.users.findOne(this.user_id);
        if( !user )
            return alert('User not found.');

        if( Meteor.userId() == this.user_id )
            Router.go('myOrders');
        else
            Router.go('clientOrders', {id: this.user_id});
    }
});