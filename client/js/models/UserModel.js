UserModel = function(doc){
    this.collectionName ='Users';

	this.getEmail = function() {
		return this.emails[0].address;
	};
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};