(function($) {
  $.fn.placeholder = function() {
    if(typeof document.createElement("input").placeholder == 'undefined') {
	  $('[placeholder]').each(function() {
		 $(this).val($(this).attr('placeholder'));
	  });	
	
      $('[placeholder]').live('focus', function() {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
          input.val('');
          input.removeClass('placeholder');
        }
      }).live('blur', function() {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
          input.addClass('placeholder');
          input.val(input.attr('placeholder'));
        }
      }).blur().parents('form').live('submit', function() {
        $(this).find('[placeholder]').each(function() {
          var input = $(this);
          if (input.val() == input.attr('placeholder')) {
            input.val('');
          }
      })
    });
  }
}
})(jQuery);