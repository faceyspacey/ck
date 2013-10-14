Stripe = StripeAPI('sk_test_fN3eVl4efa58FJLMbPXFF56w');
Fiber = Npm.require('fibers');

Meteor.methods({
	updateBillingInfo: function(stripeCardToken) {
		var _this = this;
		
		console.log('stripeCardToken', stripeCardToken);
		var stripeReturn = Stripe.customers.create({
			card: stripeCardToken,
			email: Meteor.user().emails[0].address,
		}, function(error, result) {
			console.log(error, result);
			
			//A fiber is used to execute meteor code in this async callback, since meteor is syncronous.
			//the fiber kinda forces our code back into the meteor synrconous environment
			Fiber(function() {
				Meteor.users.update(_this.userId, {$set: {stripe_customer_token: result.id}});
			}).run();
				
		});
		
		console.log('stripeReturn', stripeReturn);
	},
    chargeCustomer: function(user, invoiceId) {
        var invoice = Invoices.findOne(invoiceId);
        var error, result;

        Stripe.charges.create({
            amount: invoice.total*100,
            currency: "USD",
            customer: user.stripe_customer_token
        }, function (err, res) {
            error = err;
            result = res;

            if( error != undefined )
                Fiber(function() {
                    Invoices.update(invoice._id, {$set: {error: error}});
                }).run();
            else
                Fiber(function() {
                    Invoices.update(invoice._id, {$set: {paid: true}});
                }).run();

        });

        return {error: error, result: result};

    }
});