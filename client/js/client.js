/** Matheus, this is the old Router system from the Meteorite package manager.
I don't know if this is how they do it anymore, but feel free to implement your
own way of creating pages **/

//Meteor.users.remove(Meteor.userId());
if( Roles.userIsInRole(Meteor.userId(), ['admin']) )
    Meteor.subscribe('users');

Meteor.Router.add({
    '/clientVenues/:id': {
        to: 'clientVenues',
        and: function(id) {
            if( Meteor.users.findOne(id) )
                Meteor.Router.to('/');
            // access parameters in order a function args too
            Session.set('page', 'clientVenues');
            Session.set('clientId', id);
            App.activateLink('');
            return 'page_clientVenues';
        }
    }
    /*'/:page': function(page) {
        Session.set('page', page);
        return 'page_'+page;
    }*/
});

Router.map(function() {

    /* ----- Public pages ----- */
    this.route('home', {
        path: '/',
        template: 'page_home',
        data: {},
    });

    /* ----- Login-required pages ----- */
    this.route('myProfile', {
        path: '/myProfile',
        template: 'page_profile',
        data: {userId: Meteor.userId()},
    });
    this.route('myOrders', {
        path: '/myOrders',
        template: 'page_myOrders',
        data: {userId: Meteor.userId()},
    });
    this.route('myVenues', {
        path: '/venues/'+Meteor.userId(),
        template: 'page_venues',
        data: {title: 'My Venues', user_id: Meteor.userId()},
    });
    this.route('setKegs', {
        path: '/venue/:id/setKegs',
        template: 'page_setKegs',
        data: function(){ return {venueId: this.params.id} },
    });

    /* ----- Admin Pages ----- */
    this.route('flavors', {
        path: '/flavors',
        template: 'page_flavors',
        data: {},
    });
    this.route('clientOrders', {
        path: '/clientOrders/:id',
        template: 'page_clientOrders',
        data: function(){ return {user_id: this.params.id}; },
    });
    this.route('users', {
        path: '/users/:role',
        template: 'page_users',
        data: function(){ return {role_id: this.params.role}; },
    });
    this.route('profile', {
        path: '/profile/:id',
        template: 'page_profile',
        data: function(){ return {user_id: this.params.id}; },
    });
    this.route('allVenues', {
        path: '/venues/all',
        template: 'page_venues',
        data: {title: 'All Venues', user_id: false},
    });
    this.route('clientVenues', {
        path: '/venues/:id',
        template: 'page_venues',
        data: function(){ return {title: Meteor.users.findOne(this.params.id).profile.name+"'s Venues", user_id: this.params.id}; },
    });
});


Meteor.Router.filters({
    'checkLoggedIn': function(page) {
        if (Meteor.loggingIn()) {
            return 'loading';
        } else if (Meteor.user()) {
            return page;
        } else {
            return 'home';
        }
    },
    'checkAdmin': function(page) {
        if (Meteor.loggingIn()) {
            return 'home';
        } else if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
            console.log('checkAdmin true');
            return page;
        } else {
            return 'home';
        }
    }
});

Router.configure({
    layout: 'layout',

    /*notFoundTemplate: 'notFound',

    loadingTemplate: 'loading',*/

    renderTemplates: {
        /* render the templated named footer to the 'footer' yield */
        'footer': { to: 'footer' },
    },

    before: function() {
        var routeName = this.context.route.name;
        // no need to check at these URLs
        if (_.include(['home'], routeName))
            return;

        var user = Meteor.user();
        if (! user) {
            this.render('home');
            return this.stop();
        }
    },
});


/*
Meteor.Router.filter('checkLoggedIn', {only: ['profile', 'venues', 'editFlavors', 'myOrders']});

Meteor.Router.filter('checkAdmin', {only: [ 'profile', 'venues', 'editFlavors', 'flavors', 'clients', 'admins', 'allVenues', 'editFlavors', 'clientVenues', 'clientOrders' ]});
Meteor.Router.filter('checkAdmin', {except: ['myOrders']});
*/