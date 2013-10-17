
/** MessageModel attributes:
 *
 *  collectionName              'Messages'
 *  _id                         Str
 *  user_id                     Str
 *  from                        Str => email address
 *  message_num                 Int
 *  type                        Int
 *  content                     Str
 *  created_at                  Date
 *  updated_at                  Date
 *
 */

MessageModel = function(doc){
    this.collectionName ='Messages';
    this.defaultValues = {
        type: 1
    };

    this.getType = function(){
        return App.messageTypes[this.type] || {};
    };

    this.user = function(){
        return Meteor.users.findOne(this.user_id);
    };

    this.send = function(){
        this.refresh();
        Meteor.call('sendAdminEmail', this.from, 'Client feedback: '+this.getType().subject, Template.admin_contact_message(this), function(err, res){ console.log(res)});
        Meteor.call('sendCustomerEmail', this.from, 'Message sent with subject: '+this.getType().subject, 'Your message: '+this.content, function(err, res){ console.log(res)});
    };

    _.extend(this, Model);
    this.extend(doc);

    return this;
};
