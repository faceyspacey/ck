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
    var kegeratorTypes = {
        1: { id: 1, taps: 1, name: 'Single Tap Tower' },
        2: { id: 2, taps: 2, name: 'Double Tap Tower' },
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

    function formatTime(time){
        if( !time )
            return '-';
        var d = new Date(time);
        var date = checkTime(d.getDate());
        var month = checkTime(d.getMonth() + 1);
        var year = checkTime(d.getFullYear());
        var hour = checkTime(d.getHours());
        var min = checkTime(d.getMinutes());
        var sec = checkTime(d.getSeconds());

        return year +'-'+ month +'-'+ date +' '+ hour +':'+ min +':'+ sec;
    }

    function checkTime(i){
        if (i<10){
            i="0" + i;
        }
        return i;
    }

    function calcTime(time, offset) {
        // create Date object for current location
        var d = new Date();

        // get UTC time in msec
        var utc = d.toUTC(time);

        // create new Date object for different timezone
        // using supplied offset + Daylight Saving Time
        //console.log((3600000*offset) + (d.dst() ? 60 : 0));
        //console.log(utc.getTime());
        return new Date(utc + (3600000*(offset + (d.dst() ? 1 : 0))));
    }

    return {
        paymentCycles: getPaymentCycles(),
        paymentDays: getPaymentDays(),
        kegeratorTypes: getKegeratorTypes(),
        getKegPrice: getKegPrice,
        maxOfAssociative: maxOfAssociative,
        minOfAssociative: minOfAssociative,
        activateLink: activateLink,
        formatTime: formatTime,
        calcTime: calcTime,
        checkTime: checkTime,
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
