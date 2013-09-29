
VenueModel = function(doc){
    var _id = '',
        user_id = '',
        name = '',
        address = '',
        email = '',
        phone = '',
        facebook = '',
        twitter = '',
        instagram = '',
        youtube = '',
        usedFlavors = [],
        //kegs = [],
        createdAt = 0,
        updatedAt = 0;
    var modelAttributes = [
        '_id',
        'user_id',
        'name',
        'address',
        'email',
        'phone',
        'facebook',
        'twitter',
        'instagram',
        'youtube',
        'usedFlavors',
        //'kegs',
        'createdAt',
        'updatedAt'
    ];
    //var requiredAttrs = ['name', 'address', 'email'];
    this.errors = {};

    this.user = function(){
        if( !this.user_id )
            return false;

        return Meteor.users.findOne(this.user_id);
    };

    this.getKegs = function(){
        return Kegs.find({venue_id: this._id});
    };

    this.addKeg = function(attributes){
        if( typeof attributes == 'undefined' )
            return;


        attributes.flavor_id = this.getHalfRandomFlavor();
        attributes = (new KegModel()).getObjectValues(attributes);
        delete attributes._id;

        var keg_id = Kegs.insert(attributes);

       // Kegs.update(kegId, {$set: attributes});

        this.updateUsedFlavors();

        return keg_id;
    };

    this.updateKeg = function(keg_id, attributes){
        if( typeof keg_id == 'undefined' || typeof attributes == 'undefined' )
            return;

        Kegs.update(keg_id, {$set: attributes});

        this.updateUsedFlavors();

        return true;
    }

    /*
    this.setKegs = function(){
        var kegIds = [];
        Kegs.find({venue_id: this._id}).forEach(function(keg){
            kegIds.push(keg._id)
        });

        Venues.update(this._id, {$set: {kegs: kegIds}});

        return kegIds;
    };*/

    this.removeKeg = function(kegId){
        if( typeof kegId == 'undefined' )
            return;

        Kegs.remove(kegId);

        this.updateUsedFlavors();

        return true;
    };

    this.updateUsedFlavors = function(){
        var flavors = [];

        this.getKegs().forEach(function(keg){
            if( flavors.indexOf(keg.flavor_id) < 0 )
                flavors.push(keg.flavor_id);
        });

        Venues.update(this._id, {$set: {usedFlavors: flavors}});

        return flavors;
    };

    this.getHalfRandomFlavor = function(venue){
        if( typeof venue == 'undefined' )
            venue = this;

        var flavors = {};
        var flavorKeys = [];

        this.getKegs().forEach(function(keg){
            if( typeof flavors[keg.flavor_id] != 'undefined' )
                flavors[keg.flavor_id] += 1 ;
            else
                flavors[keg.flavor_id] = 1 ;

            if( flavorKeys.indexOf(keg.flavor_id) == -1 )
                flavorKeys.push(keg.flavor_id);
        });

        Flavors.find({_id: {$nin: flavorKeys}, is_public: true}).forEach(function(nchFlavor){
            if( flavorKeys.indexOf(nchFlavor._id) < 0 )
                flavors[nchFlavor._id] = 0;
        });

        var min = App.minOfAssociative(flavors, true);
        return min.keys[Math.floor((Math.random()*min.keys.length))];
    }

    this.displayKegs = function(){

        var kegsHtml = '<div class="venue-kegs-container">';
        var flavors = [];
        var flavorsArray = []
        var fees = 0;
        this.getKegs().forEach(function(keg){
            kegsHtml +=     '<div class="table-keg-div">' +
                                '<div class="table-keg-flavor-div" style="background-image:url('+keg.flavorIcon()+');"></div>' +
                                '<b>'+keg.flavor().name + '</b> keg: <span class="keg-fee"><b>$120</b> '+keg.paymentCycle+'/'+keg.paymentDay+'</span>' +
                            '</div>';
            fees += 120;
        });
        kegsHtml +=     '</div>';

        return kegsHtml;
/*
         var fees = venue.kegerators[i].tapsCount == 1 ? 128 : (venue.kegerators[i].tapsCount == 2 ? 118 : 108);
        var kegsHtml = '<div class="venue-kegs-container">';
        var flavor;
        this.getKegsByCycles().forEach(function(keg){
            kegsHtml += '<div class="table-keg-flavor-div" style="background-image:url('+keg.flavorIcon()+');"></div>';
        });

        for(var i = 0; i < venue.kegerators.length; i++){
            var fees = venue.kegerators[i].tapsCount == 1 ? 128 : (venue.kegerators[i].tapsCount == 2 ? 118 : 108);
            kegsHtml += '<div class="table-kegerator-div"> '+venue.kegerators[i].tapsCount+' tap(s): ';
            for(var c = 0; c < venue.kegerators[i].taps.length; c++){
                flavor = Flavors.findOne(venue.kegerators[i].taps[c].flavor);
                kegsHtml += '<div class="table-kegerator-flavor-div" style="background-image:url(\''+(flavor ? flavor.icon : '') +'\');"></div>';
            }
            kegsHtml += '<div style="font-size: 12px;">'+venue.kegerators[i].tapsCount+' &times; $'+fees+' = <b>$'+ (fees*venue.kegerators[i].tapsCount) +'</b>/week</div>';
            kegsHtml += '</div>';
        }

        return kegsHtml;*/
    }

    this.summarizedCost = function(multiplier){
        return '';
        //console.log(multiplier);
        var kegerators = this.kegerators;
        var sum = 0;
        if( typeof kegerators != 'undefined' ){
            for(var i = 0; i < kegerators.length; i++){
                sum += (138 - 10*kegerators[i].tapsCount) * kegerators[i].tapsCount;
            }
        }

        if( multiplier )
            return multiplier*sum;
        else
            return sum;
    }

    this.getKegCharges = function(){

        var charging = {};
        _.each(App.paymentCycles, function(cycle){
            charging[cycle.id] = {name: cycle.name, count: 0, total: 0, cycles: {}};
            _.each(App.paymentDays, function(day){
                charging[cycle.id].cycles[cycle.id+'-'+day.id] = {
                    name: cycle.name+' on '+day.name,
                    count: 0,
                    total: 0,
                    kegs: [],
                    flavors: {}
                };
            });
        });

        this.getKegs().forEach(function(keg){
            var period = keg.chargePeriod();

            if( typeof charging[keg.paymentCycle].cycles[period] == 'undefined' )
                charging[keg.paymentCycle].cycles[period] = {
                    name: keg.paymentCycle+' on '+keg.paymentDay,
                    count: 0,
                    total: 0,
                    kegs: [],
                    flavors: {}
                };

            charging[keg.paymentCycle].total += keg.price();
            charging[keg.paymentCycle].count += 1;
            charging[keg.paymentCycle].cycles[period].count += 1;
            charging[keg.paymentCycle].cycles[period].total += keg.price();
            charging[keg.paymentCycle].cycles[period].kegs.push(keg);

            if( typeof charging[keg.paymentCycle].cycles[period].flavors[keg.flavor_id] == 'undefined' ){
                charging[keg.paymentCycle].cycles[period].flavors[keg.flavor_id] = {
                    icon: keg.flavor().icon,
                    name: keg.flavor().name,
                    count: 1,
                    total: keg.price(),
                }
            }else{
                charging[keg.paymentCycle].cycles[period].flavors[keg.flavor_id].count += 1;
                charging[keg.paymentCycle].cycles[period].flavors[keg.flavor_id].total += keg.price();
            }
        });

        return charging;
    }

    this.renderKegCharges = function(){
        var charging = this.getKegCharges();
        var html = '<div class="keg-charges-container">' +
                        '<h3 class="subtitle" style="margin-bottom: 20px;">Keg Charges</h3>';
        for(var i in charging){
            if( charging[i].total == 0 )
                continue;
            html +=     '<div class="keg-charges-cycle">';
            html +=         '<div class="keg-charges-cycle-total">' +
                                '<div class="keg-charges-cycle-name">' + charging[i].name + '</div>' +
                                '<div class="keg-charges-cycle-count">' + charging[i].count + ' keg(s) </div>' +
                                '<span class="keg-charge">$'+charging[i].total+'</span>' +
                            '</div>';
            for(var c in charging[i].cycles){
                if( charging[i].cycles[c].total == 0 )
                    continue;
                html +=     '<div class="keg-charges-period">';
                html +=         '<div class="keg-charges-period-subtotal">' +
                                    '<div class="keg-charges-period-name">' + charging[i].cycles[c].name + '</div>' +
                                    '<div class="keg-charges-period-count">' + charging[i].cycles[c].count + ' keg(s) </div>' +
                                    '<span class="keg-charge">$'+charging[i].cycles[c].total+'</span>' +
                                '</div>';
                for(var d in charging[i].cycles[c].flavors){
                    html +=     '<div class="keg-charges-flavor-row">' +
                                    '<div class="keg-charges-flavor-icon" style="background-image:url('+charging[i].cycles[c].flavors[d].icon+');"></div>' +
                                    '<div class="keg-charges-flavor-name">' + charging[i].cycles[c].flavors[d].name + '</div>' +
                                    '<div class="keg-charges-flavor-count">' + charging[i].cycles[c].flavors[d].count + ' keg(s) </div>' +
                                    '<span class="keg-charge">$'+charging[i].cycles[c].flavors[d].total+'</span>' +
                                '</div>';
                }
                html +=     '</div>';
            }
            html +=     '</div>';
        }
        html +=     '</div>';

        return html;
    }

    _.extend(this, doc);

    return this;
};