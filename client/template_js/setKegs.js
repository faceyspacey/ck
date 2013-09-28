
Template.setKegs.helpers({
    venue: function() {
        return Venues.findOne(this.venue_id);
    },
    kegs: function(){
        var venue = Venues.findOne(this.venue_id);
        if( !venue )
            return [];

        return venue.getKegs();
    },
    kegerators: function(){
        var venue = Venues.findOne(this.venue_id);
        if( !venue )
            return [];

        var haveMissingFlavor = false;
        if( !venue.usedFlavors ){
            venue.usedFlavors = [];
            haveMissingFlavor = true;
        }
        for(var i = 0; i < venue.usedFlavors.length; i++){
            if( !Flavors.findOne(venue.usedFlavors[i]) ){
                haveMissingFlavor = true;
                break;
            }
        }
        if( haveMissingFlavor ){
            for(var c = 0; c < venue.kegerators.length; c++){
                for(var d = 0; d < venue.kegerators[c].taps.length; d++){
                    if( !Flavors.findOne(venue.kegerators[c].taps[d].flavor) )
                        venue.kegerators[c].taps[d].flavor = App.getHalfRandomFlavor(venue);
                }
            }
        }
        Venues.update(venue._id, {$set: {kegerators: venue.kegerators}});

        return venue ? venue.kegerators : [];
    },
    flavorDropDown: function(flavorId){
        var options = '';

        Flavors.find({is_public: true}).forEach(function(flavor){
            options += '<option value="' + flavor._id + '" ' + (flavorId == flavor._id ? 'selected="selected"' : '') + '>' + flavor.name + '</option>';
        });

        return '<select class="keg-flavor-select">'+options +'</select>';
    },
    renderKegCharges: function(){
        var venue = Venues.findOne(this.venue_id);
        return '';
        if( venue )
            return venue.renderKegCharges();
        else
            return '';
    }
});

Template.setKegs.events({
    'change .keg-flavor-select' : function(event){
        Venues.findOne(this.venue_id).updateKeg(this._id, {flavor_id: event.target.value});
    },
    'change input[type=radio].radio-cycle' : function(event){
        Venues.findOne(this.venue_id).updateKeg(this._id, {paymentCycle: event.target.value});
    },
    'change input[type=radio].radio-day' : function(event){
        Venues.findOne(this.venue_id).updateKeg(this._id, {paymentDay: event.target.value});
    },
    'click .add-keg-btn' : function(){
        var venue = Venues.findOne(this.venue_id);
        if( !Flavors.find({is_public: true}).count() || !venue )
            return;

        venue.addKeg({flavor_id: '', venue_id: this.venue_id});
    },
    'click .remove-keg-btn' : function(){
        if( confirm('Are you sure you want to drop this keg?') )
            Venues.findOne(this.venue_id).removeKeg(this._id);
    }
});