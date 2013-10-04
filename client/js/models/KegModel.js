
KegModel = function(doc){
    var defaultValues = {
        _id: '',
        flavor_id: '',
        user_id: '',
        venue_id: '',
        paymentCycle: 'weekly',
        paymentDay: 'monday',
        oddEven: oddEvenWeek(),
        type_id: 1,
        createdAt: 0,
        updatedAt: 0
    };
    this.errors = {};

    this.save = function(attributes){	
        if( this._id ){
            Kegs.update(this._id, {$set: this.getObjectValues(attributes, true)});
        }else{
            console.log(this.getObjectValues(attributes, true));
            var id = '';
            if( id = Kegs.insert(this.getObjectValues(attributes, true)) ){
                this._id = id;
            }
        }
        return this._id;
    }

    this.user = function(){
        if( !this.user_id )
            return false;

        return Meteor.users.findOne(this.user_id);
    }

    this.venue = function(){
        if( !this.venue_id )
            return false;

        return Venues.findOne(this.venue_id);
    }

    this.price = function(){
        return App.getKegPrice(this.type_id);
    }

    this.flavor = function(){
        var flavor = Flavors.findOne(this.flavor_id);
        if( !flavor )
            return {};

        return flavor;
    }

    this.flavorIcon = function(){
        var flavor = Flavors.findOne(this.flavor_id);
        if( !flavor )
            return '';

        return flavor.icon;
    }

    this.icon = function(){
        var flavor = Flavors.findOne(this.flavor_id);
        if( !flavor )
            return '';

        return flavor.kegIcon;
    }

    this.chargePeriod = function(){
        return this.paymentCycle + '-' + this.paymentDay;
    }

    this.cycleRadios = function(){
        var radios = '';
        for(var i = 0; i < App.paymentCycles.length; i++){
            radios += i > 0 ? '<br />' : '';
            radios += '<input type="radio" class="radio-cycle" name="'+this._id+'_cycle" '+(App.paymentCycles[i].id == this.paymentCycle ? 'checked="checked"' : '')+' value="'+App.paymentCycles[i].id+'">'+App.paymentCycles[i].name
        }
        return radios;
    }

    this.dayRadios = function(){
        var radios = '';
        for(var i = 0; i < App.paymentDays.length; i++){
            radios += i > 0 ? '<br />' : '';
            radios += '<input type="radio" class="radio-day" name="'+this._id+'_day" '+(App.paymentDays[i].id == this.paymentDay ? 'checked="checked"' : '')+' value="'+App.paymentDays[i].id+'">'+App.paymentDays[i].name
        }
        return radios;
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
