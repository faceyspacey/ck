/** page_flavors HELPERS, EVENTS & CALLBACKS **/

Template.page_flavors.helpers({
	flavors: function(){
	    return Flavors.find({});
	},
	model: function() {
		if(Session.get('flavor_id') == 'new_flavor') return new FlavorModel;
		if(Session.get('flavor_id')) return  Flavors.findOne(Session.get('flavor_id'));
		return false; 
	}
});

Template.page_flavors.events({
	'click .open-dialog-btn' : function(e) {
		Session.set('flavor_id', 'new_flavor');
    }
});


/** flavor_grid_row HELPERS, EVENTS & CALLBACKS **/

Template.flavor_grid_row.helpers({
	notPublic: function(){
		if(!Flavors.findOne(this._id)) return true;
	    return Flavors.findOne(this._id).is_public != true;
	}
});

Template.flavor_grid_row.events({
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
		Flavors.update(this._id, {$inc: {one_off_quantity_available: 1}});
	},
	'click .decrement-quantity': function(e) {
		Flavors.update(this._id, {$inc: {one_off_quantity_available: -1}});
	}
});



/** flavor_form HELPERS, EVENTS & CALLBACKS **/

Template.flavor_form.events({
	'click .close-dialog-btn' : function(e) {
		Session.set('flavor_id', null);
    },
    'click .add-flavor-btn' : function(e) { 
		this.save({
			name: $('#flavorForm_name').val(),
			icon: $('#flavorForm_icon').val(),
			keg_icon: $('#flavorForm_kegIcon').val()
		});
		
		Session.set('flavor_id', null);
    },
});