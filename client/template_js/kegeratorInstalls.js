
Template.kegeratorInstalls.venuesList = function(){
    var condition = {need_kegerators: true};
    if( this.user_id != false )
        condition.user_id = this.user_id;

    var venues = Venues.find({need_kegerator: true}, {sort: {kegeRequestedAt: 1}});
    return venues.count() ? venues : false;
};

Template.kegeratorInstalls.events({
    'click .installed-button': function(){
        this.makeItInstalled();
    }
});