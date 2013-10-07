
VenueModel = function(doc){
    var defaultValues = {
        _id: '',
        user_id: '',
        name: '',
        address: '',
        email: '',
        phone: '',
        facebook: '',
        //kegerators: 0,
        twitter: '',
        need_kegerator: true,
        kegeRequestedAt: 0,
        delivered: true,
        deliveredAt: 0,
        instagram: '',
        youtube: '',
        usedFlavors: '',
        createdAt: 0,
        updatedAt: 0
    };

    //var requiredAttrs = ['name', 'address', 'email'];
    this.errors = {};

    this.save = function(attributes){
        if( this._id ){
            Venues.update(this._id, {$set: this.getObjectValues(attributes, true)});
        }else{
            var id = '';
            if( id = Venues.insert(this.getObjectValues(attributes, true)) ){
                this._id = id;
                this.addAfterSave();
            }
        }
        return this._id;
    }

    this.addAfterSave = function(){
        var kegerator = new KegeratorModel();
        kegerator.save({venue_id: this._id});
    }

    this.user = function(){
        if( !this.user_id )
            return false;

        return Meteor.users.findOne(this.user_id);
    };

    this.getKegs = function(conditions){
        var condition = {};
        _.extend(condition, conditions);
        _.extend(condition, {venue_id: this._id});
        return Kegs.find(condition);
    };

    this.getKegerators = function(options){
        var defOptions = {venue_id: this._id};
        _.extend(defOptions, options);
        return Kegerators.find(defOptions);
    };
    this.getKegeratorTaps = function(){
        var taps = 0;
        Kegerators.find({venue_id: this._id}).forEach(function(kegerator){
            taps += kegerator.taps();
        });

        return taps;
    };

    this.installedKegerators = function(){
        return this.getKegerators({installed: true});
    };
    this.kegeratorsToInstall = function(){
        return this.getKegerators({installed: {$not: true}});
    };

    this.checkKegeratorRequests = function(){
        if( this.kegeratorsToInstall().count() ){
            this.need_kegerator = true;
        }else{
            this.need_kegerator = false;
            this.kegeRequestedAt = 0;
        }
        this.save();
    }

    this.makeDelivered = function(){
        this.delivered = true;
        var d = new Date();
        this.deliveredAt = d.toUTC();
        this.save();
    }

    this.readyToDeliver = function(){
        this.delivered = false;
        this.deliveredAt = 0;
        this.save();
    }

    this.formattedDeliveredAt = function(){
        if( !this.deliveredAt )
            return '-';

        // time calculated in Californian time
        var caliTime = App.calcTime(this.deliveredAt, -8);

        var date = App.checkTime(caliTime.getDate());
        var month = App.checkTime(caliTime.getMonth() + 1);
        var year = caliTime.getFullYear();
        var hour = Math.abs(caliTime.getHours()-12);
        var min = App.checkTime(caliTime.getMinutes());
        var signal = caliTime.getHours() >= 12 ? 'pm' : 'am';

        return year +'-'+ month +'-'+ date +' '+ hour +':'+ min + signal;
    }

    this.getRareFlavorToday = function(id, day){
        var venue = id ? Venues.findOne(id) : Venues.findOne(this._id);
        if( !venue ) return [];

        var currentWeek = oddEvenWeek();
        var currentDay = day ? day : getWeekDay();
        var condition = {$or: [
            {paymentCycle: 'bi-weekly', oddEven: currentWeek, paymentDay: currentDay},
            {paymentCycle: 'weekly', paymentDay: currentDay},
        ]};

        if( !(venue.getKegs(condition).count() > 0) )
            return [{name: 'No kegs for '+currentDay, icon: ''}];

        var flavors = _.countBy(venue.getKegs(condition).fetch(), function(keg) {
            return keg.flavor_id;
        });
        var flavorKeys = _.keys(flavors);

        _.each(Flavors.find({_id: {$nin: flavorKeys}}).fetch(), function(flavor) {
            flavors[flavor._id] = 0;
        });

        var min = App.minOfAssociative(flavors, true);
        return Flavors.find({_id: {$in: min.keys}});
    }

    this.addKeg = function(attributes){
        if( typeof attributes == 'undefined' )
            return;


        attributes.flavor_id = this.getHalfRandomFlavor();
        attributes = (new KegModel()).getObjectValues(attributes);
        delete attributes._id;

        var keg = new KegModel(attributes);
        var keg_id = keg.save();

       // Kegs.update(kegId, {$set: attributes});

        this.updateUsedFlavors();

        return keg_id;
    };

    this.updateKeg = function(keg_id, attributes){
        if( typeof keg_id == 'undefined' || typeof attributes == 'undefined' )
            return;

		//add bi-weekly oddEven week, but only the first time that the keg is made bi-weekly
		if(attributes.paymentCycle == 'bi-weekly' && Kegs.findOne(keg_id).paymentCycle != 'bi-weekly') attributes.oddEven = oddEvenWeek();
		
        Kegs.update(keg_id, {$set: attributes});

        this.updateUsedFlavors();

        return true;
    }

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

        var flavors = _.countBy(venue.getKegs().fetch(), function(keg) {
            return keg.flavor_id;
        });
        var flavorKeys = _.keys(flavors);

        _.each(Flavors.find({_id: {$nin: flavorKeys}}).fetch(), function(flavor) {
            flavors[flavor._id] = 0;
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

    }

    /*
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
    }*/

    this.getKegCharges = function(){
        var venue = this;

        var charging = {};
        _.each(App.paymentCycles, function(cycle){
            charging[cycle.id] = {
                name: cycle.name,
                count: venue.getKegs({paymentCycle: cycle.id}).count(),
                total: _.reduce(_.pluck(venue.getKegs({paymentCycle: cycle.id}).fetch(), 'price'), function(memo, num){ return memo + num; }, 0),
                cycles: (function(cycle){
                    var cycles = {};
                    _.each(App.paymentDays, function(day){
                        cycles[cycle.id+'-'+day.id] = {
                            name: cycle.name+' on '+day.name,
                            count: venue.getKegs({paymentCycle: cycle.id, paymentDay: day.id}).count(),
                            total:  _.reduce(_.pluck(venue.getKegs({paymentCycle: cycle.id, paymentDay: day.id}).fetch(), 'price'), function(memo, num){ return memo + num; }, 0),
                            flavors: (function(cycle, day){
                                var flavors = {};
                                _.each(venue.getKegs({paymentCycle: cycle.id, paymentDay: day.id}).fetch(), function(keg){
                                    if( typeof flavors[keg.flavor_id] == 'undefined' ){
                                        flavors[keg.flavor_id] = {
                                            icon: keg.flavor().icon,
                                            name: keg.flavor().name,
                                            count: venue.getKegs({paymentCycle: cycle.id, paymentDay: day.id, flavor_id: keg.flavor_id}).count(),
                                            total: _.reduce(_.pluck(venue.getKegs({paymentCycle: cycle.id, paymentDay: day.id, flavor_id: keg.flavor_id}).fetch(), 'price'), function(memo, num){ return memo + num; }, 0),
                                        }
                                    }
                                });
                                return flavors;
                            })(cycle, day),
                        };
                    });
                    return cycles;
                })(cycle),
            };
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


    this.getObjectValues = function(doc, withOutId){
        if( typeof doc == 'undefined' )
            doc = {};

        var object = {};

        _.extend(object, defaultValues);

        for(i in defaultValues){
            if( typeof this[i] != 'undefined' )
                object[i] = this[i];
        }

        _.extend(object, doc);

        if( withOutId == true )
            delete object._id;

        return object;
    }

    _.extend(this, this.getObjectValues(doc));

    return this;
};