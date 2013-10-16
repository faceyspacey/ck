Router.map(function() {
	/* ----- Mobile Pages ----- */
	this.route('mobile', {
        path: '/mobile/step_1',
        controller: 'MobileController',
		template: 'mobile_container'
    });
	
    /* ----- Public pages ----- */
    this.route('home', {
        path: '/',
        template: 'page_home',
        renderTemplates: {
            'footer': {to: 'footer'},
        },
        data: {}
    });
    this.route('home', {
        path: '/home',
        template: 'page_home',
        renderTemplates: {
            'footer': {to: 'footer'},
        },
        data: {}
    });
    this.route('order', {
        path: '/order/:order_num',
        template: 'page_order_invoice',
        controller: 'OrdersController',
        data: function () {
	        return {invoice: Invoices.findOne({order_num: parseInt(this.params.order_num)})};
	    }
    });


    /* ----- Login-required pages ----- */
    this.route('myProfile', {
        path: '/myProfile',
        template: 'page_profile',
        data: function(){
            Meteor.subscribe('users');
            return {user_id: Meteor.userId()};
        },
    });
    this.route('myProfileEdit', {
        path: '/myProfile/edit',
        template: 'page_edit_profile',
        data: function(){
            Meteor.subscribe('users');
            return {user_id: Meteor.userId()};
        },
    });
    this.route('myInvoices', {
        path: '/myInvoices',
        template: 'page_invoices',
        data: {title: "My Invoices", user_id: Meteor.userId()},
    });
    this.route('contactUs', {
        path: '/contact_us',
        template: 'page_contact_us',
        data: {},
    });
	/*this.route('order', {
        path: '/orders/:order_num',
        template: 'page_order',
        data: function(){ return {_id: this.params.order_num} },
    });*/
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

            var orderedFlavor = new OrderedFlavorModel();
            return orderedFlavor.save();
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
        specAttr: 'cool',
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
    this.route('allInvoices', {
        path: '/allInvoices',
        template: 'page_invoices',
        data: function(){ return {title: "All Invoices", user_id: 'all'}; },
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
    this.route('notFound', {path: '*'});
});

Router.configure({
    layout: 'layout',

    pages: {
		mobile: {loginReq: false, roles: []},
		
        home: {loginReq: false, roles: []},
        order: {loginReq: false, roles: []},

        myProfile: {loginReq: true, roles: ['client', 'admin']},
        myProfileEdit: {loginReq: true, roles: ['client', 'admin']},
        myInvoices: {loginReq: true, roles: ['client', 'admin']},
        contactUs: {loginReq: true, roles: ['client', 'admin']},
        myVenues: {loginReq: true, roles: ['client', 'admin']},
        setKegs: {loginReq: true, roles: ['client', 'admin']},
        billingInfo: {loginReq: true, roles: ['client', 'admin']},
        orderKegs: {loginReq: true, roles: ['client', 'admin']},
        requestKegerator: {loginReq: true, roles: ['client', 'admin']},

        flavors: {loginReq: true, roles: ['admin']},
        delivery: {loginReq: true, roles: ['admin']},
        dailyFlavors: {loginReq: true, roles: ['admin']},
        clientInvoices: {loginReq: true, roles: ['admin']},
        allInvoices: {loginReq: true, roles: ['admin']},
        users: {loginReq: true, roles: ['admin']},
        profile: {loginReq: true, roles: ['admin']},
        editProfile: {loginReq: true, roles: ['admin']},
        allVenues: {loginReq: true, roles: ['admin']},
        clientVenues: {loginReq: true, roles: ['admin']},
        kegeratorInstallsAll: {loginReq: true, roles: ['admin']},
        oneOffs: {loginReq: true, roles: ['admin']},
        kegeratorInstalls: {loginReq: true, roles: ['admin']}
    },

    notFoundTemplate: 'page_forbidden',
    /*loadingTemplate: 'loading',*/

    renderTemplates: {

        'header': { to: 'header' },
        'footer': { to: 'footer' },
    },

    before: function() {
        var pages = Router.options.pages;
        var routeName = this.context.route.name;

        if( pages[routeName] == undefined ){
            this.render('page_not_found');
            return this.stop();
        }

        if( pages[routeName].loginReq == true && !Meteor.user() ){
            this.render('page_forbidden');
            return this.stop();
        }

        if( Meteor.user() ){
            if( Meteor.user().profile && Meteor.user().profile.sign_up_procedure ){
                switch(Meteor.user().profile.sign_up_procedure){
                    case 1:     if( routeName != 'myProfileEdit' ){
                                    Router.go('myProfileEdit');
                                    return this.stop();
                                }
                                break;
                    case 2:     if( routeName != 'billingInfo' ){
                                    Router.go('billingInfo');
                                    return this.stop();
                                }
                                break;
                }
            }
        }

        if( Meteor.user() && Meteor.user().profile == undefined )
            Meteor.users.update(Meteor.userId(), {set: {profile: {sign_up_procedure: 1}}});

        if( pages[routeName].loginReq == true && !Roles.userIsInRole(Meteor.userId(), pages[routeName].roles) ){
            /*console.log(pages[routeName].loginReq, Roles.userIsInRole(Meteor.userId(), pages[routeName].roles));*/
            this.render('page_forbidden');
            return this.stop();
        }
    },
});

OrdersController = RouteController.extend({
});

MobileController = RouteController.extend({

});

FlashMessages.configure({
    autoHide: true,
	delay: 7000
});


Handlebars.registerHelper('isDesktopSite', function() {
	if(!Router.current()) return false;
	
	var controller = Router.current().route.options.controller;
	return controller != 'OrdersController' && controller != 'MobileController';
});

Template._loginButtonsLoggedIn.events({
    'click #login-buttons-logout': function(e){
        e.preventDefault();
        Router.go('home');
        Meteor.logout();
    }
});