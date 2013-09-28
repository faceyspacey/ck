
Template.venues.events({
    'click .open-dialog-btn' : function(event){
        var venueDialog = document.getElementById('addVenueDialog');
        //console.log(venueDialog);
        if( venueDialog )
            venueDialog.style.display = 'block';
    },
    'click .close-dialog-btn' : function(event){
        var venueDialog = document.getElementById('addVenueDialog');

        if( venueDialog )
            venueDialog.style.display = 'none';
    },
    'click .add-venue-btn' : function(event){
        var venueFormElements = document.newVenueForm.elements;
        var attributes = {kegerators: []};
        _.each(venueFormElements, function(elem){
            attributes[elem.name] = elem.value;
            elem.value = "";
        });
        Venues.insert(attributes);
    },
    'click .delete-venue-btn' : function(event){
        if( confirm('Are you sure you want to delete this venue?') )
            Venues.remove(this._id);
    },
    'click .edit-venue-btn' : function(event){
        //console.log(Venues.findOne(this._id));
        Router.go('setKegs', {id: this._id});
    }
});

Template.venues.venuesList = function(){
    var condition = this.user_id ? {user_id: this.user_id} : {};
    //console.log(Venues.find(condition, {sort: {name: 1}}));
    return Venues.find(condition, {sort: {name: 1}});
}
