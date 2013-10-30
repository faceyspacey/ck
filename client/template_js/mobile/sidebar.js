/** mobile_sidebar HELPERS, EVENTS & CALLBACKS **/

Template.mobile_sidebar.helpers({
	venues: function() {
		return Venues.find();
	}
});

Template.mobile_sidebar.events({
	'mouseup #add_venue': function() {
		if(!mobileScrolling) {
			var address = prompt('Please enter the address of your new venue to add it');
			if(address && address != '') {
				$('#mobile_content_container').hardwareAnimate({translateX: $('#mobile_container').width() * -1 + 65}, 300, 'easeOutExpo', function() {
					sidebarShown = false;
					var venueId = Venues.insert({
						name: currentVenue().name,
						address: address,
						email: Meteor.user().emails[0],
					});
					Session.set('current_venue_id', venueId);
				});
			}
		}
	},
	'mouseup li.venue_name': function(e) {
		if(!mobileScrolling) {
				$(e.currentTarget).addClass('touched');
				var _this = this;
				Session.set('current_venue_id', _this._id);
				$('#mobile_content_container').hardwareAnimate({translateX: $('#mobile_container').width() * -1 + 65}, 300, 'easeOutExpo', function() {
					sidebarShown = false;
				});
		}
	},
	'mousedown li, touchstart li': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup li, touchend li': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});

Template.mobile_sidebar.rendered = function() {
	var _this = this;
	Meteor.setTimeout(function() {
		setupIscroll(_this); //tack this on after the original rendered function ;)
	}, 0);
};