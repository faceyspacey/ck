/** page_invoices HELPERS, EVENTS & CALLBACKS **/

Template.page_invoices.helpers({
    invoices : function(){
		var conditions = Roles.userIsInRole(Meteor.userId(), ['admin']) ? {} : {user_id: Meteor.userId()};
		return Invoices.find(conditions, {sort: {updated_at: -1}});
    }
});

Template.page_invoices.events({
    'click .reply-button': function(e) {
		var message = prompt('Anything wrong with the order?', 'Tell us');		
		this.addReplyMessage(message, this._id);
	}
});