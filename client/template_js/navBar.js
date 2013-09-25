

Template._navBar.helpers({
    'isActive' : function(page){
        if( Session.get('page') == page)
            return 'active';
        return '';
    },
});