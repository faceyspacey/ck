KegModel = function(doc){
    var defaultValues = {
        collectionName: 'Kegs',
        _id: '',
        flavor_id: 'random',
        user_id: '',
        venue_id: '',
        paymentCycle: 'weekly',
        paymentDay: 'monday',
        oddEven: oddEvenWeek(),
        type_id: 1,
        price: 120,
        createdAt: 0,
        updatedAt: 0
    };
    this.errors = {};

    this.save = function(attributes){	
        if( this._id ) Kegs.update(this._id, {$set: this.getObjectValues(attributes, true)});
        else {
            var id = '';
            if(id = Kegs.insert(this.getObjectValues(attributes, true))) this._id = id;
        }
        return this._id;
    }

    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    }

    this.venue = function(){
        return Venues.findOne(this.venue_id);
    }

    this.isRandom = function(){
        return this.flavor_id == 'random';
    }

    this.flavor = function(){
        return Flavors.findOne(this.flavor_id);
    }

    this.flavorIcon = function(){
        return Flavors.findOne(this.flavor_id).icon;
    }

    this.icon = function(){
        return Flavors.findOne(this.flavor_id).kegIcon;
    }

    this.chargePeriod = function(){
        return this.paymentCycle + '-' + this.paymentDay;
    }

    this.chargePeriodName = function(){
        return this.getPaymentCycle().name + ' on ' + this.getPaymentDay().name;
    }

    this.getPaymentCycle = function(){
        return _.findWhere(App.paymentCycles, {id: this.paymentCycle});
    }
    this.getPaymentDay = function(){
        return _.findWhere(App.paymentDays, {id: this.paymentDay});
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
