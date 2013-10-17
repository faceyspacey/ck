Resizeable = Class.extend({
	init: function(immediateResize) {
		if(immediateResize) this.resizeAllElements();  
		
		var _this = this;
	    $(window).resize(function() {
			_this.resizeAllElements();
		});
	},
	resizeAllElements: function() {
		var width = $(window).width(), 
			height = $(window).height();
		
		for (var resizeFunc in this.elements) {
			this.elements[resizeFunc].call(this, width, height);
		}
	},
	elements: {
		resizeBodyContainer: function(width, height) {
		    //$('.mobile_container').css('height', height);
		},
		resizeMobilePages: function(width, height) {
			$('.mobile_pages').css('width', $('#mobile_container').width());
			$('.mobile_pages').css('height', $('#mobile_container').height());
		},
		resizeSlidingPageWrapper: function(width, height) {
			$('#sliding_page_wrapper').css('width', $('.mobile_pages').length * $('#mobile_container').width());
			$('#sliding_page_wrapper').css('height', $('#mobile_container').height());
		}
	}
});

