stepTypes = {
	guest_home: [
		{template: 'slide_venue_info', title: 'Add Your Venue'}, 
	],
	guest_slides: [
	
	],
	panel_admin: [
		{template: 'slide_home', title: 'Venue Name'}, 
		{template: 'slide_admin', title: 'CK Admin'}
	],
	panel_admin_delivery_subscription_monday: [
		{template: 'slide_home', title: 'Venue Name'}, 
		{template: 'slide_admin', title: 'Conscious Kombucha'}, 
		{template: 'slide_admin_delivery_subscription_monday', title: 'Monday'}
	],
	panel_admin_delivery_subscription_thursday: [
		{template: 'slide_home', title: 'Venue Name'}, 
		{template: 'slide_admin', title: 'Conscious Kombucha'}, 
		{template: 'slide_admin_delivery_subscription_thursday', title: 'Thursday'}
	],
	panel_admin_delivery_one_time: [
		{template: 'slide_home', title: 'Venue Name'}, 
		{template: 'slide_admin', title: 'Conscious Kombucha'}, 
		{template: 'slide_admin_delivery_one_time', title: 'One Time Orders'}
	],
	panel_admin_delivery_upgrades: [
		{template: 'slide_home', title: 'Venue Name'}, 
		{template: 'slide_admin', title: 'Conscious Kombucha'}, 
		{template: 'slide_admin_delivery_upgrades', title: 'Upgrades'},
	],
	panel_admin_delivery_brewing_todo: [
		{template: 'slide_home', title: 'Venue Name'}, 
		{template: 'slide_admin', title: 'Conscious Kombucha'}, 
		{template: 'slide_admin_brewing_todo', title: 'Brewing To Do'}
	],
	panel_admin_unpaid_offline_invoices: [
		{template: 'slide_home', title: 'Venue Name'}, 
		{template: 'slide_admin', title: 'Conscious Kombucha'}, 
		{template: 'slide_admin_unpaid_offline_invoices', title: 'Conscious Kombucha'}
	],
	panel_admin_deliquent_card_accounts: [
		{template: 'slide_home', title: 'Venue Name'}, 
		{template: 'slide_admin', title: 'Conscious Kombucha'}, 
		{template: 'slide_admin_deliquent_card_accounts', title: 'Conscious Kombucha'}
	],
	
	signup: [
		{template: 'slide_venue_info', title: 'Add Your Venue'}, 
		{template: 'slide_flavors', title: 'Select a Flavor'},
		{template: 'slide_cycle_day', title: 'Delivery Times'}, 
		{template: 'slide_user_info', title: 'Signup Info'}, 
		{template: 'slide_billing_info', title: 'Pay'} 
	],
	panel: [
		{template: 'slide_home', title: 'Venue Name'}
	],
	panel_my_orders: [
		{template: 'slide_home', title: 'Venue Name'},
		{template: 'slide_my_orders', title: 'My Orders'},
		{template: 'slide_order', title: 'Order'},
	],
	panel_my_keg_subscriptions: [
		{template: 'slide_home', title: 'Venue Name'},
		{template: 'slide_my_kegs', title: 'My Kegs'}, 
		{template: 'slide_cycle_day', title: 'Delivery Times'}
	],
		panel_add_keg: [
			{template: 'slide_home', title: 'Venue Name'},
			{template: 'slide_my_kegs', title: 'My Kegs'}, 
			{template: 'slide_flavors', title: 'Select a Flavor'},
			{template: 'slide_cycle_day', title: 'Delivery Times'}
		],
	panel_support: [
		{template: 'slide_home', title: 'Venue Name'},
		{template: 'slide_support', title: 'Contact Us'}
	],
	panel_one_time_order: [
		{template: 'slide_home', title: 'Venue Name'},
		{template: 'slide_flavors', title: 'Select a Flavor'},
		{template: 'slide_one_time_order', title: 'Finalize Order'},
	],
	panel_update_info: [
		{template: 'slide_home', title: 'Venue Name'},
		{template: 'slide_update_info', title: 'Update Info'}
	],
		panel_edit_basic_info: [
			{template: 'slide_home', title: 'Venue Name'},
			{template: 'slide_update_info', title: 'Update Info'},
			{template: 'slide_edit_basic_info', title: 'Edit Info'}
		],
		panel_edit_billing_info: [
			{template: 'slide_home', title: 'Venue Name'},
			{template: 'slide_update_info', title: 'Update Info'},
			{template: 'slide_billing_info', title: 'Billing Info'}
		],
		panel_change_password: [
			{template: 'slide_home', title: 'Venue Name'},
			{template: 'slide_update_info', title: 'Update Info'},
			{template: 'slide_change_password', title: 'Change Password'}
		],
	panel_request_upgrades: [
		{template: 'slide_home', title: 'Venue Name'},
		{template: 'slide_request_upgrades', title: 'Request Upgrades'}
	],
};

