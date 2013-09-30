
InvoiceModel = function(doc){
    var defaultValues = {
        _id: '',
        user_id: '',
        amount: 0,
        status: 0,
        createdAt: 0,
    };
    this.errors = {};

    this.save = function(attributes){
        if( this._id ){
            Invoices.update(this._id, {$set: this.getObjectValues(attributes, true)});
        }else{
            var id = '';
            if( id = Invoices.insert(this.getObjectValues(attributes, true)) ){
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
