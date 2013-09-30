
KegeratorModel = function(doc){
    var defaultValues = {
        _id: '',
        user_id: '',
        venue_id: '',
        type_id: 2,
        requestedAt: 0,
        installed: false,
        installedAt: 0
    };

    this.errors = {};

    this.save = function(attributes){
        if( this._id ){
            Kegerators.update(this._id, {$set: this.getObjectValues(attributes, true)});
        }else{
            var id = '';
            if( id = Kegerators.insert(this.getObjectValues(attributes, true)) ){
                this._id = id;
            }
        }
        return this._id;
    }

    this.formattedRequestedAt = function(){
        return App.formatTime(this.requestedAt);
    }
    this.formattedInstalledAt = function(){
        return App.formatTime(this.installedAt);
    }
    this.makeItInstalled = function(){
        this.installed = true;
        this.installedAt = +(new Date());
        this.save();
        this.venue().checkKegeratorRequests();
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

    this.taps = function(){
        var types = App.kegeratorTypes;
        if( !this.type_id || (typeof types[this.type_id] == 'undefined') )
            return 0;

        return types[this.type_id].taps;
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
