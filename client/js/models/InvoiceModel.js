
/** InvoiceModel attributes:
 *
 *  collectionName              'Invoices'
 *  _id                         Str
 *  user_id                     Str
 *  venue_id                    Str
 *  type                        Str     =>  "one_off", "subscription"
 *  order_num                   Int
 *  keg_quantity                Int
 *  requested_delivery_date     Date
 *
 *  total                       Int
 *  paid                        Bool
 *
 *  offline_customer			Bool
 */

InvoiceModel = function(doc){
	this.collectionName ='Invoices';
    this.defaultValues = {
		order_num: 0,
		keg_quantity: 0, 
        total: 0, 
		paid: false
    };

	this.afterInsert = function() {
		if(!this.user().stripe_customer_token) this.save({offline_customer: true});
	};
	
    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

	//only one_off invoices are guaranteed to have a single Venue model associated with it
	this.venue = function(){
        if( !this.venue_id )
            return false;

        return Venues.findOne(this.venue_id);
    };

	this.addReplyMessage = function(message) {
		Invoices.update(this._id, {$push: {messages: message}});
		Meteor.call('sendAdminEmail', this.user().getEmail(), 'Reply for Invoice: #'+this.order_num, message, function(err, res){});
		Meteor.call('sendCustomerEmail', this.user().getEmail(), 'Message sent in regards to Order #'+this.order_num, 'Your message: '+message, function(err, res){});
	};

    this.payItOff = function() {
        if(this.paid) return;

        this.save({paymentInProgress: true});
        this.chargeCustomer();
    };

	this.invoiceItems = function(condition){
        var attributes = _.extend(_.extend({}, condition), {invoice_id: this._id});
        return InvoiceItems.find(attributes);
    };

	this.items = function(){
        return InvoiceItems.find({invoice_id: this._id});
    };

	this.paymentPeriodType = function() {
		if(this.type == 'one_off') return 'One Off Order';
		else return 'Weekly'; //this.payment_cycle.substr(0, 1).toUpperCase() + this.payment_cycle.substr(1)
	};
	
	this.deliveryDayOfWeek = function() {
		if(this.type == 'one_off') return this.requestedDeliveryDayOfWeek();
		else this.payment_day;
	};
	
	//for one off kegs
	this.requestedDeliveryDayOfWeek = function() {
		return moment(this.requested_delivery_date).format('ddd');
	};

    this.requestedDeliveryDate = function() {
        return moment(this.requested_delivery_date).format("ddd, MMM Do, h:mm a");
    };
	
	this.actualDeliveryDate = function() {
		return this.actual_delivery_date ? moment(this.actual_delivery_date).format("DD/MM h:mma") : 'Not Delivered Yet';
	};
	
	this.actualDeliveryMoment = function() {
		return this.actual_delivery_date ? moment(this.actual_delivery_date) : null;
	};
	
	this.actualDeliverySmallTime = function() {
		return this.actualDeliveryMoment().format("MM/DD") +'<br />' + this.actualDeliveryMoment().format("h:mma");
	};
	
	
	this.actualPaidDate = function() {
		return moment(this.actual_paid_date).format("ddd, MMM Do, h:mm a");
	};
	                                                                                       
	this.paidInfo = function() {
		if(this.paid) return 'PAID';
		if(this.payment_failed) return 'FAILED';
		if(!this.is_stripe_customer && !this.paid) return 'AWAITING CHECK';
		return 'AWAITING PAYMENT';
	};

    this.formattedCreatedAt = function(){
        //date formatting comes here
    };

    this.paymentPeriod = function(){
        // payment period rendering comes here
    };

	this.chargeCustomer = function() {
		if(this.user().stripe_customer_token != undefined) {
            Meteor.call('chargeCustomer', this._id);
		}
		else {
			
		}
	};
	
	_.extend(this, Model);
	this.extend(doc);

    return this;
};
