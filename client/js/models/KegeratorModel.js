
KegeratorModel = function(doc){
    var defaultValues = {
        _id: '',
        //user_id: '',
        venue_id: '',
        taps: 2,
        createdAt: 0,
        updatedAt: 0
    };
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

    this.getObjectValues = function(doc){
        var object = {};

        _.extend(object, defaultValues);

        _.extend(object, doc);

        return object;
    }

    _.extend(this, doc);

    return this;
};
