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
        1: { gallon: 5, price: 120 }
    };
    var kegeratorTypes = [
		{}, //this is a temporary hack since I switched this to being an array
        { id: 1, taps: 1, name: 'Single Tap Tower' },
        { id: 2, taps: 2, name: 'Double Tap Tower' }
    ];

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

    function getKegPrice(kegType){
        console.log('price '+kegType);
        if( typeof kegTypes[kegType] != 'undefined' )
            return kegTypes[kegType].price;
        return 0;
    }

    function activateLink(page){
        $('#navi-top .navi-link').removeClass('active');
        $('#page_'+page+'_link').addClass('active');
    }

    return {
        paymentCycles: getPaymentCycles(),
        paymentDays: getPaymentDays(),
        kegeratorTypes: getKegeratorTypes(),
        getKegPrice: getKegPrice,
		prices: prices,
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

String.prototype.ucfirst = function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
}
