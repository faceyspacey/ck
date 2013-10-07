Template.flavors.events({
	'click .open-dialog-btn' : function(e) {
		Session.set('flavor_id', 'new_flavor');
    }
});

//I made the edit_flavor_row its own template so that 'this' would refer to the corresponding
//flavor object from the database when searched in an each loop. Look at 'click .edit-flavor-btn' below:
Template.edit_flavor_row.events({
    'click .delete-flavor-btn' : function(e){
        if(confirm('Are you sure you want to delete this flavor?')) Flavors.remove(this._id);
    },
    'click .make-public-btn' : function(e){
        Flavors.update(this._id, {$set: {is_public: true}});
    },
	'click .edit-flavor-btn': function(e) {
		Session.set('flavor_id', this._id);
	},
	'click .increment-quantity': function(e) {
		Flavors.update(this._id, {$inc: {one_off_quantity_availible: 1}});
	},
	'click .decrement-quantity': function(e) {
		Flavors.update(this._id, {$inc: {one_off_quantity_availible: -1}});
	}
});


Template.flavors.flavorsList = function(){
    return Flavors.find({});
};

Template.flavors.notPublic = function(){
	if(!Flavors.findOne(this._id)) return true;
    return Flavors.findOne(this._id).is_public != true;
}



Template.flavors.newFlavorModel = function() {
	//code re-use here, cuz new model is used the same as edit model
	if(Session.get('flavor_id') == 'new_flavor') return new FlavorModel;
	if(Session.get('flavor_id')) return  Flavors.findOne(Session.get('flavor_id'));
	return false; 
}

Template.new_flavor_form.events({
	'click .close-dialog-btn' : function(e){
		Session.set('flavor_id', null);
    },
    'click .add-flavor-btn' : function(e){
		//it would be dope if Meteor had two way form/model bindings so we could just do this.save()
		//google it. they dont have it yet. 
		this.save({
			name: $('#flavorForm_name').val(),
			icon: $('#flavorForm_icon').val(),
			kegIcon: $('#flavorForm_kegIcon').val()
		});
		console.log(this);
		
		Session.set('flavor_id', null);
    },
});