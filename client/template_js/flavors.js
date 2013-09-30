

Template.flavors.events({
    'click .open-dialog-btn' : function(event){
        var flavorDialog = document.getElementById('addFlavorDialog');
        //console.log(flavorDialog);
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
        var flavor = new FlavorModel(attributes);
        var id = flavor.save();
        if( id ){
            //var venue = new VenueModel(id, attributes);
            for(var i = 0; i < flavorFormElements.length; i++){
                document.newFlavorForm.elements[i].value = '';
            }
            document.getElementById('addFlavorDialog').style.display = 'none';
        }
        //console.log(id);
    },
    'click .delete-flavor-btn' : function(event){
        //console.log(Venues.find({kegerators: {$elemMatch: {taps: {flavor: 'x8Mn5J3Y8oujnhiwK'}}}}));
        if( confirm('Are you sure you want to delete this flavor?') )
            Flavors.remove(this._id);
    },
    'click .make-public-btn' : function(event){
        Flavors.update(this._id, {$set: {is_public: true}});
    }
});


Template.flavors.flavorsList = function(){
    /*for(var i = 0; i < Flavors.find({}, {sort: {name: 1}}).fetch().length; i++){
        console.log(Flavors.find({}, {sort: {name: 1}}).fetch()[i]);
    }*/
    return Flavors.find({}, {sort: {name: 1}});
}
Template.flavors.notPublic = function(){
   // console.log(this._id);
    return Flavors.findOne(this._id).is_public != true;
}