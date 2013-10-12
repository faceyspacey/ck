
Template.page_order_invoice.helpers({
    invoiceItems: function(){ return this.invoice.invoiceItems(); },
    customer: function(){ return this.invoice.user(); },
    venue: function(){ return this.invoice.venue(); },
    isOneOffInvoice: function(type){ return type == "one_off"; },
});