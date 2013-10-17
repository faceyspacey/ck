/** _nav_bar HELPERS, EVENTS & CALLBACKS **/

Template._nav_bar.helpers({
    'kegerator_installs_count' : function(){
        var count = Venues.find({ 
			$or: [
					{$where: "this.kegerator_request_date > this.kegerator_install_date"}, 
					{$where: "this.tap_request_date > this.tap_install_date"}
				]
			}).count();
			
        return count ? '<span style="color:red !important;">( '+count+' )</span>': '( '+count+' )';
    },
	'one_offs_count': function() {
		var count =  Invoices.find({
			type: 'one_off',
			delivered: false
		}).count();
		
		return count ? '<span style="color:red !important;">( '+count+' )</span>': '( '+count+' )';
	}
});

Template._nav_bar.events({
	'mouseenter #my_kombucha_link': function(e) {
		$('#customer_links').show();
	},
	'mouseleave #customer_links': function(e) {
		$('#customer_links').hide();
	},
	'mouseenter #administration_panel_link': function(e) {
		$('#admin_links').show();
	},
	'mouseleave #admin_links': function(e) {
		$('#admin_links').hide();
	}
});

Template._nav_bar.rendered = function() {
	$('#login-buttons').live('mouseenter', function() {
		console.log('entering');
		$('#login-dropdown-list').show();
	});
};



/** _loginButtonsLoggedIn HELPERS, EVENTS & CALLBACKS **/

Template._loginButtonsLoggedIn.events({
    'click #login-buttons-logout': function(e){
        e.preventDefault();
        Router.go('home');
        Meteor.logout();
    }
});



/** GLOBAL NAV HELPERS **/

Handlebars.registerHelper('active', function(link){
    var links = [];
    _.each(arguments, function(arg){
        if(_.isString(arg))
            links.push(arg);
    });

    if(!Router.current()) return '';
    else return links.indexOf(Router.current().route.name) >= 0 ? 'active' : '';
});