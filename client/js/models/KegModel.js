
KegModel = function(doc){
    var _id = '',
        flavor_id = '',
        user_id = '',
        venue_id = '',
        paymentCycle = 'weekly',
        paymentDay = 'monday',
        createdAt = 0,
        updatedAt = 0;
    var modelAttributes = [
        '_id',
        'falvor_id',
        'user_id',
        'venue_id',
        'paymentCycle',
        'paymentDay',
        'createdAt',
        'updatedAt'
    ];
    var requiredAttrs = ['flavor_id', 'venue_id', 'user_id'];
    this.errors = {};

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
    };

    _.extend(this, doc);

    return this;
};
