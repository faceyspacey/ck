/** page_invoices HELPERS, EVENTS & CALLBACKS **/

Template.page_invoices.helpers({
    invoices : function(){
        if(Roles.userIsInRole(Meteor.userId(), ['admin'])) {

            if(this.user_id == 'all' || this.user_id == undefined)
                return Invoices.find({}, {sort: {updated_at: -1}});
            else if(this.user_id != 'all' && this.user_id != undefined)
                return Invoices.find({user_id: this.user_id}, {sort: {updated_at: -1}});

        } else if(Meteor.userId()) {

            if(this.user_id != Meteor.userId()) {
                Router.go('myInvoices');
                return;
            } else
                return Invoices.find({user_id: Meteor.userId()}, {sort: {updated_at: -1}});

        } else
            Router.go('home');

    },
    isAllInvoice : function(page) {
        return page.user_id == 'all' || page.user_id == undefined;
    }
});

Template.page_invoices.events({
    'click .reply-button': function(e) {
		var message = prompt('Anything wrong with the order?', 'Tell us');		
		this.addReplyMessage(message);
	},
    'click .pay-button': function(e) {
        //console.log(this);
        this.payItOff();
    }
});