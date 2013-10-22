Stripe = StripeAPI('sk_test_fN3eVl4efa58FJLMbPXFF56w');
Fiber = Npm.require('fibers');

Meteor.methods({
	updateBillingInfo: function(stripeCardToken) {
		var _this = this;
		
		if(Meteor.user().stripe_customer_token) {
			//update existing stripe customer
			Stripe.customers.update(Meteor.user().stripe_customer_token, {
				card: stripeCardToken
			}, 	
			function(error, result) {
				Fiber(function() {
					console.log('valid_card!')
					Meteor.users.update(_this.userId, {$set: {valid_card: true}});
				}).run();				
			});
		}
		else {
			//create new stripe customer
			Stripe.customers.create({
				card: stripeCardToken,
				email: Meteor.user().emails[0].address,
			}, 	
			function(error, result) {
				Fiber(function() {
					Meteor.users.update(_this.userId, {$set: {stripe_customer_token: result.id, valid_card: true}}); //store stripe card token
				}).run();				
			});
		}
	},
    chargeCustomer: function(invoiceId) {
        var invoice = Invoices.findOne(invoiceId),
			user = Meteor.user(),
			userId = Meteor.userId(),
			error, result;

        Stripe.charges.create({
            amount: invoice.total*100,
            currency: "USD",
            customer: user.stripe_customer_token
        }, function (error, result) {
			Fiber(function() {
				if(error != undefined) {
					Meteor.users.update(userId, {$set: {valid_card: false}});
                   	Invoices.update(invoice._id, {$set: {error: error}});
				}
				else Invoices.update(invoice._id, {$set: {paid: true}});
            }).run();         
        });

        return {error: error, result: response};
    }
});
