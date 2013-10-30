Template.slide_request_upgrades.helpers({
    upgradeTypes: function(){
        var types = _.extend({}, App.messageTypes);
        delete types[1]; delete types[2]; delete types[3]; delete types[4]; delete types[5]; delete types[9];
        return _.values(types);
    }
});

Template.slide_request_upgrades.events({
    'mouseup .save-button': function(){
		var message = new MessageModel(),
			messageType = $('#upgrade_type_dropdown').val(),
		 	message_id = message.save({
            	user_id: Meteor.userId(),
	            from: Meteor.user().getEmail(),
	            type: messageType,
	            content: $('#upgrade_message').val(),
	        });

		if(messageType == 6) Venues.update(this._id, {$set: {tap_request_date: new Date}});
		if(messageType == 7) Venues.update(this._id, {$set: {kegerator_request_date: new Date}});
		if(messageType == 8) Venues.update(this._id, {$set: {materials_request_date: new Date}});

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