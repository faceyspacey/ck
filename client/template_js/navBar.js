

Template._navBar.helpers({
    'kegerator_installs_count' : function(){
        var count = Kegerators.find({installed: false, venue_id: {$not: ''}}).count();
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