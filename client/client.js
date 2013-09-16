/** Matheus, this is the old Router system from the Meteorite package manager.
I don't know if this is how they do it anymore, but feel free to implement your
own way of creating pages **/

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