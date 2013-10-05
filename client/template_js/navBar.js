

Template._navBar.helpers({
    'getKegeratorsInstalls' : function(){
        var count = Kegerators.find({installed: false, venue_id: {$not: ''}}).count();
        return count ? '<span style="color:red !important;">( '+count+' )</span>': '( '+count+' )';
    },
});

Handlebars.registerHelper('active', function(link){
    var links = [];
    _.each(arguments, function(arg){
        if( _.isString(arg) )
            links.push(arg);
    });
    if( !Router.current() )
        return '';
    else
        return links.indexOf(Router.current().route.name) >= 0 ? 'active' : '';
});