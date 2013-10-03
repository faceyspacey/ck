Stripe = StripeAPI('sk_test_fN3eVl4efa58FJLMbPXFF56w');
Fiber = Npm.require('fibers');

Meteor.methods({
	updateBillingInfo: function(stripeCardToken) {
		var _this = this;
		
		console.log('stripeCardToken', stripeCardToken);
		var stripeReturn = Stripe.customers.create({
			card: stripeCardToken,
			plan: 'weekly',
			email: Meteor.user().emails[0].address,
			quantity: 1
		}, function(error, result) {
			console.log(error, result);
			
			//A fiber is used to execute meteor code in this async callback, since meteor is syncronous.
			//the fiber kinda forces our code back into the meteor synrconous environment
			Fiber(function() {
				Meteor.users.update(_this.userId, {$set: {stripeCustomerToken: result.id}});
			}).run();
				
		});
		
		console.log('stripeReturn', stripeReturn);
	}
});