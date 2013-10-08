/** page_edit_profile HELPERS, EVENTS & CALLBACKS **/

Template.page_edit_profile.helpers({
    model : function() {
        return Meteor.users.findOne(this.user_id);
    }
});


/** user_form HELPERS, EVENTS & CALLBACKS **/

Template.user_form.events({
    'click #save-profile-btn' : function(){
        Meteor.users.update(this._id, {$set: {
				emails: [{address: $('#profile_email').val()}], 
				profile: {
					name: $('#profile_name').val(),
					phone: $('#profile_phone').val(),
					avatar: $('#profile_avatar').val()
				}
			}
		});

        if(Meteor.userId() == this._id) Router.go('myProfile');
        else Router.go('profile', {id: this.user_id});
    }
});

