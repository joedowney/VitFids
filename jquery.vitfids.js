; (function($) {

    "use strict";

    var defaults = {
        customSelector: null,
        ignore: null,
        maxWidth: null
    };

    var settings = {
        css: '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;margin:0 auto;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}',
        selectors: ['iframe[src*="player.vimeo.com"]', 'iframe[src*="youtube.com"]', 'iframe[src*="youtube-nocookie.com"]', 'iframe[src*="kickstarter.com"][src*="video.html"]', 'object', 'embed'],
        ignore: '.fitvidsignore'
    };

    // constructor
    function VitFids(element, options) {

        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.settings = settings;
        this.videos = [];

        // add any custom selectors to the master list
        if (this.options.customSelector) {
            this.settings.selectors.push(this.options.customSelector);
        }

        // add any ignorable classes
        if (this.options.ignore) {
            this.settings.ignore = this.settings.ignore + ', ' + this.options.ignore;
        }

        this.init();
    }

    VitFids.prototype.init = function() {

        var self = this;

        self.addStylesToPage();

        // get child videos
        self.setVideos();

        // initialize each video
        $(self.videos).each(function(i) { self.initVideo(this, i); });

        $(window).on('resize', function() {
            var $video = $(this);
            $(self.videos).each(function() { self.sizeVideo($(this)); });
        });

    };

    VitFids.prototype.setVideos = function() {
        var self = this;
        var videos = $(self.element).find(self.settings.selectors.join(','));
        videos = $(videos).not(self.settings.ignore);

        $(videos).each(function() {

            // make sure this isn't included in the ignore list
            if ($(this).parents(self.settings.ignore).length > 0) {
                return;
            }

            // ignore 'embed's inside 'object's
            if ($(this).prop('tagName').toLowerCase() === 'embed' && $(this).parent('object').length || $(this).parent('.fluid-width-video-wrapper').length) {
                return;
            }

            // and ignore any videos already inside a wrapper
            if ($(this).prop('tagName').toLowerCase() === 'embed' && $(this).parent('object').length || $(this).parent('.fluid-width-video-wrapper').length) {
                return;
            }

            self.videos.push(this);
        });
    };

    VitFids.prototype.initVideo = function (video, index) {
        var self = this;
        var $video = $(video);

        // sets the size to 16:9 if the height and width are not already defined
        if (( ! $video.css('height') && !$video.css('width')) && (isNaN($video.attr('height')) || isNaN($video.attr('width')))) {
            $video.attr('width', 16);
            $video.attr('height', 9);
        }

        // calculate the aspect ratio of the video
        var height = ($video.prop('tagName').toLowerCase() === 'object' || ($video.attr('height') && !isNaN(parseInt($video.attr('height'), 10))))
                ? parseInt($video.attr('height'), 10)
                : $video.height(),
            width = !isNaN(parseInt($video.attr('width'), 10))
                ? parseInt($video.attr('width'), 10)
                : $video.width(),
            aspectRatio = height / width;
        $video.data('aspectRatio', aspectRatio);

        // add an id to the video if there isn't one already.
        // i don't know why
        if ( ! $video.attr('id')) {
            $video.attr('id', 'vitfid' + index);
        }

        // remove the height and width attribute since this will be overridden by the plugin
        $video.removeAttr('height').removeAttr('width');

        // wrap the video in the magic div
        $video.wrap('<div class="fluid-width-video-wrapper"></div>');

        // size the video for the first time
        self.sizeVideo($video);
    };

    VitFids.prototype.sizeVideo = function($video) {
        var self = this;

        var $parent = $video.parent('.fluid-width-video-wrapper');
        $parent.css('width', 'auto');

        if (self.options.maxWidth && $parent.width() > self.options.maxWidth) {
            $parent.css('width', self.options.maxWidth + 'px');
            $parent.css('padding-top', ($video.data('aspectRatio') * $parent.width()) + 'px')
        }
        else {
            $parent.css('padding-top', ($video.data('aspectRatio') * 100) + '%');
        }
    };
    
    // add the necessary css to the page
    VitFids.prototype.addStylesToPage = function() {
        if (!document.getElementById('fit-vids-style')) {
            var head = document.head || document.getElementsByTagName('head')[0];
            var div = document.createElement("div");
            div.innerHTML = '<p>x</p><style id="fit-vids-style">' + this.settings.css + '</style>';
            head.appendChild(div.childNodes[1]);
        }
    };

    // plugin wrapper
    $.fn['vitFids'] = function(options) {
        return this.each(function() {
            if ( ! $.data(this, 'plugin_vitFids')) {
                $.data(this, "plugin_vitFids", new VitFids(this, options));
            }
        });
    };

})(jQuery);