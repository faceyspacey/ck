/** Matheus, this is the old Router system from the Meteorite package manager.
I don't know if this is how they do it anymore, but feel free to implement your
own way of creating pages **/

//Meteor.users.remove(Meteor.userId());

Meteor.Router.add({
	'/': function() {
		Session.set('page', 'home');
		return 'page_home';
	},
    '/flavors': function() {
        Session.set('page', 'flavors');
        return 'page_flavors';
    },
    '/venues': function() {
        Session.set('page', 'venues');
        return 'page_venues';
    },
    '/venue/:id': function(id) {
        // access parameters in order a function args too
        Session.set('currentVenueId', id);
        return 'page_venue';
    }
    /*'/:page': function(page) {
        Session.set('page', page);
        console.log(page);
        return 'page_'+page;
    },*/
});

Meteor.subscribe('allUsers');