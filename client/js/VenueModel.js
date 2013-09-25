
window.VenueModel = function(doc){
    var _id = '',
        name = '',
        address = '',
        email = '',
        phone = '',
        facebook = '',
        twitter = '',
        instagram = '',
        youtube = '',
        user_id = '',
        status_id = 0,
        usedFlavors = [],
        kegerators = [];
    var modelAttributes = [
        'name',
        'address',
        'email',
        'phone',
        'facebook',
        'twitter',
        'instagram',
        'youtube',
        'kegerators',
        'usedFlavors',
        'user_id',
        '_id'
    ];
    var requiredAttrs = ['name', 'address', 'email'];
    this.errors = {};

    this.user = function(){
        if( !this.user_id )
            return false;

        return Meteor.users.findOne(this.user_id);
    }
    this.paymentCycle = function(){
        var user;
        if( !this.user_id || !(user = Meteor.users.findOne(this.user_id)) )
            return {};

        return App.getPaymentCycle(user.profile.paymentCycle)
    }

    this.displayKegerators = function(){
        var venue = Venues.findOne(this._id);
        if( !venue || typeof venue.kegerators == 'undefined')
            return 'no kegerators yet';

        var kegeratorsHtml = '<div class="venue-kegerators-container">';
        var flavor;
        for(var i = 0; i < venue.kegerators.length; i++){
            var fees = venue.kegerators[i].tapsCount == 1 ? 128 : (venue.kegerators[i].tapsCount == 2 ? 118 : 108);
            kegeratorsHtml += '<div class="table-kegerator-div"> '+venue.kegerators[i].tapsCount+' tap(s): ';
            for(var c = 0; c < venue.kegerators[i].taps.length; c++){
                flavor = Flavors.findOne(venue.kegerators[i].taps[c].flavor);
                kegeratorsHtml += '<div class="table-kegerator-flavor-div" style="background-image:url(\''+(flavor ? flavor.icon : '') +'\');"></div>';
            }
            kegeratorsHtml += '<div style="font-size: 12px;">'+venue.kegerators[i].tapsCount+' &times; $'+fees+' = <b>$'+ (fees*venue.kegerators[i].tapsCount) +'</b>/week</div>';
            kegeratorsHtml += '</div>';
        }
        kegeratorsHtml += '</div>';

        return kegeratorsHtml;
    }

    this.summarizedCost = function(multiplier){
        console.log(multiplier);
        var kegerators = this.kegerators;
        var sum = 0;
        if( typeof kegerators != 'undefined' ){
            for(var i = 0; i < kegerators.length; i++){
                sum += (138 - 10*kegerators[i].tapsCount) * kegerators[i].tapsCount;
            }
        }

        if( multiplier )
            return multiplier*sum;
        else
            return sum;
    }

    this.renderKegCharges = function(){
        var user = Meteor.users.findOne(this.user_id);
        if( !user )
            return '';
        var paymentCycle = App.getPaymentCycle(user.profile.paymentCycle);

        var html = '<div class="keg-charges-container">' +
                        '<h3 class="subtitle" style="border-bottom: 1px solid #c7c7c7; padding-bottom: 15px;">Weekly charges of venue</h3>';
        for(var i = 0; i < this.kegerators.length; i++){
            html += '<div class="keg-charges-keg-row">';
            html +=     '<div class="keg-charges-keg-row-subtotal">Kegerator subtotal: <b><span class="keg-charge" style="margin-right: 10px;">$'+((138 - 10*this.kegerators[i].tapsCount) * this.kegerators[i].tapsCount) +'</span></b></div>';
            for(var c = 0; c < this.kegerators[i].taps.length; c++){
                var flavor = Flavors.findOne(this.kegerators[i].taps[c].flavor);
                var numText = c+1 == 1 ? '1st' : (c+1 == 2 ? '2nd' : '3rd');
                html += '<div class="keg-charges-tap-row">' +
                            '<div class="keg-charges-tap-row-label">'+numText+' tap:</div>'+ '<img class="keg-charges-tap-row-icon tap-row-icon" src="'+flavor.icon+'" />' + flavor.name +
                            '<span class="keg-charge">$'+(138 - 10*this.kegerators[i].tapsCount)+'</span>' +
                        '</div>';
            }
            html += '</div>';
        }
        var sum = this.summarizedCost();
        html +=     '<div class="keg-charges-total">Weekly charge: ' +
                        '<span class="keg-charge">$'+sum+'</span>' +
                    '</div>' +
                    '<div class="keg-charges-total">Total: ' +
                        '<span style="font-weight: normal; font-size: 14px;">(Charged on every '+paymentCycle.text1+')</span> ' +
                        '<span class="keg-charge">' + paymentCycle.multiplier + ' &times; $'+ sum +' = $'+(paymentCycle.multiplier*sum)+'</span>' +
                    '</div>' +
                '</div>';

        return html;
    }

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

    this.getCollectionObject = function(){
        var modelAttrs = {};
        var attr = '';
        for(i = 0; i < modelAttributes.length; i++){
            attr = modelAttributes[i];
            modelAttrs[attr] = this[attr];
        }

        return modelAttrs;
    };

    this.setAttributes(doc);

    return this;
};