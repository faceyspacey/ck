/** page_request_kegerator HELPERS, EVENTS & CALLBACKS **/

Template.page_request_kegerator.helpers({
	kegsInKegerators: function(){
	    var venue = Venues.findOne(this.venue_id),
			kegs = venue.getKegs(),
			kegsCount = kegs.count(),
			kegerators = venue.getKegerators(),
			kegeratorTaps = venue.getKegeratorTaps();
	},
	venueDropDown: function(){
        var options = [];
        Venues.find({user_id: Meteor.userId()}, {sort: {name: 1}}).forEach(function(venue){
            options.push({value: venue._id, name: venue.name});
        });

        return Template.select_options({options: options, selected_id: this.venue_id});
    },
    typeDropDown: function(){
        var options = [];
        _.each(App.kegeratorTypes,function(kegerator){
            options.push({value: kegerator.id, name: kegerator.name});
        });

        var templateMap = {options: options, selected_id: false};
        return Template.select_options(templateMap);
    },
    actual_venue: function(){
        var venue = Venues.findOne(this.venue_id);

        return ' <span class="label">Name:</span> <b>'+venue.name+'</b><br/>'+
                '<span class="label">Address:</span> <b>'+venue.address+'</b><br/>' +
                '<span class="label">Kegs count:</span> <b>'+venue.getKegs().count()+' keg(s)</b><br/>' +
                '<span class="label">Kegerators:</span> <b>'+venue.getKegerators().count()+' kegerators ('+venue.getKegeratorTaps()+' taps)</b>';
    }
});

Template.page_request_kegerator.events({
    'click #request-kegerator-btn': function(){
        var request = {
            venue_id: this.venue_id ? this.venue_id : document.getElementById('kegeratorForm_venue_id').value,
            type_id: document.getElementById('kegeratorForm_type_id').value,
        }

        var comment = document.getElementById('kegeratorForm_comment').value;
        var venue = Venues.findOne(request.venue_id);

        if(venue){
            var kegerator = new KegeratorModel(request);
            var id = kegerator.save();

            if( venue.need_kegerator != true ){
                venue.save({
                    need_kegerator: true,
                    kegeRequestedAt: +(new Date)
                });
            }
			else venue.save({need_kegerator: true});
        }
    },
    'change #kegeratorForm_venue_id': function(){
        this.venueId = document.getElementById('kegeratorForm_venue_id').value;
    }
});


/** select_options HELPERS, EVENTS & CALLBACKS **/

Template.select_options.helpers({
	selected: function(selected_id){
	    return selected_id == this.value ? 'selected' : '';
	}
});