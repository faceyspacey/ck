/** Matheus, this is the old Router system from the Meteorite package manager.
I don't know if this is how they do it anymore, but feel free to implement your
own way of creating pages **/

/*
Meteor.Router.add({
    '/:page': function(page) {
        Session.set('page', page);
        return 'page_'+page;
    }
});
*/

Router.map(function() {

    /* ----- Public pages ----- */
    this.route('home', {
        path: '/',
        template: 'page_home',
        renderTemplates: {
            'footer': {to: 'footer'}
        },
        data: {}
    });

    /* ----- Login-required pages ----- */
    this.route('myProfile', {
        path: '/myProfile',
        template: 'page_profile',
        data: {user_id: Meteor.userId()},
    });
    this.route('myProfileEdit', {
        path: '/myProfile/edit',
        template: 'page_editProfile',
        data: {user_id: Meteor.userId()},
    });
    this.route('myOrders', {
        path: '/myOrders',
        template: 'page_myOrders',
        data: {user_id: Meteor.userId()},
    });
    this.route('myVenues', {
        path: '/myVenues',
        template: 'page_venues',
        data: {title: 'My Venues', user_id: Meteor.userId()},
    });
    this.route('setKegs', {
        path: '/venue/:id/setKegs',
        template: 'page_setKegs',
        data: function(){ return {venue_id: this.params.id} },
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
    this.route('editProfile', {
        path: '/profile/:id/edit',
        template: 'page_editProfile',
        data: function(){ return {user_id: this.params.id}},
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

Router.configure({
    layout: 'layout',

    /*notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',*/

    renderTemplates: {
        /* render the templated named footer to the 'footer' yield */
        'header': { to: 'header' },
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