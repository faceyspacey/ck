App = (function(){
    var paymentCycles = [
        {id: 'weekly', name: 'Weekly'},
        {id: 'bi-weekly', name: 'Bi-Weekly'},
    ];
    var paymentDays = [
        {id: 'monday', name: 'Monday'},
        {id: 'thursday', name: 'Thursday'}
    ];
    var kegTypes = {
        1: {price: 120, size: 5, name: 'Five Gallons'},
        2: {price: 150, size: 5, name: 'Five Gallons'},
        3: {price: 100, size: 5, name: 'Five Gallons'},
        4: {price: 300, size: 15, name: 'Fifteen Gallons'}
    };
	var prices = {
		fiveGallons: 120,
		fiveGallonsOneOff: 150,
		fiveGallonsDiscounted: 100,
		fifteenGallons: 300
	};
    var messageTypes = {
        1: {id: 1, subject: 'General Question'},
        2: {id: 2, subject: 'Order Reply'},
        3: {id: 3, subject: 'Out of CO2'},
		4: {id: 3, subject: 'Clogged Tap'},
		5: {id: 3, subject: 'Issue with Website'},
		6: {id: 3, subject: 'Request Double Tap'},
		7: {id: 3, subject: 'Request Additional Kegerator'},
		8: {id: 3, subject: 'Request Promotional Materials'},
		9: {id: 3, subject: 'Other'}
    };

	var superAdmins = [
		'james@faceyspacey.com',
		'90.matheus@gmail.com'
	];
	
	var isSuperAdmin = function() {
		if(!Meteor.user()) return false;
		return _.contains(superAdmins, Meteor.user().emails[0].address);
	};

    function getPaymentCycles(){
        return paymentCycles;
    }
    function getPaymentDays(){
        return paymentDays;
    }
    function getKegeratorTypes(){
        return kegeratorTypes;
    }

    function activateLink(page){
        $('#navi-top .navi-link').removeClass('active');
        $('#page_'+page+'_link').addClass('active');
    }

    return {
        paymentCycles: getPaymentCycles(),
        paymentDays: getPaymentDays(),
		prices: prices,
        kegTypes: kegTypes,
        messageTypes: messageTypes,
        activateLink: activateLink,
		isSuperAdmin: isSuperAdmin		
    };
})();

window.App = App;

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

