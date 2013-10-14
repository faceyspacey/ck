
/** MessageModel attributes:
 *
 *  collectionName              'Messages'
 *  _id                         Str
 *  user_id                     Str
 *  message_num                 Int
 *  type                        Int
 *  message                     Str
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
    }

    _.extend(this, Model);
    this.extend(doc);

    return this;
};
