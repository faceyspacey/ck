
Flavors = new Meteor.Collection('flavors');

if( Roles.userIsInRole(this.userId, ['admin']) ){
    console.log('Admins is logged in.');
    Meteor.subscribe('all-flavors');
} else {
    Meteor.subscribe('public-flavors');
}

/*
 function deleteFlavors(){
     var allFlavors = Flavors.find({}).fetch();
     for(i in allFlavors){
         Flavors.remove(allFlavors[i]._id);
     }
 }
 deleteFlavors();
*/


Template.flavors.events({
    'click .open-dialog-btn' : function(event){
        var flavorDialog = document.getElementById('addFlavorDialog');
        console.log(flavorDialog);
        if( flavorDialog )
            flavorDialog.style.display = 'block';
    },
    'click .close-dialog-btn' : function(event){
        var flavorDialog = document.getElementById('addFlavorDialog');

        if( flavorDialog )
            flavorDialog.style.display = 'none';
    },
    'click .add-flavor-btn' : function(event){
        var flavorFormElements = document.newFlavorForm.elements;
        var attributes = {is_public: false};
        for(var i = 0; i < flavorFormElements.length; i++){
            attributes[flavorFormElements[i].name] = flavorFormElements[i].value;
        }
        if( id = Flavors.insert(attributes) ){
            //var venue = new VenueModel(id, attributes);
            for(var i = 0; i < flavorFormElements.length; i++){
                document.newFlavorForm.elements[i].value = '';
            }
        }
    },
    'click .delete-flavor-btn' : function(event){
        console.log(this._id);
        if( confirm('Are you sure you want to delete this venue?') )
            console.log(Flavors.remove(this._id));
    },
    'click .make-public-btn' : function(event){
        Flavors.update(this._id, {$set: {is_public: true}});
    }
});


Template.flavors.flavorsList = function(){
    return Flavors.find({}, {sort: {name: 1}});
}
Template.flavors.notPublic = function(){
    console.log(this._id);
    return Flavors.findOne(this._id).is_public != true;
}