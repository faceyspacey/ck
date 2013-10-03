
Template.select_options.selected = function(selected_id){
    console.log('selected: '+ selected_id);
    console.log('value: '+this.value);
    return selected_id == this.value ? 'selected="selected"' : '';
}