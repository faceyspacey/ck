
Kegs = new Meteor.Collection('kegs', {
    reactive: true,
    transform: function (doc) { return new KegModel(doc); }
});

Meteor.subscribe('kegs');