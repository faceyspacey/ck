KegeratorModel = function(doc){
	this.collectionName ='Kegerators';
    this.defaultValues = {
        _id: '',
        user_id: '',
        venue_id: '',
        type_id: 2,
        requested_date: 0,
        installed: false,
        installed_date: 0
    };

    this.typeName = function(){
        return typeof App.kegeratorTypes[this.type_id] != "undefined" ? App.kegeratorTypes[this.type_id].name : '';
    };

    this.formattedRequestedAt = function(){
		return moment(this.venue().kegerator_request_date).format("ddd, MMM Do, h:mm a");
    };

    this.formattedInstalledAt = function(){
		return moment(this.installed_date).format("ddd, MMM Do, h:mm a");
    };

    this.makeItInstalled = function(){
        this.save({installed: true, installed_date: new Date});
        this.venue().checkKegeratorRequests();
    };

    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

    this.venue = function(){
        return Venues.findOne(this.venue_id);
    };

    this.taps = function(){
        if(!this.type_id || (typeof App.kegeratorTypes[this.type_id] == 'undefined')) return 0;

        return App.kegeratorTypes[this.type_id].taps;
    };

    _.extend(this, Model);
	this.extend(doc);

    return this;
};
