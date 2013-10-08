/** page_profile HELPERS, EVENTS & CALLBACKS **/

Template.page_profile.helpers({
    user : function(){
        return Meteor.users.findOne(this.user_id);
    },
    userKegCharges: function(user_id){
        return User.renderKegCharges(user_id);
    },
    kegChargesProfile: function(perspective, id){
        return Template.keg_charges_set_kegs({perspective: perspective, model_id: id});
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