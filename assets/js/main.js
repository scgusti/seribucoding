/*
	Spectral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#page-wrapper'),
		$banner = $('#banner'),
		$header = $('#header');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-mobile');
		else {

			breakpoints.on('>medium', function() {
				$body.removeClass('is-mobile');
			});

			breakpoints.on('<=medium', function() {
				$body.addClass('is-mobile');
			});

		}

	// Scrolly.
		$('.scrolly')
			.scrolly({
				speed: 1500,
				offset: $header.outerHeight()
			});

	// Menu.
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right',
				target: $body,
				visibleClass: 'is-menu-visible'
			});

	// Header.
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom:		$header.outerHeight() + 1,
				terminate:	function() { $header.removeClass('alt'); },
				enter:		function() { $header.addClass('alt'); },
				leave:		function() { $header.removeClass('alt'); }
			});

		}

		// Inisialisasi animasi Lottie: Memuat animasi Lottie pada kontainer dengan id "scrollToTopBtn" 
		var scrollToTopAnim = lottie.loadAnimation({
			container: document.getElementById('scrollToTopBtn'), // Elemen tempat animasi ditampilkan
			renderer: 'svg',  // Menggunakan renderer SVG untuk kualitas yang lebih baik
			loop: true,        // Animasi akan loop secara terus-menerus
			autoplay: true,    // Animasi akan otomatis diputar ketika dimuat
			path: 'images/goup.json' // Lokasi file animasi JSON
		});
		// Menambahkan efek scroll untuk tombol scroll-to-top
		$(document).ready(function() {
			var $scrollToTop = $('#scrollToTopBtn');  // Tombol untuk scroll ke atas

		// Menampilkan tombol saat halaman discroll lebih dari 200px
			$(window).on('scroll', function() {
				if ($(window).scrollTop() > 200) {
					$scrollToTop.fadeIn();
				} else {
					$scrollToTop.fadeOut();
				}
			});

		// Menambahkan smooth scroll ke atas saat tombol diklik
			$scrollToTop.on('click', function(e) {
				e.preventDefault();
				// Menambahkan efek smooth scroll saat tombol diklik
				$('html, body').animate({ scrollTop: 0 }, 1000); // 1000ms (1 detik)
			});
		});

})(jQuery);