
Meteor.subscribe('venues');

Template.allVenues.events({
    'click .open-dialog-btn' : function(event){
        var venueDialog = document.getElementById('addVenueDialog');
        console.log(venueDialog);
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
        for(var i = 0; i < venueFormElements.length; i++){
            attributes[venueFormElements[i].name] = venueFormElements[i].value;
        }
        if( id = Venues.insert(attributes) ){
            var venue = new VenueModel(id, attributes);
            console.log(venue.errors);
            for(var i = 0; i < venueFormElements.length; i++){
                document.newVenueForm.elements[i].value = '';
            }
        }
    },
    'click .delete-venue-btn' : function(event){
        if( confirm('Are you sure you want to delete this venue?') )
            Venues.remove(this._id);
    },
    'click .edit-venue-btn' : function(event){
        //console.log(Venues.findOne(this._id));
        Meteor.Router.to('/venue/'+this._id+'/editFlavors');
    }
});

Template.allVenues.venuesList = function(){
    return Venues.find({}, {sort: {name: 1}});
}

