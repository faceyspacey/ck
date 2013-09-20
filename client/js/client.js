/** Matheus, this is the old Router system from the Meteorite package manager.
I don't know if this is how they do it anymore, but feel free to implement your
own way of creating pages **/

//Meteor.users.remove(Meteor.userId());

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
    '/venues': {
        to: 'venues',
        and: function() {
            Session.set('page', 'venues');
            return 'page_venues';
        }
    },
    '/venue/:id/editFlavors': {
        to: 'editFlavors',
        and: function(id) {
            // access parameters in order a function args too
            Session.set('page', 'editFlavors');
            Session.set('currentVenueId', id);
            return 'page_editFlavors';
        }
    }
    /*'/:page': function(page) {
        Session.set('page', page);
        return 'page_'+page;
    }*/
});

Meteor.subscribe('allUsers');