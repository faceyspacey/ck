/** page_profile HELPERS, EVENTS & CALLBACKS **/

Template.page_profile.helpers({
    user : function(){
        return Meteor.users.findOne(this.user_id);
    },
    venues: function(){
        return _.sortBy(Venues.find({user_id: this.user_id}).fetch(), function(venue){ return -1*venue.kegs().count(); });
    }
});

Template.page_profile.events({
    'click #edit-profile-btn' : function(){
        if(Meteor.userId() == this.user_id) Router.go('myProfileEdit');
        else Router.go('editProfile', {id: this.user_id});
    },
    'click .user-venues-btn' : function(){
        if(Meteor.userId() == this.user_id) Router.go('myVenues');
        else Router.go('clientVenues', {id: this.user_id});
    },
    'click .user-invoices-btn' : function(){
        if(Meteor.userId() == this.user_id) Router.go('myInvoices');
        else Router.go('clientInvoices', {id: this.user_id});
    }
});