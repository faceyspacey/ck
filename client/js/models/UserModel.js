UserModel = function(doc){
    this.collectionName = 'Users';

	this.getEmail = function() {
		return this.emails[0].address;
	};

    this.getAvatar = function(){
        return this.profile && this.profile.avatar ? this.profile.avatar : '/images/default-avatar.jpg';
    }
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};