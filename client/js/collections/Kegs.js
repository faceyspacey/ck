
Kegs = new Meteor.Collection("kegs", {
    reactive: true,
    transform: function (doc) { return new KegModel(doc); }
});

Meteor.subscribe("kegs");

/*
Kegs.find().forEach(function(keg){
    console.log(keg);
    Kegs.remove(keg._id);
});*/