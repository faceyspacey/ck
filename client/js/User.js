

User = (function(doc){
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
        var user = Meteor.users.findOne(user_id);
        return user ? (new VenueModel()).getKegCharges(this) : '';
    }

    _.extend(this, doc);

    return {
        getKegs: getKegs,
        getVenueIDs: getVenueIDs,
        getKegCharges: getKegCharges,
    };
})();

window.User = User;

