Template.slide_home.events({
	'click #panel_admin_link': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_admin');
		if(!mobileScrolling) nextPage();
	},
	'click #panel_my_orders_link': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_my_orders');
		if(!mobileScrolling) nextPage();
	},
	'click #panel_support_link': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_support');
		if(!mobileScrolling) nextPage();
	},
	'click #panel_my_keg_subscriptions_link': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_my_keg_subscriptions');
		if(!mobileScrolling) nextPage();
	},
	'click #panel_request_upgrades': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_request_upgrades');
		if(!mobileScrolling) nextPage();
	},
	'click #panel_one_time_order_link': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_one_time_order');
		if(!mobileScrolling) nextPage();
	},
	'click #panel_update_info_link': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_update_info');
		nextPage();
	},
	'click #panel_logout_link': function() {
		if(!mobileScrolling) {
			Meteor.logout();
			Meteor.setTimeout(function() {
				Router.go('guest');
			}, 100);
		}
	},
	'mousedown li, touchstart li': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup li, touchend li': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});


