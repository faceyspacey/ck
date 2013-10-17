
notEmptyInput = function(input){
    return ((input.val() != input.data('placeholder')) && (_.compact(input.val().split(' ')).length != 0));
};

emptyFieldError = function(fieldName){
  return '<div class="input-error-msg"><b><i>'+fieldName+'</i></b> can not be blank.</div>';
};

Handlebars.registerHelper('notEmptyClass', function(placeholder, value) {
    return (value != placeholder  && _.compact(value.split(' ')).length > 0) ? 'notEmpty' : '';
});

Handlebars.registerHelper('errorClass', function(error) {
    return error ? 'error' : '';
});

Handlebars.registerHelper('showError', function(error) {
    return error ? error : '';
});

Handlebars.registerHelper('isSelectedOption', function(selected, value) {
    return selected == value ? 'selected=selected' : '';
});

Handlebars.registerHelper('monthOptions', function(){
    return _.range(1, 13);
});

Handlebars.registerHelper('yearOptions', function(start, end){
    return _.range(parseInt(start), parseInt(end)+1);
});

Handlebars.registerHelper('placeholder', function(placeholder, value){
    return value ? value : placeholder;
});