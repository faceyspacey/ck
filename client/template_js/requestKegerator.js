
Template.requestKegerator.kegsInKegerators = function(){
    var venue = Venues.findOne(this.venue_id);
    if( !venue )
        return false;

    var kegs = venue.getKegs();
    var kegsCount = kegs.count();
    var kegerators = venue.getKegerators();
    var kegeratorTaps = venue.getKegeratorTaps();

}

Template.requestKegerator.events({
    'click #request-kegerator-btn': function(){
        var request = {
            venue_id: this.venue_id ? this.venue_id : document.getElementById('kegeratorForm_venue_id').value,
            type_id: document.getElementById('kegeratorForm_type_id').value,
        }
        var comment = document.getElementById('kegeratorForm_comment').value;
        var venue = Venues.findOne(request.venue_id);
        if( venue ){
            var kegerator = new KegeratorModel(request);
            var id = kegerator.save();
            if( venue.need_kegerator != true ){
                venue.save({
                    need_kegerator: true,
                    kegeRequestedAt: +(new Date)
                });
            }
        }

    },
    'change #kegeratorForm_venue_id': function(){
        this.venueId = document.getElementById('kegeratorForm_venue_id').value;
    }
});

Template.requestKegerator.helpers({
    'venueDropDown': function(){
        var options = [];
        Venues.find({user_id: Meteor.userId()}, {sort: {name: 1}}).forEach(function(venue){
            options.push({value: venue._id, name: venue.name});
        });

        var templateMap = {options: options, selected_id: this.venue_id};
        return Template.select_options(templateMap);
    },
    'typeDropDown': function(){
        var options = [];
        _.each(App.kegeratorTypes,function(kegerator){
            options.push({value: kegerator.id, name: kegerator.name});
        });

        var templateMap = {options: options, selected_id: false};
        return Template.select_options(templateMap);
    },
    'actual_venue': function(){
        var venue = Venues.findOne(this.venue_id);
        if( !venue )
            return '';

        return ' <span class="label">Name:</span> <b>'+venue.name+'</b><br/>'+
                '<span class="label">Address:</span> <b>'+venue.address+'</b><br/>' +
                '<span class="label">Kegs count:</span> <b>'+venue.getKegs().count()+' keg(s)</b><br/>' +
                '<span class="label">Kegerators:</span> <b>'+venue.getKegerators().count()+' kegerators ('+venue.getKegeratorTaps()+' taps)</b>';
    }
});