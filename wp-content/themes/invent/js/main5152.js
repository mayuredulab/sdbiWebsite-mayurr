/*jshint undef: true, unused: false, vars: true, plusplus: true */
/*global jQuery:false, window: false, setInterval: false, clearTimeout: false, setTimeout: false, mo_options:false, mo_theme:false, template_dir:false, document:false  */

jQuery.noConflict();

var MO_THEME = {}; // theme namespace

/*================================== Theme Function init =======================================*/

(function ($) {

    "use strict";

    var touchDevice = (Modernizr.touch) ? true : false;
    var css3 = (Modernizr.csstransforms3d) ? true : false;

    MO_THEME = {

        touchDevice: (Modernizr.touch) ? true : false,

        css3: (Modernizr.csstransforms3d) ? true : false,

        timers: {},

        vendor_prefix: function () {

            var prefix;

            if (css3 === true) {
                var styles = window.getComputedStyle(document.documentElement, '');
                prefix = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];

                return prefix;
            }
        },

        is_mobile: function () {

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true;
            }
            return false;
        },

        // Helps to avoid continuous method execution as can happen in the case of scroll or window resize. Useful specially
        // when DOM access/manipulation is involved
        wait_for_final_event: function (callback, ms, uniqueId) {

            if (!uniqueId) {
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if (MO_THEME.timers[uniqueId]) {
                clearTimeout(MO_THEME.timers[uniqueId]);
            }
            MO_THEME.timers[uniqueId] = setTimeout(callback, ms);
        },

        toggle_html5_video_volume: function (video) {


            if (video.muted) {
                video.muted = false;
            } else {
                video.muted = true;
            }
        },

        // Enter negative percentage to darken; assumes presence of # - Credit: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color //
        shade_color: function (color, percent) {

            var num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt,
                G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        },

        add_body_classes: function () {
            if (MO_THEME.is_mobile()) {
                $('body').addClass('mobile-device');
            }
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                $('body').addClass('ios-device');
            }
            if (navigator.userAgent.match(/Android/i) !== null) {
                $('body').addClass('android-device');
            }
        },

        manipulate_dom: function () {
            $(".single-event strong:contains('Date/Time'),.single-event strong:contains('Location'), .single-event strong:contains('Categories')").addClass('heading-title');
            $(".single-location strong:contains('Address')").addClass('heading-title');
        },

        toggle_mobile_menu: function () {
            $('#mobile-menu-toggle').toggleClass('menu-open');
            $('body').toggleClass('push-right');
            $('#mobile-menu').toggleClass('slide-open');
        },

        display_stats: function () {
            /* ------- Skill Bar --------- */
            $('.stats-bar-content').each(function () {
                var dataperc = $(this).attr('data-perc');
                $(this).animate({"width": dataperc + "%"}, dataperc * 20);
            });

        },

        display_piecharts: function () {

            /* -------- Charts like Pie Chart -------- */
            var charts = $('.piechart .percentage'),
                bar_color = mo_theme.options.theme_skin,
                track_color = MO_THEME.shade_color(bar_color, 26);
            /* Lighten */
            charts.easyPieChart({
                animate: 2000,
                lineWidth: 20,
                barColor: bar_color,
                trackColor: track_color,
                scaleColor: false,
                lineCap: 'square',
                size: 250

            });
        },

        get_internal_link: function (urlString) {
            var internal_link = null;
            if (urlString.indexOf("#") !== -1) {
                var arr = urlString.split('#');
                if (arr.length === 2) {
                    var url = arr[0];
                    internal_link = '#' + arr[1];
                    // check if this internal link belongs to current URL
                    if (url === (document.URL + '/') || url === document.URL) {
                        return internal_link;
                    }
                } else if (arr.length === 1) {
                    internal_link = '#' + arr[0];
                    return internal_link;
                }
            }
            return internal_link;

        },

        highlight_menu: function () {

            var $active_menu_item;

            /* Do not highlight internal links */
            // make the current page active for highlight - top list cannot have both a parent and current page item
            $active_menu_item = $('#primary-menu > ul > li.current_page_item > a').not('a[href*="#"]').first();

            if ($active_menu_item.length === 0)
                $active_menu_item = $('#primary-menu > ul > li.current-menu-item > a').not('a[href*="#"]').first();

            if ($active_menu_item.length === 1)
                $active_menu_item.parent().addClass('active');

        },

        init_page_navigation: function () {

            MO_THEME.highlight_menu();

            var delay = (function () {
                var timer = 0;
                return function (callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            /*--- Sticky Menu -------*/
            var width = $(window).width();
            if (width > 768 && mo_theme.options.sticky_menu) {
                $('#header').waypoint('sticky', {
                    stuckClass: 'sticky',
                    offset: -300,
                    handler: function (direction) {
                        if (direction === "up") {
                            /* Reached the top and hence highlight current page link */
                            $('#primary-menu > ul > li').not(".hover-bg").each(function () {
                                $(this).removeClass('active');
                                MO_THEME.highlight_menu();
                            });
                        }
                    }

                })
            }

            /* ----- Smooth Scroll --------*/

            if ($().smoothScroll !== undefined) {
                $('#primary-menu > ul > li > a[href*="#"]').smoothScroll(
                    {preventDefault: true, easing: 'swing', speed: 700, offset: -50, exclude: ['.external a']});
                $('#mobile-menu a[href*="#"]').smoothScroll(
                    {easing: 'swing', speed: 700, offset: 0, exclude: ['.external a']});
            }


            /* --------- One Page Menu --------- */
            $('#primary-menu > ul > li > a[href*="#"]').click(function () {
                $(this).closest('ul').children('li').each(function () {
                    $(this).removeClass('active');
                });
                $(this).parent('li').addClass('active');
            });
            $('#primary-menu > ul > li > a[href*="#"]').each(function () {
                var current_div_selector = MO_THEME.get_internal_link($(this).attr('href')); // Give ids of div's with ids like #work,#service, #portfolio etc.

                $(current_div_selector).waypoint(function (direction) {
                        if (direction === "up") {
                            $('#primary-menu > ul > li').each(function () {
                                $(this).removeClass('active');
                                if ($(this).find('a').attr('href').indexOf(current_div_selector) !== -1) {
                                    $(this).addClass('active');
                                }
                            });
                        }
                    }, {
                        offset: function () {
                            var half_browser_height = $.waypoints('viewportHeight') / 2;
                            var element_height = $(this).height();
                            var result = 0;
                            if (element_height > half_browser_height) {
                                result = -(element_height - (half_browser_height)); // enable when top of the div is half exposed on the screen
                            } else {
                                result = -(element_height / 2); // enable the menu when everything is visible
                            }
                            return result;
                        }
                    }
                );
                $(current_div_selector).waypoint(function (direction) {
                    if (direction === "down") {
                        $('#primary-menu > ul > li').each(function () {
                            $(this).removeClass('active');
                            if ($(this).find('a').attr('href').indexOf(current_div_selector) !== -1) {
                                $(this).addClass('active');
                            }
                        });
                    }
                }, {offset: '50%'});
            });

        },

        init_menus: function () {
            /* For sticky and primary menu navigation */
            $('.dropdown-menu-wrap > ul').superfish({
                delay: 100, // one second delay on mouseout
                animation: {height: 'show'}, // fade-in and slide-down animation
                speed: 'fast', // faster animation speed
                autoArrows: false // disable generation of arrow mark-up
            });


            /* Take care of internal links too - close the menu when scrolling from internal links */
            $('#mobile-menu-toggle, #mobile-menu a[href*="#"]').click(function () {
                MO_THEME.toggle_mobile_menu();
                return true;
                /* must return true to record click event for smooth scroll of internal links */
            });

            /* Close the mobile menu if the user touches the right document when mobile menu is open */
            $('#container').on('click touchstart', function () {
                if ($('body').hasClass('push-right')) {
                    MO_THEME.toggle_mobile_menu();
                    return false;
                    /* no need to do anything else for now until menu closes */
                }
                return true;
                /* continue with normal click activity */
            });

            $("#mobile-menu ul li").each(function () {
                var sub_menu = $(this).find("> ul");
                if (sub_menu.length > 0 && $(this).addClass("has-ul")) {
                    $(this).append('<div class="sf-sub-indicator"><i class="icon-angle-right"></i></div>');
                }
            });

            $('#mobile-menu ul li:has(">ul") > div').click(function () {
                $(this).siblings("ul.sub-menu").stop(true, true).slideToggle();
                $(this).parent().toggleClass("open");
                return false;
            });

            MO_THEME.init_page_navigation();
        },

        scroll_effects: function () {
            if ($().waypoint === undefined) {
                return;
            }

            $(".features-list-alternate img").css('opacity', 0);

            $(".features-list-alternate img").waypoint(function (direction) {
                $(this).addClass("animated fadeIn");
            }, {
                offset: $.waypoints('viewportHeight') - 150,
                triggerOnce: true
            });


            /* ------------------- Stats -----------------------------*/

            $(".stats-bar").waypoint(function (direction) {

                MO_THEME.display_stats();

            }, {
                offset: $.waypoints('viewportHeight') - 200,
                triggerOnce: true
            });

            $(".piechart").waypoint(function (direction) {

                MO_THEME.display_piecharts();

            }, {
                offset: $.waypoints('viewportHeight') - 200,
                triggerOnce: true
            });

        },

        magnific_popup: function () {

            if ($().magnificPopup === undefined) {
                return;
            }

            $('.image-grid, .hfeed').each(function () {
                $(this).find('.lightbox-link').magnificPopup({

                    gallery: {
                        enabled: true
                    },
                    type: 'image'
                });
            });

            $('.video-popup').magnificPopup({
                type: 'iframe'
            });
        },

        toggle_state: function (toggle_element) {
            var active_class;
            var current_content;

            active_class = 'active-toggle';

            // close all others first
            toggle_element.siblings().removeClass(active_class);
            toggle_element.siblings().find('.toggle-content').slideUp("fast");

            current_content = toggle_element.find('.toggle-content');

            if (toggle_element.hasClass(active_class)) {
                toggle_element.removeClass(active_class);
                current_content.slideUp("fast");
            } else {
                toggle_element.addClass(active_class);
                current_content.slideDown("fast");
            }
        },

        validate_contact_form: function () {

            if ($().validate === undefined) {
                return;
            }
            /* ------------------- Contact Form Validation ------------------------ */
            var rules = {
                contact_name: {
                    required: true,
                    minlength: 5
                },
                contact_email: {
                    required: true,
                    email: true
                },
                contact_phone: {
                    required: false,
                    minlength: 5
                },
                contact_url: {
                    required: false,
                    url: false
                },
                message: {
                    required: true,
                    minlength: 15
                }
            };
            var messages = {
                contact_name: {
                    required: mo_theme.messages.name_required,
                    minlength: mo_theme.messages.name_format
                },
                contact_email: mo_theme.messages.email_required,
                contact_url: mo_theme.messages.url_required,
                contact_phone: {
                    minlength: mo_theme.messages.phone_required
                },
                message: {
                    required: mo_theme.messages.message_required,
                    minlength: mo_theme.messages.message_format
                }
            };
            $("#content .contact-form").validate({
                rules: rules,
                messages: messages,
                errorClass: 'form-error',
                submitHandler: function (theForm) {
                    $.post(
                        theForm.action,
                        $(theForm).serialize(),
                        function (response) {
                            $("#content .feedback").html('<div class="success-msg">' + mo_theme.messages.success_message + '</div>');
                            theForm.reset();
                        });
                }

            });
            $(".widget .contact-form").validate({
                rules: rules,
                messages: messages,
                errorClass: 'form-error',
                submitHandler: function (theForm) {
                    $.post(
                        theForm.action,
                        $(theForm).serialize(),
                        function (response) {
                            $(".widget .feedback").html('<div class="success-msg">' + mo_theme.messages.success_message + '</div>');
                            theForm.reset();
                        });
                }

            });
        },


        init_isotope: function () {
            if ($().isotope === undefined) {
                return;
            }

            var post_snippets = $('.post-snippets').not('.carousel-container .post-snippets').not('.pane .post-snippets');

            post_snippets.imagesLoaded(function () {
                post_snippets.isotope({
                    // options
                    itemSelector: '.entry-item',
                    layoutMode: 'fitRows'
                });
            });

            var container = $('.showcase-items');
            if (container.length === 0) {
                return;
            }

            container.imagesLoaded(function () {
                container.isotope({
                    // options
                    itemSelector: '.showcase-item',
                    layoutMode: 'fitRows'
                });

                $('.showcase-filter a').click(function (e) {
                    e.preventDefault();

                    var elem = $(this);

                    var selector = elem.attr('data-value');
                    container.isotope({filter: selector});

                    elem.closest('.showcase-filter').find('li a').removeClass('active');
                    elem.addClass('active');

                    return false;
                });
            });

            if (mo_theme.options.ajax_showcase) {
                if ($().infinitescroll !== undefined && $('.pagination').length) {

                    container.infinitescroll({
                            navSelector: '.pagination', // selector for the paged navigation
                            nextSelector: '.pagination .next', // selector for the NEXT link (to page 2)
                            itemSelector: '.showcase-item', // selector for all items you'll retrieve
                            loading: {
                                msgText: mo_theme.options.loading_portfolio,
                                finishedMsg: mo_theme.options.finished_loading,
                                img: mo_theme.options.template_dir_url + '/images/loader.gif',
                                selector: '#main'
                            }
                        },
                        // call Isotope as a callback
                        function (newElements) {
                            var $newElems = $(newElements);
                            $newElems.imagesLoaded(function () {
                                container.isotope('appended', $newElems);
                            });
                            MO_THEME.magnific_popup();
                        });
                }
            }
        }


    };

})(jQuery);

/*======================== Document event handling ======================*/

jQuery(document).ready(function ($) {

    "use strict";

    /* -------------------------- Initialize document based on platform type -------------------- */

    MO_THEME.add_body_classes();
    MO_THEME.manipulate_dom();

    /* ---------------------------------- Drop-down Menu.-------------------------- */

    MO_THEME.init_menus();

    /* --------- Back to top function ------------ */
    $(window).scroll(function () {
        MO_THEME.wait_for_final_event(function () {
            var yPos = $(window).scrollTop();
            /* show back to top after screen has scrolled down 200px from the top in desktop and big size tablets only */
            if (yPos > 200) {
                if (!mo_theme.options.disable_back_to_top) {
                    $("#go-to-top").fadeIn();
                }
            } else {
                $("#go-to-top").fadeOut();
            }
        }, 200, 'go-to-top');
    });


    // Animate the scroll to top
    $('#go-to-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 600);
    });

    /* ------------------- Scroll Effects ----------------------------- */


    if (!mo_theme.options.disable_animations_on_page && !MO_THEME.is_mobile()) {
        MO_THEME.scroll_effects();
    } else {

        //Show stats without waiting for user to scroll to the element
        MO_THEME.display_stats();

        MO_THEME.display_piecharts();

        // Show elements rightaway without animation
        $('#feature-pointers img').css({opacity: 1});
    }


    /* ------------------- Tabs and Accordions plus Tooltips ------------------------ */

    $("ul.tabs").tabs(".pane", {
        onClick: function (event, tabIndex) {
            var html_content = $('.js-isotope');
            // layout Isotope again after all images have loaded
            html_content.imagesLoaded(function () {
                html_content.isotope('layout');
            });
        }
    });

    $(".accordion").tabs("div.pane", {
        tabs: 'div.tab',
        effect: 'slide',
        initialIndex: 0
    });

    $(".social-list li a[title]").not('#sidebar-header .social-list li a').tooltip();

    $(".composite-page .page_section a.edit-button[title]").tooltip();


    /* ------------------- Back to Top and Close ------------------------ */

    $(".back-to-top").click(function (e) {
        $('html,body').animate({
            scrollTop: 0
        }, 600);
        e.preventDefault();
    });

    $('a.close').click(function (e) {
        e.preventDefault();
        $(this).closest('.message-box').fadeOut();
    });

    /* -------------------------------- Toggle  --------------------------*/
    $(".toggle-label").toggle(
        function () {
            MO_THEME.toggle_state($(this).parent());
        },
        function () {
            MO_THEME.toggle_state($(this).parent());
        }
    );

    /* -------------------------------- Contact Form --------------------------*/
    // Hide the honeypot trap field
    $("p.trap-field").hide();

    MO_THEME.validate_contact_form();

    /* -------------------------------- Magnific Popup Lightbox --------------------------*/


    MO_THEME.magnific_popup();

    /* --------------------------- YouTube Video display ------------------------- */

    if (!MO_THEME.is_mobile()) {
        if ($().mb_YTPlayer !== undefined) {
            var video_showcase = $(".ytp-video-showcase .ytp-player");
            $(".ytp-video-showcase .ytp-player").mb_YTPlayer({
                startAt: 0,
                showYTLogo: false,
                showControls: false,
                autoPlay: false,
                mute: false
            });

            $('.ytp-video-showcase .play-btn').click(function () {
                // Hide the placeholder image when user clicks on play button
                $('.ytp-video-showcase .img-bg').fadeOut();
            });

            var autoplay = $('.ytp-video-showcase .video-bg').data("video-autoplay");
            if (autoplay === true) {
                $('.ytp-video-showcase .img-bg').fadeOut();
            }

            video_showcase.on("YTPStart", function () {
                jQuery(".ytp-video-showcase .video-controls").fadeIn();
                jQuery(".ytp-video-showcase .header-content").fadeOut();
            });
            video_showcase.on("YTPPause", function () {
                jQuery(".ytp-video-showcase .video-controls").fadeOut();
                jQuery(".ytp-video-showcase .header-content").fadeIn();
            });

            var video_section = $(".ytp-video-section .ytp-player");
            video_section.mb_YTPlayer({
                startAt: 0,
                showYTLogo: false,
                showControls: false,
                autoPlay: true,
                mute: true
            });

        }
    }

    /* --------------------------- HTML5 Video display ------------------------- */

    if (!MO_THEME.is_mobile()) {

        $('.video-showcase .play-btn').click(function () {
            // Hide the placeholder image when user clicks on play button
            $('.video-showcase .img-bg').fadeOut();
            jQuery(".video-showcase .video-controls").fadeIn();
            jQuery(".video-showcase .header-content").fadeOut();
        });

        $('.video-showcase .small-pause-btn').click(function () {
            jQuery(".video-showcase .video-controls").fadeOut();
            jQuery(".video-showcase .header-content").fadeIn();
        });

    }

    /*-----------------------------------------------------------------------------------*/
    /*	jQuery isotope functions and Infinite Scroll
     /*-----------------------------------------------------------------------------------*/

    MO_THEME.init_isotope();

    /*-----------------------------------------------------------------------------------*/
    /*	Handle videos in responsive layout - Credit - http://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
     /*-----------------------------------------------------------------------------------*/

    $("#content, #sidebar-primary, #footer").fitVids();

    // Take care of maps too - https://github.com/davatron5000/FitVids.js - customSelector option
    $("#content").fitVids({customSelector: "iframe[src^='http://maps.google.com/'], iframe[src^='https://maps.google.com/'], iframe[src^='https://www.google.com/maps/'], iframe[src^='http://www.google.com/maps/']"});

    /*----------------- Parallax Effects - only on desktop ------------------ */

    var width = $(window).width();
    if (width > 1100) {

        $('.parallax-banner').parallax("50%", 0.6);

    }

    /*------------- Skrollr Animations Pre-setup ----------------*/

    $('#content > .hfeed > .page_section:first-child .video-showcase, #custom-title-area .video-showcase').wrap("<div class='dim-wrap'></div>");


    /*----------------- Init flexslider ------------------ */
    jQuery('.flex-slider-container .flexslider').flexslider({
        animation: "slide",
        slideshowSpeed: 5000,
        animationSpeed: 600,
        namespace: "flex-",
        pauseOnAction: true,
        pauseOnHover: false,
        controlNav: false,
        directionNav: true,
        prevText: "Previous<span></span>",
        nextText: "Next<span></span>",
        smoothHeight: false,
        animationLoop: true,
        slideshow: true,
        easing: "swing"
    });

});

