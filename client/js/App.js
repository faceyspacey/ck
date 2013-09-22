App = (function(){

    function getHalfRandomFlavor(venue){
        var flavors = {};
        var flavorKeys = [];
        for( var i = 0; i < venue.kegerators.length; i++){
            var kege = venue.kegerators[i];
            for(var c = 0; c < kege.taps.length; c++){
                var tap = kege.taps[c];
                if( typeof flavors[tap.flavor] != 'undefined' )
                    flavors[tap.flavor] += 1 ;
                else
                    flavors[tap.flavor] = 1 ;

                if( flavorKeys.indexOf(tap.flavor) == -1 )
                    flavorKeys.push(tap.flavor);
            }
        }

        //console.log(venue);
        //console.log(Flavors.find({_id: {$nin: flavorKeys}}).fetch());
        var nonChoosedFlavors = Flavors.find({_id: {$nin: flavorKeys}, is_public: true}).fetch();
        for( var i = 0; i < nonChoosedFlavors.length; i++){
            if( flavorKeys.indexOf(nonChoosedFlavors[i]._id) < 0 )
                flavors[nonChoosedFlavors[i]._id] = 0;
        }
        var min = minOfAssociative(flavors, true);
        console.log(flavors);
        return min.keys[Math.floor((Math.random()*min.keys.length))];
    }

    function getUsedFlavors(venue){
        var flavors = [];
        for(var i = 0; i < venue.kegerators.length; i++){
            for(var c = 0; c < venue.kegerators[i].taps.length; c++){
                if( flavors.indexOf(venue.kegerators[i].taps[c].flavor) < 0 )
                    flavors.push(venue.kegerators[i].taps[c].flavor);
            }
        }

        return flavors;
    };

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
        /*console.log(object);
        console.log(min);*/
        return min;
    }

    return {
        getHalfRandomFlavor: getHalfRandomFlavor,
        getUsedFlavors: getUsedFlavors,
        maxOfAssociative: maxOfAssociative,
        minOfAssociative: minOfAssociative
    };
})();

window.App = App;

Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};