currentStep = 0;

getSteps = function() {
	return stepTypes[Session.get('step_type')];
};

getSlideGroupTemplates = function(stepType) {	
	return _.map(stepTypes[stepType], function(slide) {
		return slide.template;
	});
};

currentTemplate = function() {
	console.log(Session.get('step_type'), Session.get('slide_step'))
	return stepTypes[Session.get('step_type')][Session.get('slide_step')].template;
};

incrementStep = function() {
	Session.set('slide_step', ++currentStep);
};

decrementStep = function(stepCount) {
	var stepCount = stepCount || 1;
	currentStep -= stepCount;
	Session.set('slide_step', currentStep);
};

isNextPage = function() {
	return stepTypes[Session.get('step_type')][currentStep + 1] ? true : false;
};

nextPage = function() {
	if(isNextPage()) {
		$('#sliding_page_wrapper').hardwareAnimate({translateX: $('#mobile_container').width() * -1}, 500, 'easeInBack');
		incrementStep();
	}
	else { 
		console.log('no next page');
		Session.set('slide_step', currentStep = 0);
		$('#sliding_page_wrapper').hardwareAnimate({translateX: $('#mobile_container').width() * ($('.mobile_pages').length - 1)}, 600, 'easeInBack');
	}
};

prevPage = function(skipPagesCount) {
	decrementStep(skipPagesCount);
	if(!skipPagesCount)	$('#sliding_page_wrapper').hardwareAnimate({translateX: $('#mobile_container').width()}, 500, 'easeInBack');
	else $('#sliding_page_wrapper').hardwareAnimate({translateX: $('#mobile_container').width() * skipPagesCount}, 600, 'easeInBack');
};

currentVenue = function() {
	return Session.get('current_venue_id') ? Venues.findOne(Session.get('current_venue_id')) : Venues.findOne();
};

currentKeg = function() {
	return Session.get('current_keg_id') ? Kegs.findOne(Session.get('current_keg_id')) : null;
};

currentFlavor = function() {
	return Session.get('current_flavor_id') ? Flavors.findOne(Session.get('current_flavor_id')) : Flavors.findOne();
};

currentInvoice = function() {
	return Session.get('current_invoice_id') ? Invoices.findOne(Session.get('current_invoice_id')) : null;
};

setupSignupForm = function() {
	//setup hover states on buttons for desktop browsers
	$('.toolbar-button, .action_button').live('mouseenter', function() {
	    $(this).css('opacity', .9);	
	}).live('mouseleave', function() {
	    $(this).css('opacity', 1)	
	});
	
	$.fn.placeholder(); //use shim to make placeholder input attributes work in older browsers :) :) :)
	resizeable.resizeAllElements(); //prepare the slider wrapper to have the sub pages floated left and fitting properly
};

Function.prototype.duplicate = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for( key in this ) {
        temp[key] = this[key];
    }
    return temp;
};

applyAllScrolls = function() {
	console.log('apply all scrolls');
	for(name in Template) {
		if(name.substring(0,6) == 'slide_') { //loop through all slide_ templates		
			(function() {
				if(Template[name].rendered != undefined) var oldRendered = Template[name].rendered.duplicate(); //clone original rendered function

				Template[name].rendered = function() {
					var _this = this;
					Meteor.setTimeout(function() {
						setupIscroll(_this); //tack this on after the original rendered function ;)
						if(oldRendered) oldRendered(); //call original rendered function
					}, 0);
				};
			})();	
		}
	}
};


initializeScrolls = _.once(applyAllScrolls);