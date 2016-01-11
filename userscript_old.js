// ==UserScript==
// @name       LyndaVideoLinks
// @namespace  http://www.lynda.com
// @version    1.0
// @description  Retrieves links to all tutorial videos on page.
// @match      http://www.lynda.com/*
// @copyright  2013
// ==/UserScript==

/**
 * Retrieves links to all tutorial videos on page.
 * Intended to be invoked directly from the console when viewing the course table of contents.
 * IMPORTANT: make sure the video player preferences are set to QuickTime Standard.
 * @param lyndaHost
 * @returns {*}
 * @constructor
 */
function LyndaVideoLinks(lyndaHost) {
    this.LYNDA_HOST = lyndaHost;
    this.init();

    return this;
}

LyndaVideoLinks.prototype = {
    /**
     * Gets all player links on page.
     * @returns {Array}
     */
    getPlayerLinks: function() {

        /**
         * Retrieves all onclick values of video links to player.
         */
        function getOnclickVals() {
            var onclickVals = [];
            jQuery('div.vid a').each(function() {
                onclickVals.push(jQuery(this).attr('onclick'));
            });
            return onclickVals;
        }

        var links = [],
            onclickVals = getOnclickVals(),
            that = this;
        jQuery.each(onclickVals, function(i,v) {
            links.push(that.LYNDA_HOST + v.match(/\/home\/Player\.aspx\?lpk4=[^&]*/)[0]);
        });
        return links;
    },
    /**
     * Asynchronously retrieves video URL through AJAX request to player.
     * @param {String} playerLink
     * @param {Function} callback
     */
    getVideoUrl: function(playerLink, callback) {
        jQuery.get(playerLink, null, function(data) {
            callback(jQuery(data).find('object#qtPlayer embed').first().attr('src'));
        }, 'html');
    },
    /**
     * Inserts video URL into DOM for easy downloading.
     * @param {String} url
     */
    insertVideoUrl: function(url) {
        jQuery('div#course').after('<a href="' + url + '" target="lynda-video">' + url + '</a><br/>');
    },
    init: function() {
        var playerLinks = this.getPlayerLinks(),
            that = this,
            i = 0,
            timer = setInterval(function() {
                if (i <= playerLinks.length) {
                    that.getVideoUrl(playerLinks[i], function(url) {
                        that.insertVideoUrl(url);
                    });
                }
                ++i;
            }, 5000);
    }
};

jQuery('document').ready(function() {
    var lyndaVideoLinks = new LyndaVideoLinks('http://www.lynda.com');
});