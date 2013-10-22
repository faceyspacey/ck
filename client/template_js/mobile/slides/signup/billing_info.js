Template.slide_billing_info.events({
	'mouseup .save-button, tap .save-button': function() {
		var card = {
		    	number: $('#signup_credit_card').val(),
			    cvc: $('#signup_cvv_code').val(),
			    expMonth: $('#signup_card_month').val(),
			    expYear: $('#signup_card_year').val()
			};
		
		Stripe.createToken(card, function(status, response) {
			if(status === 200) {
				if(!Meteor.user()) createNewUser();
				
				var stripeCardToken = response.id;
				
			    Meteor.call('updateBillingInfo', stripeCardToken, function() {
					Meteor.users.update(Meteor.userId(), {$set: {valid_card: true}}); //do this so router knows immediately from mini-mongo
					
					//set user_id so subscriptions update & refresh is not needed
					Session.set('new_user_id', Meteor.userId());
					
					if(!isMobile) Router.go('myVenues');
					else {
						if(Session.get('step_type') == 'panel_edit_billing_info') prevPage(2);
						else {
							Session.set('step_type', 'panel');
							Session.set('slide_step', 0);
							Router.go('mobile');
						}
					}
				});
		    } 
			else {
				$('#slide_billing_info input, #slide_billing_info select').addClass('error');
				alert('Something is wrong with the card you provided. Please double check it.');
			}
		});
	}
});