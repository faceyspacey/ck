Flavors = new Meteor.Collection('flavors');

Meteor.publish("flavors", function () {
    if(Roles.userIsInRole(this.userId, ['admin'])) return Flavors.find({});
    else return Flavors.find({is_public: true});
});

Meteor.startup(function(){
    if( Flavors.find().count() === 0 ){
        var defaultFlavors = [
            {   _id:    'random',
                icon:   '/images/flavor-icons/dices.png',
                keg_icon: '/images/flavor-icons/keg_140x140.png',
                one_off_quantity_available: 0,
                is_public: true,
                name:   'Random'
            },
            {   icon:   '/images/flavor-icons/lemon-icon.png',
                keg_icon: '/images/flavor-icons/keg_140x140.png',
                one_off_quantity_available: 0,
                is_public: true,
                name:   'Lemon'
            },
            {   icon:   '/images/flavor-icons/apple-icon.png',
                keg_icon: '/images/flavor-icons/keg_140x140.png',
                one_off_quantity_available: 0,
                is_public: true,
                name:   'Apple'
            },
            {   icon:   '/images/flavor-icons/strawberry-icon.png',
                keg_icon: '/images/flavor-icons/keg_140x140.png',
                one_off_quantity_available: 0,
                is_public: true,
                name:   'Strawberry'
            },
            {   icon:   '/images/flavor-icons/cherry-icon.png',
                keg_icon: '/images/flavor-icons/keg_140x140.png',
                one_off_quantity_available: 0,
                is_public: true,
                name:   'Cherry'
            },
        ];
        for(var i = 0; i < defaultFlavors.length; i++){
            Flavors.insert(defaultFlavors[i]);
        }
    }
});


Flavors.allow({
    insert: function(userId, doc) {
        doc.user_id = userId;
        doc.created_at = new Date;
        doc.updated_at = new Date;
        return Roles.userIsInRole(userId, ['admin']);
    },
    update: function(userId, doc, fields, modifier) {
        doc.updated_at = new Date;
        return Roles.userIsInRole(userId, ['admin']);
    },
    remove: function(userId, doc) {
        return Roles.userIsInRole(userId, ['admin']);
    },
    fetch: ['user_id', 'created_at', 'updated_at']
});

Meteor.methods({
	decremenFlavorQuantity: function(flavorId, quantity) {
		Flavors.update(flavorId, {$inc: {one_off_quantity_availible: -1 * quantity}});
	}
});

