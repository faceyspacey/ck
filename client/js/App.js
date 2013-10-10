App = (function(){
    var paymentCycles = [
        {id: 'weekly', name: 'Weekly'},
        {id: 'bi-weekly', name: 'Bi-Weekly'},
    ];
    var paymentDays = [
        {id: 'monday', name: 'Monday'},
        {id: 'thursday', name: 'Thursday'}
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

    function activateLink(page){
        $('#navi-top .navi-link').removeClass('active');
        $('#page_'+page+'_link').addClass('active');
    }

    return {
        paymentCycles: getPaymentCycles(),
        paymentDays: getPaymentDays(),
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
