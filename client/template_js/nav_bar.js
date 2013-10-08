/** _nav_bar HELPERS, EVENTS & CALLBACKS **/

Template._nav_bar.helpers({
    'kegerator_installs_count' : function(){
        var count = Kegerators.find({
				installed: false, 
				venue_id: {$not: ''}
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

Handlebars.registerHelper('active', function(link){
    var links = [];
    _.each(arguments, function(arg){
        if(_.isString(arg))
            links.push(arg);
    });

    if(!Router.current()) return '';
    else return links.indexOf(Router.current().route.name) >= 0 ? 'active' : '';
});