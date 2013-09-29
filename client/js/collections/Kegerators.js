
Kegerators = new Meteor.Collection("kegerators", {
    reactive: true,
    transform: function (doc) { return new KegeratorModel(doc); }
});

Meteor.subscribe("kegerators");

/*
 Kegs.find().forEach(function(keg){
 console.log(keg);
 Kegs.remove(keg._id);
 });*/