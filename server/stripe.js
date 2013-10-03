Stripe = StripeAPI('sk_test_fN3eVl4efa58FJLMbPXFF56w');

Meteor.methods({
	updateBillingInfo: function(stripeCardToken) {
		console.log('stripeCardToken', stripeCardToken);
		var stripeReturn = Stripe.customers.create({
			card: stripeCardToken,
			plan: 'weekly',
			email: Meteor.user().emails[0].address,
			quantity: 1
		}, function(error, result) {
			console.log(error, result);
			
			//Matheus, this code can't run yet because Meteor code can't run in async callbacks.
			//you gotta use a fiber or something, which I tried and failed. I'm waiting for responses back
			//but basically this task is done--cuz below makes the link between our customer objects and stripe's customer objects :)
			//Meteor.users.update(Meteor.userId(), {$set: {stripeCustomerToken: result.id}});
		});
		console.log('stripeReturn', stripeReturn);
	}
});