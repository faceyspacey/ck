Template.slide_admin.events({
	'click #slide_admin_delivery_subscription_monday': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_admin_delivery_subscription_monday');
		if(!mobileScrolling) nextPage();
	},
	'click #slide_admin_delivery_subscription_thursday': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_admin_delivery_subscription_thursday');
		if(!mobileScrolling) nextPage();
	},
	'click #slide_admin_delivery_one_time': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_admin_delivery_one_time');
		if(!mobileScrolling) nextPage();
	},
	'click #slide_admin_delivery_upgrades': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_admin_delivery_upgrades');
		if(!mobileScrolling) nextPage();
	},
	'click #slide_admin_delivery_brewing_todo': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_admin_delivery_brewing_todo');
		if(!mobileScrolling) nextPage();
	},
	'click #slide_admin_unpaid_offline_invoices': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_admin_unpaid_offline_invoices');
		nextPage();
	},
	'click #slide_admin_deliquent_card_accounts': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_admin_deliquent_card_accounts');
		if(!mobileScrolling) nextPage();
	},
	'click #slide_admin_brewing_instructions': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_admin_brewing_instructions');
		if(!mobileScrolling) nextPage();
	},
	'click #slide_admin_how_to': function() {
		if(!mobileScrolling) Session.set('step_type', 'panel_admin_how_to');
		if(!mobileScrolling) nextPage();
	},
	'mousedown li, touchstart li': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup li, touchend li': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});


