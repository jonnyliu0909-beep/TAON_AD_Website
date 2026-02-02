/* --------------------------------------------------
	Initialization
-------------------------------------------------- */

    // Initialize all functions when the document is ready.
	$(document).ready(function(){
		initResize();
		initScroller();
		initAnimation();
		initowlCarousel();
		initContactAjax();
		initServiceLinks();
	});


/* --------------------------------------------------
	Scroll Nav
-------------------------------------------------- */

	function initScroller () {
		// Check if localScroll plugin is available
		if (typeof $.fn.localScroll === 'undefined') {
			console.log('localScroll plugin not loaded, skipping initialization');
			return;
		}
		
		// Only initialize if elements exist
		if ($('#scroll-page-content').length > 0) {
			$('#scroll-page-content').localScroll({
				target:'#page-content'
			});
		}
		
		if ($('#page-top').length > 0) {
			$('#page-top').localScroll({
				target:'body'
			});
		}
	}


/* --------------------------------------------------
	Animation
-------------------------------------------------- */

	function initAnimation () {
		// Check if WOW is available before using it
		if (typeof WOW === 'undefined') {
			console.log('WOW animation library not loaded, skipping initialization');
			return;
		}
		new WOW().init();
	}


	
/* --------------------------------------------------
	Owl Carousel
-------------------------------------------------- */

	function initowlCarousel () {
		// Check if owlCarousel is available before using it
		if (typeof $.fn.owlCarousel === 'undefined') {
			console.log('owlCarousel not loaded, skipping initialization');
			return;
		}
		
		// Only initialize if elements exist
		if ($("#owl-blog").length > 0) {
			$("#owl-blog").owlCarousel({
				autoPlay: 3000,
				items : 3,
				itemsDesktop : [1199,3],
				itemsDesktopSmall : [979,2],
				itemsTablet : [768, 1],
				itemsMobile : [479, 1],
				navigation: false
			});
		}
		
		if ($("#owl-branding").length > 0) {
			$("#owl-branding").owlCarousel({
				autoPlay: 3000,
				items : 5,
				itemsDesktop : [1199,4],
				itemsDesktopSmall : [979,3],
				itemsTablet : [768, 2],
				itemsMobile : [479, 2],
				navigation: false
			});
		}
	}

/* --------------------------------------------------
	Resize
-------------------------------------------------- */

	function initResize () {
		var header = $(".header-text");
		$(window).scroll(function() {
			var scroll = $(window).scrollTop();
			if ($(".index-page").length > 0) {
				if (scroll >= 270) {
					header.addClass("remove");
				} else {
					header.removeClass("remove");
				}
			} else {
				if (scroll >= 120) {
					header.addClass("remove");
				} else {
					header.removeClass("remove");
				}
			}
		});
		
		$(window).resize(function(){
			var footerHeight = $('#footer').outerHeight();
			// Reserve bottom margin only on the homepage where footer is fixed
			if ($('body').hasClass('index-page')) {
				$('#page-content').css({'marginBottom': footerHeight + 'px'});
			} else {
				$('#page-content').css({'marginBottom': '0px'});
			}
		});
		$(window).resize();
	}
	

