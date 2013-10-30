Template.slide_support.helpers({
    messageTypes: function(){
        var types = _.extend({}, App.messageTypes);
        delete types[2]; delete types[6]; delete types[7]; delete types[8];
        return _.values(types);
    }
});

Template.slide_support.events({
    'mouseup .save-button': function(){
		var message = new MessageModel(),
		 	message_id = message.save({
            	user_id: Meteor.userId(),
	            from: Meteor.user().getEmail(),
	            type: $('#contactForm_type').val(),
	            content: $('#support_message').val(),
	        });


        if(Messages.findOne(message_id) ){
            message.send(message_id);
            prevPage();
        }
		else {
			alert('Oops. Something was wrong with your message. Please try again.')
		}
    },
	'touchstart .save-button, mousedown .save-button': function(e) {
		$(e.currentTarget).addClass('touched');
	},
	'touchend .save-button, mouseup .save-button': function(e) {
		$(e.currentTarget).removeClass('touched');
	}
});