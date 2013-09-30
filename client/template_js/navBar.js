

Template._navBar.helpers({
    'getKegeratorsInstalls' : function(){
        var count = Kegerators.find({installed: false, venue_id: {$not: ''}}).count();
        return count ? '<span style="color:red !important;">( '+count+' )</span>': '( '+count+' )';
    }
});