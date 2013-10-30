/** mobile_toolbar HELPERS, EVENTS & CALLBACKS **/

Template.mobile_toolbar.helpers({
	pageTitle: function() { 
		if(Session.get('step_type') == undefined || Session.get('slide_step') == undefined) return 'Conscious Kombucha';
		
		var pageTitle = stepTypes[Session.get('step_type')][Session.get('slide_step')].title;
		
		if(pageTitle == 'Venue Name') return currentVenue() ? currentVenue().address : 'Conscious Kombucha';
		
		return pageTitle + ' ' + (Session.get('title_add_on') || '');
	},
	showBackButton: function() {
		return Session.get('slide_step') != 0 && Session.get('slide_step') != 4; //4 = payment step on signup (no other sequences have a 4)
	},
	showMenuButton: function() {
		return Session.get('slide_step') == 0 && Session.get('step_type') != 'signup';
	},
	showAddButton: function() {
		return _.contains([
				'slide_my_kegs'
			], currentTemplate());
	}
});

sidebarShown = false;
Template.mobile_toolbar.events({
	'mouseup .toolbar-back': function() {
		Session.set('title_add_on', null);
		prevPage();
	},
	'mouseup .toolbar-menu': function() {
		if(!sidebarShown) {
			$('#mobile_content_container').hardwareAnimate({translateX: $('#mobile_container').width() - 65}, 300, 'easeOutExpo');
			sidebarShown = true;
		}
		else {
			$('#mobile_content_container').hardwareAnimate({translateX: $('#mobile_container').width() * -1 + 65}, 300, 'easeOutExpo');
			sidebarShown = false;
		}
	},
	'mouseup .toolbar-add': function() {
		Session.set('step_type', 'panel_add_keg');
		Session.set('current_keg_id', null);
		nextPage();
	},
	'mousedown .toolbar-button, touchstart .toolbar-button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'mouseup .toolbar-button, touchend .toolbar-button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});

/**
Template.mobile_toolbar.created = function() {
	Session.set('step_type', 'signup');
	Session.set('slide_step', 0);
};
**/