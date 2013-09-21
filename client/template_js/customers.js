

Meteor.subscribe('users');

Template.customers.customerList = function(){
    var customers = Meteor.users.find({roles: {$in: ['customer']}});
    //console.log(customers);
    return customers;
}

Template.customers.helpers({
    'listRoles': function(roles){
        if( roles.length < 1 )
            return '-';

        var rolesText = "";
        for( var i = 0; i < roles.length; i++ ){
            rolesText += roles[i] + (i < roles.length-1 ? ',' : '') + ' <br />';
        }
        return rolesText;
    },
    'venues': function(){
        var venues = Venues.find({user_id: this._id});

        return venues.count()+' venues';
    }
});