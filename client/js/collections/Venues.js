
Venues = new Meteor.Collection("venues", {
   // reactive: true,
    transform: function (doc) { return new VenueModel(doc); }
});

Meteor.subscribe('venues');

/*
 _.each(Venues.find({}), function(venue){
 Venues.remove(venue._id);
 });*/