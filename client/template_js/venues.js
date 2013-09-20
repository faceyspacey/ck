
Venues = new Meteor.Collection('venues');
if( Roles.userIsInRole(this.userId, ['admin']) )
    Meteor.subscribe('all-venues');
else
    Meteor.subscribe('my-venues');


/*
function deleteVenues(){
    var allVenues = Venues.find({}).fetch();
    console.log(allVenues);
    for(i in allVenues){
        console.log(allVenues[i]);
        Venues.remove(allVenues[i]._id);
    }
}
deleteVenues();
*/

var VenueModel = function(objectId, attributes){
    var id = '';
    var name = '',
        address = '',
        email = '',
        phone = '',
        facebook = '',
        twitter = '',
        instagram = '',
        youtube = '';
    var user_id = '';
    var kegerators = [];
    var modelAttributes = [
        'name',
        'address',
        'email',
        'phone',
        'facebook',
        'twitter',
        'instagram',
        'youtube',
        'kegerators',
        'user_id',
    ];
    var requiredAttrs = ['name', 'address', 'email'];
    this.errors = {};

    this.setAttributes = function(id, attributes){
        if( attributes ){
            for(i = 0; i < modelAttributes.length; i++){
                var attr = modelAttributes[i];
                if( typeof attributes[attr] == 'undefined' )
                    continue;

                if( requiredAttrs.indexOf(attr) != -1 ){
                    if( !attributes[attr].length )
                        this.errors[attr] = 'Can not be blank.';
                }

                this[attr] = attributes[attr];
            }
        }
        if( id )
            this['id'] = id;
    };

    this.getCollectionObject = function(){
        var modelAttrs = {_id: this.id};
        var attr = '';
        for(i = 0; i < modelAttributes.length; i++){
            attr = modelAttributes[i];
            modelAttrs[attr] = this[attr];
        }

        return modelAttrs;
    };

    this.setAttributes(objectId, attributes);
};

Template.venues.events({
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

Template.venues.venuesList = function(){
    var myVenues = Venues.find({}, {sort: {name: 1}}).fetch();
    var venueList = [];
    for(var i = 0; i < myVenues.length; i++){
        venue = new VenueModel(myVenues[i]._id, myVenues[i]);
        venueList.push(venue.getCollectionObject());
    }

    return venueList;
}
