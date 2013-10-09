UserModel = function(doc){
    this.collectionName ='Users';

    _.extend(this, Model);
	this.extend(doc);

    return this;
};