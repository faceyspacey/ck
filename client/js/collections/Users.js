
Meteor.subscribe('users');

/*
 Users = Meteor.users.find({}, {
 reactive: true,
 transform: function (doc) { return new UserModel(doc); }
 });
 */