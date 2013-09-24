/** Matheus, this is the old Router system from the Meteorite package manager.
I don't know if this is how they do it anymore, but feel free to implement your
own way of creating pages **/

//Meteor.users.remove(Meteor.userId());
if( Roles.userIsInRole(Meteor.userId(), ['admin']) )
    Meteor.subscribe('users');

Meteor.Router.add({
    '/': {
        to: 'home',
        and: function() {
            Session.set('page', 'home');
            return 'page_home';
        }
    },
    '/flavors': {
        to: 'flavors',
        and: function() {
            Session.set('page', 'flavors');
            return 'page_flavors';
        }
    },
    '/contact': {
        to: 'contact',
        and: function() {
            Session.set('page', 'contact');
            return 'page_contact';
        }
    },
    '/clients': {
        to: 'clients',
        and: function() {
            Session.set('page', 'clients');
            return 'page_clients';
        }
    },
    '/admins': {
        to: 'admins',
        and: function() {
            Session.set('page', 'admins');
            return 'page_admins';
        }
    },
    '/venues': {
        to: 'venues',
        and: function() {
            Session.set('page', 'venues');
            return 'page_venues';
        }
    },
    '/allVenues': {
        to: 'allVenues',
        and: function() {
            Session.set('page', 'allVenues');
            return 'page_allVenues';
        }
    },
    '/venue/:id/editFlavors': {
        to: 'editFlavors',
        and: function(id) {
            if( Venues.findOne(id) )
                Meteor.Router.to('/');
            // access parameters in order a function args too
            Session.set('page', 'editFlavors');
            Session.set('currentVenueId', id);
            console.log(Session.get('currentVenueId', id));
            return 'page_editFlavors';
        }
    },
    '/clientVenues/:id': {
        to: 'clientVenues',
        and: function(id) {
            if( Meteor.users.findOne(id) )
                Meteor.Router.to('/');
            // access parameters in order a function args too
            Session.set('page', 'clientVenues');
            Session.set('clientId', id);
            return 'page_clientVenues';
        }
    }
    /*'/:page': function(page) {
        Session.set('page', page);
        return 'page_'+page;
    }*/
});