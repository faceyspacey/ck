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
			if(isMobile) {
				$('#mobile_container').css({
					width: width ,//- 4, //subtract the border
					height: height,// - 4, //subtract the border
					top: 0,
					left: 0,
					marginLeft: 0
				});
			}
		},
		resizeVenuesSidebar: function(width, height) {
			$('#mobile_sidebar').height(height);
		},
		resizeMobilePages: function(width, height) {
			$('.mobile_pages').css('width', $('#mobile_container').width());
			$('.mobile_pages').css('height', $('#mobile_container').height() - 45 - 45); //subtract height of footer and toolbar
		},
		resizeSlidingPageWrapper: function(width, height) {
			$('#sliding_page_wrapper').css('width', $('.mobile_pages').length * $('#mobile_container').width());
			$('#sliding_page_wrapper').css('height', $('#mobile_container').height() - 45 - 45); //subtract height of footer and toolbar
		}
	}
});


resizeable = new Resizeable;

