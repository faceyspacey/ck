Meteor.Router.add({
	'/': function() {
		Session.set('page', 'home');
		return 'page_home'
	},
	'/:page': function(page) {
		Session.set('page', page);
		return 'page_'+page;
	},
});

Meteor.subscribe('allUsers');