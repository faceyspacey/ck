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
    this.route('myInvoices', {
        path: '/myInvoices',
        template: 'page_invoices',
        data: {title: "My Invoices", user_id: Meteor.userId()},
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
	this.route('billingInfo', {
        path: '/billing-info',
        template: 'page_billingInfo',
        data: {user_id: Meteor.userId()},
    });
    this.route('requestKegerator', {
        path: '/requestKegerator',
        template: 'page_requestKegerator',
        data: {venue_id: false},
    });
    this.route('requestKegerator', {
        path: '/requestKegerator/:id',
        template: 'page_requestKegerator',
        data: function(){ return {venue_id: this.params.id}; },
    });

    /* ----- Admin Pages ----- */
    this.route('flavors', {
        path: '/flavors',
        template: 'page_flavors',
        data: {},
    });
    this.route('delivery', {
        path: '/delivery',
        template: 'page_delivery',
        data: {},
    });
	this.route('dailyFlavors', {
        path: '/daily_flavors',
        template: 'page_daily_flavors',
        data: {},
    });
    this.route('clientInvoices', {
        path: '/clientInvoices/:id',
        template: 'page_invoices',
        data: function(){ return {title: Meteor.users.findOne(this.params.id).profile.name+"'s Invoices", user_id: this.params.id}; },
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
    this.route('kegeratorInstallsAll', {
        path: '/kegeratorInstalls',
        template: 'page_kegeratorInstalls',
        data: function(){ return {user_id: false}; },
    });
    this.route('kegeratorInstalls', {
        path: '/kegeratorInstalls/:id',
        template: 'page_kegeratorInstalls',
        data: function(){ return {user_id: (this.params.id != 'all' ? this.params.id : false)}; },
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

        if (_.include(['home'], routeName))
            return;

        var user = Meteor.user();
        if (! user) {
            this.render('home');
            return this.stop();
        }
    },
});