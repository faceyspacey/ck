/** page_invoices HELPERS, EVENTS & CALLBACKS **/

Template.page_invoices.helpers({
    'invoiceList' : function(){		
		var conditions = Roles.userIsInRole(Meteor.userId(), ['admin']) ? {} :{user_id: Meteor.userId()};
		return Invoices.find(conditions, {sort: {updatedAt: -1}});
    }
});