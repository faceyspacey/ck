
// It's just for trying to do the inheritance

Model = function(){
    var collectionName = '';
    var defaultValues = {
        collectionName: '',
        _id: '',
    };
    this.errors = {};

    this.collection = function(){
        switch(this.collectionName){
            case 'Flavors': return Flavors;
            case 'InvoiceItems': return InvoiceItems;
            case 'Invoices': return Invoices;
            case 'Kegerators': return Kegerators;
            case 'Kegs': return Kegs;
            case 'OrderedFlavors': return OrderedFlavors;
            case 'Users': return Users;
            case 'Venues': return Venues;
        }
    }

    this.save = function(attributes){
        if( this._id ){
            this.collection().update(this._id, {$set: this.getObjectValues(attributes, true)});
        }else{
            var id = '';
            if( id = this.collection().insert(this.getObjectValues(attributes, true)) ){
                this._id = id;
                this.afterSave();
            }
        }
        return this._id;
    }

    this.afterSave = function(){};

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