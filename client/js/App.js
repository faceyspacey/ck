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
        1: {price: 120, size: 5, name: '5 Gallons'},
        2: {price: 150, size: 5, name: '5 Gallons'},
        3: {price: 100, size: 5, name: '5 Gallons'},
        4: {price: 300, size: 15, name: '15 Gallons'}
    };
	var prices = {
		fiveGallons: 120,
		fiveGallonsOneOff: 150,
		fiveGallonsDiscounted: 100,
		fifteenGallons: 300
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
        activateLink: activateLink
    };
})();

window.App = App;

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

