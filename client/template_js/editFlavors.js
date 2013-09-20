
Template.editFlavors.helpers({
    venue: function() {
        return Venues.findOne(Session.get('currentVenueId'));
    },
    kegerators: function(){
        var currentVenue = Venues.findOne(Session.get('currentVenueId'));
        return currentVenue ? currentVenue.kegerators : [];
    },
    flavorDropDown: function(flavor){
        var allFlavors = Flavors.find({is_public: true}).fetch();
        var options = '';
        for(var i = 0; i < allFlavors.length; i++){
            options += '<option value="' + allFlavors[i]._id + '" ' + (flavor == allFlavors[i]._id ? 'selected="selected"' : '') + '>' + allFlavors[i].name + '</option>';
        }

        return '<select class="tap-flavor-select">'+options +'</select>';
    },
    flavorIcon: function(flavor){
        var selectedFlavor = Flavors.findOne({_id: flavor, is_public: true});
        return '<img class="tap-row-icon" src="'+selectedFlavor.icon+'" />';
    }
});

Template.editFlavors.events({
    'change .tap-flavor-select' : function(){
        console.log(this._id);
        var tapInputs = document.editFlavorsForm.elements;
        var kegerators = [];
        var taps = [];
        for(var i = 0; i < tapInputs.length; i++){
            var numText = taps.length+1 == 1 ? '1st' : (taps.length+1 == 2 ? '2nd' : '3rd');

            taps.push({flavor: tapInputs[i].value, num: numText});

            if( taps.length == 3 || i == tapInputs.length-1 ){
                kegerators.push({
                    tapsCount: taps.length,
                    taps: taps,
                });
                taps = [];
            }
        }

        Venues.update(Session.get('currentVenueId'), {$set: {kegerators: kegerators}});
    },
    'click .add-tap-btn' : function(){
        var venue = Venues.findOne(Session.get('currentVenueId'));
        var kegerator = venue.kegerators.length ? venue.kegerators[venue.kegerators.length-1] : {tapsCount: 0};
        if( venue.kegerators.length && kegerator.tapsCount < 3 ){
            var numText = kegerator.tapsCount+1 == 1 ? '1st' : (kegerator.tapsCount+1 == 2 ? '2nd' : '3rd');
            kegerator.taps.push({flavor: App.getHalfRandomFlavor(venue), num: numText});
            kegerator.tapsCount += 1;
            venue.kegerators[venue.kegerators.length-1] = kegerator;
        }else{
            venue.kegerators.push({
                tapsCount: 1,
                taps: [{flavor: App.getHalfRandomFlavor(venue), num: '1st'}],
            });
        }
        Venues.update(venue._id, {$set: {kegerators: venue.kegerators}});
    }
});