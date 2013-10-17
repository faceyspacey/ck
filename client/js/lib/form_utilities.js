
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

Handlebars.registerHelper('yearOptions', function(){
    return _.range(2013, 2022);
});

Handlebars.registerHelper('placeholder', function(placeholder, value){
    return value ? value : placeholder;
});


isValidPhone = function(phone) {
	var digits = phone.replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/ /g, "");

	if(!(digits.length == 10 || digits.length == 11)) return false;
	return digits;
};

isValidEmail = function(email) {
  	var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	if(!regex.test(email)) return false
	return true;
}