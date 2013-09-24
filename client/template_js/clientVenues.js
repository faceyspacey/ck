
Template.clientVenues.helpers({
    'clientName' : function(){
        var clientId = Session.get('clientId');
        var client = Meteor.users.findOne(clientId);
        if( client && client.profile ){
            if( typeof client.profile.name == 'undefined' || client.profile.name == '' )
                return client.emails[0].address;
            else
                return client.profile.name;

        }
        Meteor.Router.to('/venue/'+this._id+'/editFlavors');
    }
});

Template.clientVenues.events({
    'click .edit-venue-btn' : function(event){
        //console.log(Venues.findOne(this._id));
        Meteor.Router.to('/venue/'+this._id+'/editFlavors');
    }
});

Template.clientVenues.venuesList = function(){
    var clientId = Session.get('clientId');
    console.log(clientId);
    return Venues.find({user_id: clientId}, {sort: {name: 1}});
}
