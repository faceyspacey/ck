
Template.keg_charges_table.kegCharges = function(venue){

    var array = [];
    var charges = this.getKegCharges();
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

Template.keg_charges_table.events({
    'click .keg-charges-cycle-total': function(event){
        var cycleBox = $(event.toElement).parents().filter('.keg-charges-cycle');
        $(cycleBox).toggleClass('closed');
        //console.log(cycleBox);
    }
});