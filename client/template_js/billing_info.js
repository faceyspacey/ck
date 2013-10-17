/** page_billing_info HELPERS, EVENTS & CALLBACKS **/

Template.page_billing_info.helpers({
    model: function(){
        return Meteor.users.findOne(this._id);
    },
    months: function(){
        return _.range(1, 13);
    },
    years: function(){
        return _.range(moment().toDate().getFullYear(), moment().add('years', 11).toDate().getFullYear());
    },
    yearNow: moment().toDate().getFullYear(),
    selected: function(value){
     	return value == this ? 'selected=selected' : '';
    },
});

Template.page_billing_info.events({
    'click #save-billing-info-btn' : function() {
		var card = {
		    	number: $('#user_card_number').val(),
			    cvc: $('#user_card_code').val(),
			    expMonth: $('#user_card_month').val(),
			    expYear: $('#user_card_year').val()
			};
		
		Stripe.createToken(card, function(status, response) {
			if (status === 200) {
		        var stripeCardToken = response.id;
			    Meteor.call('updateBillingInfo', stripeCardToken);
		        Router.go('myProfile');
		    } 
			else FlashMessages.sendError(response.error.message);
		});
    }
});