
Template.page_order_invoice.helpers({
    invoiceItems: function(){ return this.invoice.invoiceItems(); },
    customerName: function(){ return this.invoice.user().profile.name; },
    venue: function(){ return this.invoice.venue(); },
    isOneOffInvoice: function(type){ return type == "one_off"; },
    actualDeliveryDate: function(){ return this.invoice.actualDeliveryDate(); },
    paymentStatus: function(){ return this.invoice.paid ? "Paid" : "Not Paid Yet"; },
    requestedDeliveryDate: function(){ return this.invoice.requestedDeliveryDate(); },
});