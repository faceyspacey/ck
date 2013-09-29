App = (function(){
    var paymentCycles = [
        {id: 'weekly', name: 'Weekly'},
        {id: 'bi-weekly', name: 'Bi-Weekly'}
    ];
    var paymentDays = [
        {id: 'monday', name: 'Monday'},
        {id: 'thursday', name: 'Thursday'}
    ];
    var kegTypes = {
        1: { gallon: 5, price: 120 },
    };

    function getPaymentCycles(){
        return paymentCycles;
    }
    function getPaymentDays(){
        return paymentDays;
    }

    function getKegPrice(kegType){
        if( typeof kegTypes[kegType] != 'undefined' )
            return kegTypes[kegType].price;

        return 0;
    }

    function maxOfAssociative(object, allowMulti){
        var max = {keys: [], val: 0};
        for(i in object){
            if( max.keys.length == 0 )
                max = {keys: [i], val: object[i]};
            if( allowMulti ){
                if( object[i] > max.val )
                    max = {keys: [i], val: object[i]};
                if( object[i] == max.val ){
                    max.keys.push(i);
                    max.val = object[i];
                }
            }else{
                if( object[i] > max.val )
                    max = {key: i, val: object[i]};
            }
        }

        return max;
    }

    function minOfAssociative(object, allowMulti){
        var min = {keys: [], val: 0};
        for(i in object){
            if( min.keys.length == 0 )
            min = {keys: [i], val: object[i]};
            if( allowMulti ){
                if( object[i] < min.val )
                    min = {keys: [i], val: object[i]};
                if( object[i] == min.val ){
                    min.keys.push(i);
                }
            }else{
                if( object[i] < min.val )
                    min = {key: i, val: object[i]};
            }
        }

        return min;
    }

    function activateLink(page){
        $('#navi-top .navi-link').removeClass('active');
        $('#page_'+page+'_link').addClass('active');
    }

    return {
        paymentCycles: getPaymentCycles(),
        paymentDays: getPaymentDays(),
        getKegPrice: getKegPrice,
        maxOfAssociative: maxOfAssociative,
        minOfAssociative: minOfAssociative,
        activateLink: activateLink,
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