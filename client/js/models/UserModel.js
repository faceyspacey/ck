UserModel = function(doc){
    this.collectionName = 'Users';

	this.getEmail = function() {
		return this.emails[0].address;
	};

    this.getAvatar = function(){
        return this.profile && this.profile.avatar ? this.profile.avatar : '/images/default-avatar.jpg';
    }
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};

//yes, this isn't in an actual model; yes, if it was in a model, i shouldn't be grabbing stuff from the dom.
//I should be passing the dom values in params. But this is nevertheless a solid way to remove code
//from template js which should be in a function
createNewUser = function() {
	//create new user
	Accounts.createUser({
		email: $('input[type=email]').val(),
		password: $('input[type=password]').val(),
		profile: {
			name: $('#signup_venue_name').val(),
			phone: isValidPhone($('input[type=tel]').val()) //returns cleaned phone #
		}
	}, function(error) {
		if(error) {
			alert('Oops! Something went wrong. Please try again.');
			return;
		}
		
		//insert & link venue to user
		var venue_id = Venues.insert({
			name: $('#signup_venue_name').val(),
			address: $('#signup_venue_address').val(),
			email: $('input[type=email]').val(),
			phone: isValidPhone($('input[type=tel]').val()), //returns cleaned phone #
			user_id: Meteor.userId()
		});
		
		//insert and link keg to venue
		Kegs.insert({
			venue_id: venue_id,
			user_id: Meteor.userId(),
			flavor_id: Session.get('current_flavor_id'),
			payment_day: Session.get('keg_day'),
			payment_cycle: Session.get('keg_cycle'),
			odd_even: oddEvenWeek(moment().add('days', 7).toDate()),
			keg_num: 1,
            type: 1,
            price: App.kegTypes[1].price
		});
	});
};