jQuery(window).load(function () {

    /*------------- Skrollr Animations ----------------*/

    var width = jQuery(window).width();
    if (width > 1100 && !MO_THEME.is_mobile()) {

        jQuery('#title-area').wrap("<div class='dim-wrap'></div>").attr('data-top', "opacity:1;background-position: 0px 0px;").attr('data-top-bottom', "opacity: 0.6;background-position:0px -250px;");

        jQuery('#content > .hfeed > .page_section:first-child .video-showcase, #custom-title-area .video-showcase').attr('data-top', "opacity:1;transform: matrix(1, 0, 0, 1, 0, 0);").attr('data-top-bottom', "opacity: 0.6;transform:matrix(1, 0, 0, 1, 0, 450);");

        jQuery('#title-area h1, #title-area h2').attr('data-0', "opacity:1;").attr('data-top-bottom', "opacity: 0;");

        jQuery('#title-area p').attr('data-0', "opacity:1;").attr('data-top-bottom', "opacity: 0;");

        var s = skrollr.init({
            smoothScrolling: false,
            forceHeight: false,
            mobileCheck: function () {
                return false;
            }
        });
    }

    /*------------ Show the page now that all have been loaded ---------*/

    if (!mo_theme.options.disable_smooth_page_load) {
        jQuery("#page-loading").delay(500).fadeOut("slow");
    }
    // Wait till all images have loaded before unwrapping
    jQuery('.flex-slider-container, .carousel-wrap').removeClass('loading');

});
