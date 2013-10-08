/** page_edit_profile HELPERS, EVENTS & CALLBACKS **/

Template.page_edit_profile.helpers({
    paymentCycleOptions : function(){
        var html = '';
        var user = Meteor.users.findOne(Session.get('profileId'));
        if( !user )
            return html;

        var cyclesAvailable = App.paymentCycles();
        for(i in cyclesAvailable){
            html += '<option value="'+cyclesAvailable[i].id+'" '+(user.profile.paymentCycle == cyclesAvailable[i].id ? 'selected="selected"' : '')+'>'+cyclesAvailable[i].name+'</option>';
        }

        return html;
    },
    user : function(){
        return Meteor.users.findOne(this.user_id);
    }
});

Template.page_edit_profile.events({
    'click #save-profile-btn' : function(){
        var user = Meteor.users.findOne(this.user_id);


        var elements = window.profileForm.elements;
        var options = {profile: {}};
        for(var i = 0; i < elements.length; i++){
            if( elements[i].name == 'email' )
                options.emails = [{address: elements[i].value}]
            else
                options.profile[elements[i].name] = elements[i].value;
        }

        Meteor.users.update(user._id, {$set: {emails: options.emails, profile: options.profile}});

        if(Meteor.userId() == this.user_id) Router.go('myProfile');
        else Router.go('profile', {id: this.user_id});
    }
});