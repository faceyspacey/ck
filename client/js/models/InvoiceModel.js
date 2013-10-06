
InvoiceModel = function(doc){
    var defaultValues = {
        _id: '',
        order_id: '',
        day: '',
        cycle: '',
        user_id: '',
        kegsCount: 0,
        total: 0,
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
        return Meteor.users.findOne(this.user_id);
    }

    this.LineItems = function(options){
        var option = {};
        _.extend(option, options);
        option.invoice_id = this._id;
        return LineItems.find(option);
    }

    this.formattedCreatedAt = function(){
        //date formatting comes here
    }

    this.paymentPeriod = function(){
        // payment period rendering comes here
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
