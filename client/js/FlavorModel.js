
window.FlavorModel = function(doc){
    var _id = '',
        name = '',
        icon = '',
        is_public = false,
        user_id = '';
    var modelAttributes = [
        '_id',
        'name',
        'icon',
        'is_public',
        'user_id'
    ];
    var requiredAttrs = ['name', 'icon'];
    this.errors = {};

    this.user = function(){
        if( !this.user_id )
            return false;

        return Meteor.users.findOne(this.user_id);
    }

    this.usage = function(){
        return Venues.find({usedFlavors: {$in: [this._id]}}).count();
    }

    /*
    this.displayKegerators = function(){
        var venue = Venues.findOne(this._id);
        if( !venue || typeof venue.kegerators == 'undefined')
            return 'no kegerators yet';

        var kegeratorsHtml = '';
        var flavor;
        for(var i = 0; i < venue.kegerators.length; i++){
            kegeratorsHtml += '<div class="table-kegerator-div"> '+venue.kegerators[i].tapsCount+' taps: ';
            for(var c = 0; c < venue.kegerators[i].taps.length; c++){
                flavor = Flavors.findOne(venue.kegerators[i].taps[c].flavor);
                kegeratorsHtml += '<div class="table-kegerator-flavor-div" style="background-image:url(\''+(flavor ? flavor.icon : '') +'\');"></div>';
            }
            kegeratorsHtml += '</div>';
        }

        return kegeratorsHtml;
    }*/

    this.setAttributes = function(doc){
        for(i = 0; i < modelAttributes.length; i++){
            var attr = modelAttributes[i];
            if( typeof doc[attr] == 'undefined' )
                continue;

            if( requiredAttrs.indexOf(attr) != -1 ){
                if( !doc[attr].length )
                    this.errors[attr] = 'Can not be blank.';
            }

            this[attr] = doc[attr];
        }
    };

    this.setAttributes(doc);

    return this;
};