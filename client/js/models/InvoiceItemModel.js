InvoiceItemModel = function(doc) {
	this.collectionName ='InvoiceItems';
    this.defaultValues = {};

    this.user = function(){
        if( !this.user_id )
            return false;

        return Meteor.users.findOne(this.user_id);
    }

    this.flavor = function(){
        var flavor = Flavors.findOne(this.flavor_id);
        if( !flavor )
            return {};

        return flavor;
    }

	_.extend(this, Model);
	this.extend(doc);

    return this;
};
