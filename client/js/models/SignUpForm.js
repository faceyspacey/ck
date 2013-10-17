
/** OrderedFlavorModel attributes:
 *
 *  collectionName              'SignUpForms'
 *  _id                         Str
 *
 */

SignUpForm = function(doc){

    this.collectionName = 'SignUpForms';
    this.defaultValues = {
        step_1: {
            venue_name: {placeholder: 'Venue Name', value: '', error: false},
            venue_address: {placeholder: 'Address', value: '', error: false},
        },
        step_2: { },
        step_3: { },
        step_4: { },
        step_5: { },
    };


    _.extend(this, Model);
    this.extend(doc);

    return this;
};
