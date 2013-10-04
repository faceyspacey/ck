
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
        var attributes = {};
        _.each(venueFormElements, function(elem){
            attributes[elem.name] = elem.value;
            elem.value = "";
        });
        var venue = new VenueModel();
        venue.save(attributes);
        document.getElementById('addVenueDialog').style.display = 'none';
    },
    'click .delete-venue-btn' : function(event){
        if( confirm('Are you sure you want to delete this venue?') )
            Venues.remove(this._id);
    },
    'click .delivered-venue-btn': function(){
        this.makeDelivered();
    },
});

Template.venues.venuesList = function(){
    var condition = this.user_id ? {user_id: this.user_id} : {};
    //console.log(Venues.find(condition, {sort: {name: 1}}));
    return Venues.find(condition, {sort: {name: 1}});
}

Template.venues.helpers({
    'info': function(){
        return ' <span class="label">Kegs count:</span> <br/><b>'+this.getKegs().count()+' keg(s)</b><br/>' +
                '<span class="label">Kegerators:</span> <br/><b>'+this.getKegerators().count()+' kegerators <br/>('+this.getKegeratorTaps()+' taps)</b>';
    }
});
