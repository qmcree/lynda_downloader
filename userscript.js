// ==UserScript==
// @name       Lynda.com Downloader
// @namespace  http://www.github.com/qmcree
// @version    0.1
// @description  Download Lynda.com videos.
// @include     http://www.lynda.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       GM_download
// @copyright  2014+, qmcree
// ==/UserScript==

// @todo success message when all videos downloaded with count.
// @todo buffer until video download finished.
// @todo once finished, ask if want to retry downloading failed downloads.

var LyndaDownloader = {
    VIDEO_SELECTOR: '#course-toc-outer a[data-qa="qa_videoLink"]',

    videoIds: [],

    init: function() {
        var self = this;

        jQuery(this.VIDEO_SELECTOR).each(function() {
            self.videoIds.push(jQuery(this).data('video-id'));
        });
    },
    getCourseName: function() {
        return jQuery('.course-details h1').text();
    },
    downloadVideoUrls: function() {
        var self = this;

        jQuery.each(this.videoIds, function(i, id) {
            var url = 'http://www.lynda.com/ajax/player?type=video&videoId=' + id;

            jQuery.ajax(url, {
                async: false,
                dataType: 'json',
                success: function(data) {
                    GM_download({
                        url: data['PrioritizedStreams'][0]['720'],
                        name: data['FileName'] + '.mp4',
                        onload: function() {
                            console.log('Video ID ' + id + ' finished downloading.');
                        },
                        onerror: function(download) {
                            console.error('Failed to download video ID ' + id + ': ' + download.error + ' (' + download.details + ')');
                        }
                    });
                },
                error: function() {
                    console.error('Unable to get video URL at ' + url);
                }
            });
        });
    }
};

jQuery(document).ready(function() {
    if (confirm('Download all videos in "' + LyndaDownloader.getCourseName() + '" course?')) {
        LyndaDownloader.init();
        LyndaDownloader.downloadVideoUrls();
    }
});

