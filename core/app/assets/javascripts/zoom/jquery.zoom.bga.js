/*
	jQuery Zoom v1.7.1 - 2013-03-12
	(c) 2013 Jack Moore - jacklmoore.com/zoom
	license: http://www.opensource.org/licenses/mit-license.php
	***
	modified by Bruno Guerra
*/
(function ($) {
	var defaults = {
		url: false,
		callback: false,
		target: false,
		duration: 120,
		on: 'mouseover' // other options: 'grab', 'click', 'toggle'
	};

	// Core Zoom Logic, independent of event listeners.
	$.zoom = function(target, source, img) {
		var outerWidth,
			outerHeight,
			xRatio,
			yRatio,
			offset,
			position = $(target).css('position');

		// The parent element needs positioning so that the zoomed element can be correctly positioned within.
		$(target).css({
			position: /(absolute|fixed)/.test() ? position : 'relative',
			overflow: 'hidden'
		});

		$(img)
			.addClass('zoomImg')
			.addClass(source.id)
			.css({
				position: 'absolute',
				top: 0,
				left: 0,
				opacity: 0,
				width: img.width,
				height: img.height,
				border: 'none',
				maxWidth: 'none'
			})
			.appendTo(target);

		return {
			
			init: function() {
				outerWidth = $(target).outerWidth();
				outerHeight = $(target).outerHeight();
				xRatio = ($(img).width() - outerWidth) / $(source).outerWidth();
				yRatio = ($(img).height() - outerHeight) / $(source).outerHeight();
				offset = $(source).offset();
			},
			move: function (e) {
				var left = (e.pageX - offset.left),
					top = (e.pageY - offset.top);

				top = Math.max(Math.min(top, outerHeight), 0);
				left = Math.max(Math.min(left, outerWidth), 0);

				img.style.left = (left * -xRatio) + 'px';
				img.style.top = (top * -yRatio) + 'px';
			}
		};
	};

	$.fn.zoom = function (options) {
		return this.each(function () {
			var
			settings = $.extend({}, defaults, options || {}),
			//target will display the zoomed iamge
			target = settings.target || this,
			//source will provide zoom location info (thumbnail)
			source = this,
			img = document.createElement('canvas'),
			$img = $(img),
			mousemove = 'mousemove',
			clicked = false,
			lastMouse;

			// If a url wasn't specified, look for an image element.
			if (!settings.url) {
				settings.url = $(source).find('img').attr('src');
				if (!settings.url) {
					return;
				}
			}
			
			var imageData = new Image(); 

			$(imageData).one('load', function () {
				img.width = imageData.width;
				img.height = imageData.height;
				img.imgSrc = imageData;
				
				var defaultMouse = { 
					pageX: $(source).offset().left   + ($(source).width() / 2),
					pageY: $(source).offset().top    + ($(source).height() / 2),
					offsetX: $(source).offset().left   + ($(source).width() / 2),
					offsetY: $(source).offset().top    + ($(source).height() / 2)
				};
				
				var ctx = img.getContext('2d');
				ctx.drawImage(imageData, 0, 0, imageData.width, imageData.height);
				
				
				var zoom = $.zoom(target, source, img);				
				
				function start(e) {
					zoom.init();
					zoom.move(e);

					// Skip the fade-in for IE8 and lower since it chokes on fading-in
					// and changing position based on mousemovement at the same time.
					$img.stop()
					.fadeTo($.support.opacity ? settings.duration : 0, 1);
				}

				function stop() {
					$img.stop()
					.fadeTo(settings.duration, 0);
				}

				if (settings.on === 'grab') {
					$(source).on('mousedown',
						function (e) {
							$(document).one('mouseup',
								function () {
									stop();

									$(document).off(mousemove, zoom.move);
								}
							);

							start(e);

							$(document).on(mousemove, zoom.move);

							e.preventDefault();
						}
					);
				} else if (settings.on === 'click') {
					$(source).on('click',
						function (e) {
							if (clicked) {
								// bubble the event up to the document to trigger the unbind.
								return;
							} else {
								clicked = true;
								start(e);
								$(document).on(mousemove, zoom.move);
								$(document).one('click',
									function () {
										stop();
										clicked = false;
										$(document).off(mousemove, zoom.move);
									}
								);
								return false;
							}
						}
					);
				} else if (settings.on === 'toggle') {
					$(source).on('click',
						function (e) {
							clicked = $(this).attr('data-clicked') == 'true';
							if (clicked) {
								stop();
							} else {
								start(e);
							}
							clicked = !clicked;
							$(this).attr('data-clicked', clicked);
						}
					);
				} else if (settings.on === 'toggle-hard') {
					$img.draggable({
						start: function(e) { lastMouse = e; console.log(e); } 
					});
					
					$(source)
					  .on('click',
							function (e) {
								clicked = ($(this).attr('data-clicked') == 'true');
								if (!clicked) {
									if (!e.shiftKey) {
										start(e);
										clicked = !clicked;
										$(this).attr('data-clicked', clicked);
										lastMouse = e;
									}
								}
							}
						)
					  .on('dblclick',
							function (e) {
								clicked = $(this).attr('data-clicked') == 'true';
								if (clicked) {
									stop();
									clicked = !clicked;
									$(this).attr('data-clicked', clicked);
								}
							}
						)
						.on('mousemove',
							function(e) {
								if (e.ctrlKey) {
									zoom.move(e);
									lastMouse = e;
								}
								lastMouse = lastMouse || e;
							})
						.on('activateZoom',
							function(e) {									
									lastMouse = lastMouse || defaultMouse;
									start(lastMouse);
							});
				} else {
					zoom.init(); // Pre-emptively call init because IE7 will fire the mousemove handler before the hover handler.

					$(source)
						.on('mouseenter', start)
						.on('mouseleave', stop)
						.on(mousemove, zoom.move);
				}

				if ($.isFunction(settings.callback)) {
					settings.callback.call(img);
				}
			}).each(function() {
				imageData.src = settings.url;
				if(this.complete) $(this).load();
			});
			
		});
	};

	$.fn.zoom.defaults = defaults;
}(window.jQuery));