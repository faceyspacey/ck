
UserModel = function(doc){
    var defaultValues = {
        collectionName: 'Users',
    };
    this.errors = {};

    this.save = function(attributes){
        if( this._id ) Meteor.users.update(this._id, {$set: this.getObjectValues(attributes, true)});
        else {
            var id = '';
            if(id = Meteor.users.insert(this.getObjectValues(attributes, true))) this._id = id;
        }
        return this._id;
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