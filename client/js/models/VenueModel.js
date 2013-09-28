
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
        status_id = 0,
        usedFlavors = [],
        kegerators = [],
        kegs = [], //['mcFT3z9ECqyPthdHf', 'jtRGkxMp6g8E8vZtb'],
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
        'kegerators',
        'kegs',
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
        attributes.paymentCycle = 'weekly';
        attributes.paymentDay = 'monday';
        var kegId = Kegs.insert(attributes);

        this.updateUsedFlavors();

        return kegId;
    };

    this.updateKeg = function(kegId, attributes){
        if( typeof kegId == 'undefined' || typeof attributes == 'undefined' )
            return;

        Kegs.update(kegId, {$set: attributes});

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

    this.renderKegCharges = function(){
        return '';
        var user = Meteor.users.findOne(this.user_id);
        if( !user )
            return '';
        var paymentCycle = App.getPaymentCycle(user.profile.paymentCycle);

        var html = '<div class="keg-charges-container">' +
                        '<h3 class="subtitle" style="border-bottom: 1px solid #c7c7c7; padding-bottom: 15px;">Weekly charges of venue</h3>';
        for(var i = 0; i < this.kegerators.length; i++){
            html += '<div class="keg-charges-keg-row">';
            html +=     '<div class="keg-charges-keg-row-subtotal">Kegerator subtotal: <b><span class="keg-charge" style="margin-right: 10px;">$'+((138 - 10*this.kegerators[i].tapsCount) * this.kegerators[i].tapsCount) +'</span></b></div>';
            for(var c = 0; c < this.kegerators[i].taps.length; c++){
                var flavor = Flavors.findOne(this.kegerators[i].taps[c].flavor);
                var numText = c+1 == 1 ? '1st' : (c+1 == 2 ? '2nd' : '3rd');
                html += '<div class="keg-charges-tap-row">' +
                            '<div class="keg-charges-tap-row-label">'+numText+' tap:</div>'+ '<img class="keg-charges-tap-row-icon tap-row-icon" src="'+flavor.icon+'" />' + flavor.name +
                            '<span class="keg-charge">$'+(138 - 10*this.kegerators[i].tapsCount)+'</span>' +
                        '</div>';
            }
            html += '</div>';
        }
        var sum = this.summarizedCost();
        html +=     '<div class="keg-charges-total">Weekly charge: ' +
                        '<span class="keg-charge">$'+sum+'</span>' +
                    '</div>' +
                    '<div class="keg-charges-total">Total: ' +
                        '<span style="font-weight: normal; font-size: 14px;">(Charged on every '+paymentCycle.text1+')</span> ' +
                        '<span class="keg-charge">' + paymentCycle.multiplier + ' &times; $'+ sum +' = $'+(paymentCycle.multiplier*sum)+'</span>' +
                    '</div>' +
                '</div>';

        return html;
    }

    /*
    this.setAttributes = function(doc){
        for(i = 0; i < modelAttributes.length; i++){
            var attr = modelAttributes[i];
            if( typeof doc[attr] == 'undefined' )
                continue;

            if( requiredAttrs.indexOf(attr) != -1 ){
                if( !doc[attr].length )
                    this.errors[attr] = 'Can not be blank.';
            }

            this[attr] = doc[attr];
        }
    };*/

    _.extend(this, doc);
};