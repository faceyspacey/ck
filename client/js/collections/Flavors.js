
Flavors = new Meteor.Collection('flavors', {
    reactive: true,
    transform: function (doc) { return new FlavorModel(doc); }
});

Meteor.subscribe('flavors');

/*
 function deleteFlavors(){
 var allFlavors = Flavors.find({}).fetch();
 for(i in allFlavors){
 Flavors.remove(allFlavors[i]._id);
 }
 }
 deleteFlavors();
 */
