/** page_kegerator_installs HELPERS, EVENTS & CALLBACKS **/

Template.page_kegerator_installs.helpers({
	venues: function(){
	    return Venues.find({need_kegerator: true}, {sort: {kegeRequestedAt: 1}});
	}
});

Template.page_kegerator_installs.events({
    'click .installed-button': function(){
        this.makeItInstalled();
    }
});