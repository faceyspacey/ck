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
        template: 'page_edit_profile',
        data: {user_id: Meteor.userId()},
    });
    this.route('myInvoices', {
        path: '/myInvoices',
        template: 'page_invoices',
        data: {title: "My Invoices", user_id: Meteor.userId()},
    });
	this.route('order', {
        path: '/orders/:order_num',
        template: 'page_order',
        data: function(){ return {_id: this.params.order_num} },
    });
    this.route('myVenues', {
        path: '/myVenues',
        template: 'page_venues',
        data: {title: 'My Venues', user_id: Meteor.userId()},
    });
    this.route('setKegs', {
        path: '/venue/:id/setKegs',
        template: 'page_set_kegs',
        data: function(){ return {venue_id: this.params.id} },
    });
	this.route('billingInfo', {
        path: '/billing-info',
        template: 'page_billing_info',
        data: {user_id: Meteor.userId()},
    });
	this.route('orderKegs', {
        path: '/order-keg',
        template: 'page_order_kegs',
        data: function() {
			OrderedFlavors = new Meteor.Collection(null, { //create local-only (temporary) mini-mongo collection
			    reactive: true,
			    transform: function (doc) { return new OrderedFlavorModel(doc); }
			});
			
			OrderedFlavors.insert({});
		}
    });
    this.route('requestKegerator', {
        path: '/requestKegerator',
        template: 'page_request_kegerator',
        data: {venue_id: false},
    });
    this.route('requestKegerator', {
        path: '/requestKegerator/:id',
        template: 'page_request_kegerator',
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
        template: 'page_edit_profile',
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
        template: 'page_kegerator_installs',
        data: function(){ return {user_id: false}; },
    });
	this.route('oneOffs', {
        path: '/one-offs',
        template: 'page_one_offs',
        data: function(){ return {user_id: false}; },
    });
    this.route('kegeratorInstalls', {
        path: '/kegeratorInstalls/:id',
        template: 'page_kegerator_installs',
        data: function(){ return {user_id: (this.params.id != 'all' ? this.params.id : false)}; },
    });
});

Router.configure({
    layout: 'layout',

    /*notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',*/

    renderTemplates: {

        'header': { to: 'header' },
        'footer': { to: 'footer' },
    },

    before: function() {
        var routeName = this.context.route.name;
        if (_.include(['home'], routeName)) return;

        if (!Meteor.user()) {
            this.render('page_home');
            return this.stop();
        }
    },
});

FlashMessages.configure({
    autoHide: true,
	delay: 7000
  });