/* --------------------------------------------------
	Ajax Contact Form
-------------------------------------------------- */

	function initContactAjax () {
		// Handle form1 (main contact form) - redirect to leave-message page
		$('#form1').on('submit', function(e){
			e.preventDefault();
			var $form = $(this);
			var $submit = $('#submitcontact');
		   
			var proceed = true;
			// simple validation
			$form.find('input[required], textarea[required]').each(function(){
				var $el = $(this);
				$el.css('border-color','');
				if(!$.trim($el.val())){
					$el.css('border-color','red');
					proceed = false;
				}
				// improved email validation
				if($el.attr('type') === 'email'){
					var email_reg = /^[\w.-]+@([\w-]+\.)+[A-Za-z]{2,}$/;
					if(!email_reg.test($.trim($el.val()))){
						$el.css('border-color','red');
						proceed = false;
					}
				}
			});
		   
			if(proceed) {
				// Get form data
				var formData = {
					name: $form.find('input[name="name"]').val(),
					email: $form.find('input[name="email"]').val(),
					subject: $form.find('input[name="subject"]').val(),
					message: $form.find('textarea[name="message"]').val()
				};
				
				// Try to store in sessionStorage, fallback to URL parameters if blocked
				try {
					if (typeof(Storage) !== "undefined" && sessionStorage) {
						sessionStorage.setItem('contactFormData', JSON.stringify(formData));
					}
				} catch (e) {
					console.warn('sessionStorage not available, using URL parameters:', e);
				}
				
				// Build URL with parameters as fallback (compatible with older browsers)
				var urlParams = [];
				urlParams.push('from=contact');
				urlParams.push('name=' + encodeURIComponent(formData.name));
				urlParams.push('email=' + encodeURIComponent(formData.email));
				urlParams.push('subject=' + encodeURIComponent(formData.subject));
				urlParams.push('message=' + encodeURIComponent(formData.message));
				
				// Redirect to leave-message page
				window.location.href = 'leave-message.html?' + urlParams.join('&');
			}
		});
		
		// Bind to form submit to support Enter key and avoid multiple bindings
		$('#contact_form').on('submit', function(e){
			e.preventDefault();
			var $form = $(this);
			var $submit = $('#submit_btn'); 
		   
			var proceed = true;
			// simple validation
			$form.find('input[required], textarea[required]').each(function(){
				var $el = $(this);
				$el.css('border-color','');
				if(!$.trim($el.val())){
					$el.css('border-color','red');
					proceed = false;
				}
				// improved email validation
				if($el.attr('type') === 'email'){
					var email_reg = /^[\w.-]+@([\w-]+\.)+[A-Za-z]{2,}$/;
					if(!email_reg.test($.trim($el.val()))){
						$el.css('border-color','red');
						proceed = false;
					}
				}
			});
		   
			if(proceed) {
				// Get form data
				var formData = {
					name: $form.find('input[name="name"]').val(),
					email: $form.find('input[name="email"]').val(),
					subject: $form.find('input[name="subject"]').val() || $form.find('select[name="subject"]').val(),
					message: $form.find('textarea[name="message"]').val()
				};
				
				// Try to store in sessionStorage, fallback to URL parameters if blocked
				try {
					if (typeof(Storage) !== "undefined" && sessionStorage) {
						sessionStorage.setItem('contactFormData', JSON.stringify(formData));
					}
				} catch (e) {
					console.warn('sessionStorage not available, using URL parameters:', e);
				}
				
				// Build URL with parameters as fallback (compatible with older browsers)
				var urlParams = [];
				urlParams.push('from=contact');
				urlParams.push('name=' + encodeURIComponent(formData.name));
				urlParams.push('email=' + encodeURIComponent(formData.email));
				urlParams.push('subject=' + encodeURIComponent(formData.subject));
				urlParams.push('message=' + encodeURIComponent(formData.message));
				
				// Redirect to leave-message page
				window.location.href = 'leave-message.html?' + urlParams.join('&');
			}
		});
		
		//reset previously set border colors and hide all message on input
		$("#form1 input[required], #form1 textarea[required], #contact_form input[required], #contact_form textarea[required]").on('input', function() { 
			$(this).css('border-color',''); 
		});
	}

/* --------------------------------------------------
	Service items link to the Leave A Message page (standalone)
-------------------------------------------------- */
	function initServiceLinks () {
		console.log('initServiceLinks: binding click handlers');
		// make only the service icon images clickable (better UX)
		$('.service-item .icon img').css('cursor','pointer').on('click', function(e){
			e.preventDefault();
			e.stopPropagation();
			// Always go to standalone Leave A Message page
			window.location.href = 'leave-message.html';
		});
	}