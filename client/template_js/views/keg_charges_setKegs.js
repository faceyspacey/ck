
Template.keg_charges_setKegs.kegCharges = function(){
    var venue = Venues.findOne(this.venue_id);
    if( !venue )
        return '';

    var array = [];
    var charges = venue.getKegCharges();
    console.log( charges );
    for(var i in charges){
        var cyclesArray = [];
        for(var c in charges[i].cycles){
            var flavorsArray = [];
            for(var d in charges[i].cycles[c].flavors){
                flavorsArray.push(charges[i].cycles[c].flavors[d]);
            }
            charges[i].cycles[c].flavors = flavorsArray;
            cyclesArray.push(charges[i].cycles[c]);
        }
        charges[i].cycles = cyclesArray;
        array.push(charges[i]);
    }
    return array;
}