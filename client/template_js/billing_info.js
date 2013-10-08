/** page_billing_info HELPERS, EVENTS & CALLBACKS **/

Template.page_billing_info.events({
    'click #save-billing-info-btn' : function(){
		console.log($('#user_stripe_card_token').val());
		var card = {
		    number: $('#user_card_number').val(),
		    cvc: $('#user_card_code').val(),
		    expMonth: $('#user_card_month').val(),
		    expYear: $('#user_card_year').val()
		  };
		Stripe.createToken(card, handleStripeResponse);
		      
        Router.go('myProfile');
    }
});

var handleStripeResponse = function(status, response) {
  if (status === 200) {
    var stripeCardToken = response.id;
	Meteor.call('updateBillingInfo', stripeCardToken)
  } else {
    alert(response.error.message);
    //$('#new_subscription input[type=submit]').attr('disabled', false);
  }
}