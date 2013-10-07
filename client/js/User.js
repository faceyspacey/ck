

User = (function(){
    var _id;
    var emails = [];
    var profile = {};

    function getKegs(conditions){
        var condition = {};
        _.extend(condition, conditions);
        return Kegs.find(condition);
    };


    function getVenueIDs(){
        return _.keys(_.pluck(Venues.find({user_id: Meteor.userId()}).fetch(), '_id'));
    }

    function getKegCharges(user_id){
        //console.log(user_id);
        var charging = {};
        _.each(App.paymentCycles, function(cycle){
            charging[cycle.id] = {
                name: cycle.name,
                count: User.getKegs({user_id: user_id, paymentCycle: cycle.id}).count(),
                total: _.reduce(_.pluck(User.getKegs({user_id: user_id, paymentCycle: cycle.id}).fetch(), 'price'), function(memo, num){ return memo + num; }, 0),
                cycles: (function(cycle){
                    var cycles = {};
                    _.each(App.paymentDays, function(day){
                        cycles[cycle.id+'-'+day.id] = {
                            name: cycle.name+' on '+day.name,
                            count: User.getKegs({user_id: user_id, paymentCycle: cycle.id, paymentDay: day.id}).count(),
                            total:  _.reduce(_.pluck(User.getKegs({user_id: user_id, paymentCycle: cycle.id, paymentDay: day.id}).fetch(), 'price'), function(memo, num){ return memo + num; }, 0),
                            flavors: (function(cycle, day){
                                var flavors = {};
                                _.each(User.getKegs({user_id: user_id, paymentCycle: cycle.id, paymentDay: day.id}).fetch(), function(keg){
                                    if( typeof flavors[keg.flavor_id] == 'undefined' ){
                                        flavors[keg.flavor_id] = {
                                            icon: keg.flavor().icon,
                                            name: keg.flavor().name,
                                            count: User.getKegs({user_id: user_id, paymentCycle: cycle.id, paymentDay: day.id, flavor_id: keg.flavor_id}).count(),
                                            total: _.reduce(_.pluck(User.getKegs({user_id: user_id, paymentCycle: cycle.id, paymentDay: day.id, flavor_id: keg.flavor_id}).fetch(), 'price'), function(memo, num){ return memo + num; }, 0),
                                        }
                                    }
                                });
                                return flavors;
                            })(cycle, day),
                        };
                    });
                    return cycles;
                })(cycle),
            };
        });

        //console.log(charging);
        return charging;
    }


    function renderKegCharges(user_id){
        var charging = getKegCharges(user_id);

        var html = '<div class="keg-charges-container">' +
            '<h3 class="subtitle" style="margin-bottom: 20px;">Keg Charges</h3>';
        for(var i in charging){
            html +=     '<div class="keg-charges-cycle">';
            html +=         '<div class="keg-charges-cycle-total">' +
                '<div class="keg-charges-cycle-name">' + charging[i].name + '</div>' +
                '<div class="keg-charges-cycle-count">' + charging[i].count + ' keg(s) </div>' +
                '<span class="keg-charge">$'+charging[i].total+'</span>' +
                '</div>';
            for(var c in charging[i].cycles){
                if( charging[i].cycles[c].total == 0 )
                    continue;
                html +=     '<div class="keg-charges-period">';
                html +=         '<div class="keg-charges-period-subtotal">' +
                    '<div class="keg-charges-period-name">' + charging[i].cycles[c].name + '</div>' +
                    '<div class="keg-charges-period-count">' + charging[i].cycles[c].count + ' keg(s) </div>' +
                    '<span class="keg-charge">$'+charging[i].cycles[c].total+'</span>' +
                    '</div>';
                for(var d in charging[i].cycles[c].flavors){
                    html +=     '<div class="keg-charges-flavor-row">' +
                        '<div class="keg-charges-flavor-icon" style="background-image:url('+charging[i].cycles[c].flavors[d].icon+');"></div>' +
                        '<div class="keg-charges-flavor-name">' + charging[i].cycles[c].flavors[d].name + '</div>' +
                        '<div class="keg-charges-flavor-count">' + charging[i].cycles[c].flavors[d].count + ' keg(s) </div>' +
                        '<span class="keg-charge">$'+charging[i].cycles[c].flavors[d].total+'</span>' +
                        '</div>';
                }
                html +=     '</div>';
            }
            html +=     '</div>';
        }
        html +=     '</div>';

        return html;
    }

    return {
        getKegs: getKegs,
        getVenueIDs: getVenueIDs,
        renderKegCharges: renderKegCharges,
    };
})();

window.User = User;

