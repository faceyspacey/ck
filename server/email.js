Meteor.methods({
  	emailMe: function (info) {
   		//Let other method calls from the same client start running,
		//without waiting for the email sending to complete.
		this.unblock();

		console.log('emailing', info);

		Email.send({
	     	to: 'james@faceyspacey.com',
	     	from: info.email,
	     	subject: info.name + ' from ' + info.city + ' (' + info.venue + ')',
	     	text: info.message || 'no message'
	    });

		Email.send({
		     to: info.email,
		     from: 'tylerbeerman@gmail.com',
		     subject: "Thanks for Contacting Conscious Kombucha -- Here's our Products:",
		     text: 'http://ckhome.meteor.com/product'
		});
	},
	sendBasicEmail: function(to, from, message, subject, body) {
		Email.send({
			to: to,
		    from: from,
		    subject: subject,
		    text: body
		});
	},
	sendCustomerEmail: function(to, subject, body) {
		Email.send({
			to: to,
		    from: 'sales@consciouskombucha.com',
		    subject: subject,
		    text: body
		});
	},
	sendAdminEmail: function(from, subject, body) {
		Email.send({
			to: 'sales@consciouskombucha.com',
		    from: from,
		    subject: subject,
		    text: body
		});
	}
});