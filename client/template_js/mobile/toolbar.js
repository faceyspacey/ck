/** mobile_toolbar HELPERS, EVENTS & CALLBACKS **/

Template.mobile_toolbar.helpers({
	pageTitle: function() { 
		console.log('pageTitle', Session.get('step_type'), Session.get('slide_step'));
		var pageTitle = stepTypes[Session.get('step_type')][Session.get('slide_step')].title;
		if(pageTitle == 'Venue Name') return currentVenue().address;
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
	'mouseup .toolbar-back, tap .toolbar-back': function() {
		Session.set('title_add_on', null);
		prevPage();
	},
	'mouseup .toolbar-menu, tap .toolbar-menu': function() {
		if(!sidebarShown) {
			$('#mobile_content_container').hardwareAnimate({translateX: $('#mobile_container').width() - 100}, 300, 'easeOutExpo');
			sidebarShown = true;
		}
		else {
			$('#mobile_content_container').hardwareAnimate({translateX: $('#mobile_container').width() * -1 + 100}, 300, 'easeOutExpo');
			sidebarShown = false;
		}
	},
	'mouseup .toolbar-add, tap .toolbar-add': function() {
		Session.set('step_type', 'panel_add_keg');
		Session.set('current_keg_id', null);
		nextPage();
	}
});

Template.mobile_toolbar.created = function() {
	Session.set('step_type', 'signup');
	Session.set('slide_step', 0);
};

