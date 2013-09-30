
Template.venueKegerators.kegsInKegerators = function(){
    var venue = Venues.findOne(this.venue_id);
    if( !venue )
        return false;

    var kegs = venue.getKegs();
    var kegsCount = kegs.count();
    var kegerators = venue.getKegerators();
    var kegeratorTaps = venue.getKegeratorTaps();

}