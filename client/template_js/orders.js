
Orders = new Meteor.Collection('orders');

Template.orders.helpers({
    'orderList' : function(){
        var user = Meteor.users.findOne(Session.get('ordersClientId'));
        if( !user )
            return;

        return Orders.find({user_id: user._id});
    }
});