Template.slide_admin_delivery_upgrades.helpers({
	venues: function(){
	    return Venues.find({}, {sort: {kegerator_request_date: -1, tap_request_date: -1, materials_supplied_date: -1,}});
	}
});


Template.slide_admin_delivery_upgrades.events({
	'click li .action_button': function(e) {
		if(!mobileScrolling) {
	        if(confirm('Are all ordered items delivered to this venue? ('+this.name+')')) {
				iScrollElementsDontDestroy['delivery_upgrades'] = true;
			console.log(this._id);
				if(!this.kegeratorInstalled()) Venues.update(this._id, {$set: {kegerator_install_date: new Date}, $inc: {kegerator_count: 1}});
				if(!this.tapInstalled()) Venues.update(this._id, {$set: {tap_install_date: new Date}, $inc: {tap_count: 1}});
				if(!this.materialsSupplied()) Venues.update(this._id, {$set: {materials_supplied_date: new Date}});
			}
		}
	},
	'mousedown .action_button, touchstart .action_button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup .action_button, touchend .action_button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});

