

Template.orders.helpers({
    'orderList' : function(){
        var user = Meteor.users.findOne(this.user_id);
        if( !user )
            return;

        return Orders.find({user_id: user._id});
    }
});