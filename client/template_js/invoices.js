

Template.invoices.helpers({
    'invoiceList' : function(){
        var user = Meteor.users.findOne(this.user_id);
        if( !user )
            return;

        return Invoices.find({user_id: user._id});
    }
});