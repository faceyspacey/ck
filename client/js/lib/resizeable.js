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
			height = $(window).height()
			header = 45,
			footer = isMobile ? 46 : 0;
		
		for (var resizeFunc in this.elements) {
			this.elements[resizeFunc].call(this, width, height, header, footer);
		}
	},
	elements: {
		resizeLogo: function(width, height) {
			$('#m_logo').css({
				width: width < 505 ? width : 505
			});
			$('#m_tagline').css({
				width: width < 505 ? width/505 * 289 : 289
			});
		},
		resizeBodyContainer: function(width, height) {
			if(isMobile) {
				$('#homepage-signup-button').css({
					bottom: 30
				});
				
				$('#mobile_container').css({
					width: width,//- 4, //subtract the border
					height: height,// - 4, //subtract the border
					top: 0,
					left: 0,
					marginLeft: 0
				});
				
				$('body').css({height: height});
			}
			else {
				$('body').css({
					overflow: 'scroll'
				});
				$('#fake_body').css({
					height: height,
					position: 'fixed'
				})
			}			
		},
		resizeHeader: function() {
			if(isMobile && (Meteor.user() || Session.get('step_type') == 'signup')) $('#navi-top').hide();
		},
		reiszeFooter: function() {
			if(!isMobile) $('#mobile_footer').hide();
		},
		resizeMobileContainer: function(width, height) {		
			if(!isMobile) $('#mobile_container').addClass('mobile_container_on_desktop');
		},
		resizeMobilePages: function(width, height, header, footer) {
			$('.mobile_pages').css('width', $('#mobile_container').width());
			$('.mobile_pages').css('height', $('#mobile_container').height() - footer - header); //subtract height of footer and toolbar
		},
		resizeSlidingPageWrapper: function(width, height, header, footer) {
			$('#sliding_page_wrapper').css('width', $('.mobile_pages').length * $('#mobile_container').width());
			$('#sliding_page_wrapper').css('height', $('#mobile_container').height() - footer - header); //subtract height of footer and toolbar
		},
		resizeVenuesSidebar: function(width, height) {
			$('#mobile_sidebar').css('height', $('#mobile_container').height());
		},
	}
});


resizeable = new Resizeable;

