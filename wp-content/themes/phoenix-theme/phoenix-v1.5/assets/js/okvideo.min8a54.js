/* okvideo by okfocus ~ v2.3.2 ~ https://github.com/okfocus/okvideo */
function vimeoPlayerReady() {
    options = jQuery(window).data("okoptions");
    var a = jQuery("#okplayer")[0];
    player = $f(a), window.setTimeout(function() {
        jQuery("#okplayer").css("visibility", "visible")
    }, 2e3), player.addEvent("ready", function() {
        OKEvents.v.onReady(), OKEvents.utils.isMobile() ? OKEvents.v.onPlay() : (player.addEvent("play", OKEvents.v.onPlay), player.addEvent("pause", OKEvents.v.onPause), player.addEvent("finish", OKEvents.v.onFinish)), player.api("play")
    })
}

function onYouTubePlayerAPIReady() {
    var settings = {keyControls: true, controls: false, loop: true, annotations: false}
    options = jQuery(window).data("okoptions");
    options = jQuery.extend(settings, options);
    player = new YT.Player("okplayer", {
        videoId: (typeof options != 'undefined' && typeof options.video != 'undefined') ? options.video.id : null,
        playerVars: {
            autohide: 1,
            autoplay: 0,
            disablekb: options.keyControls,
            cc_load_policy: options.captions,
            controls: options.controls,
            enablejsapi: 1,
            fs: 0,
            modestbranding: 1,
            origin: window.location.origin || window.location.protocol + "//" + window.location.hostname,
            iv_load_policy: options.annotations,
            loop: options.loop,
            showinfo: 0,
            rel: 0,
            wmode: "opaque",
            hd: options.hd
        },
        events: {
            onReady: OKEvents.yt.ready,
            onStateChange: OKEvents.yt.onStateChange,
            onError: OKEvents.yt.error
        }
    })
}
var player, OKEvents, options;
! function(a) {
    "use strict";
    var b = "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw%3D%3D";
    a.okvideo = function(c) {
        "object" != typeof c && (c = {
            video: c
        });
        var d = this;
        d.init = function() {
            d.options = a.extend({}, a.okvideo.options, c), null === d.options.video && (d.options.video = d.options.source), d.setOptions();
            var e = d.options.target || a("body"),
                f = e[0] == a("body")[0] ? "fixed" : "absolute";
            e.css({
                position: "relative"
            });
            var g = 3 === d.options.controls ? -999 : "auto",
                h = '<div id="okplayer-mask" style="position:' + f + ';left:0;top:0;overflow:hidden;z-index:-998;height:100%;width:100%;"></div>';
            OKEvents.utils.isMobile() ? e.append('<div id="okplayer" style="position:' + f + ";left:0;top:0;overflow:hidden;z-index:" + g + ';height:100%;width:100%;"></div>') : (3 === d.options.controls && e.append(h), 1 === d.options.adproof ? e.append('<div id="okplayer" style="position:' + f + ";left:-10%;top:-10%;overflow:hidden;z-index:" + g + ';height:120%;width:120%;"></div>') : e.append('<div id="okplayer" style="position:' + f + ";left:0;top:0;overflow:hidden;z-index:" + g + ';height:100%;width:100%;"></div>')), a("#okplayer-mask").css("background-image", "url(" + b + ")"), null === d.options.playlist.list ? "youtube" === d.options.video.provider ? d.loadYouTubeAPI() : "vimeo" === d.options.video.provider && (d.options.volume /= 100, d.loadVimeoAPI()) : d.loadYouTubeAPI()
        }, d.setOptions = function() {
            for (var b in this.options) this.options[b] === !0 && (this.options[b] = 1), this.options[b] === !1 && (this.options[b] = 3);
            null === d.options.playlist.list && (d.options.video = d.determineProvider()), a(window).data("okoptions", d.options)
        }, d.loadYouTubeAPI = function() {
            d.insertJS("//www.youtube.com/player_api")
        }, d.loadYouTubePlaylist = function() {
            player.loadPlaylist(d.options.playlist.list, d.options.playlist.index, d.options.playlist.startSeconds, d.options.playlist.suggestedQuality)
        }, d.loadVimeoAPI = function() {
            a("#okplayer").replaceWith(function() {
                return '<iframe src="//player.vimeo.com/video/' + d.options.video.id + "?api=1&title=0&byline=0&portrait=0&playbar=0&loop=" + d.options.loop + "&autoplay=" + (1 === d.options.autoplay ? 1 : 0) + '&player_id=okplayer" frameborder="0" style="' + a(this).attr("style") + 'visibility:hidden;background-color:black;" id="' + a(this).attr("id") + '"></iframe>'
            }), d.insertJS("//origin-assets.vimeo.com/js/froogaloop2.min.js", function() {
                vimeoPlayerReady()
            })
        }, d.insertJS = function(a, b) {
            var c = document.createElement("script");
            b && (c.readyState ? c.onreadystatechange = function() {
                ("loaded" === c.readyState || "complete" === c.readyState) && (c.onreadystatechange = null, b())
            } : c.onload = function() {
                b()
            }), c.src = a;
            var d = document.getElementsByTagName("script")[0];
            d.parentNode.insertBefore(c, d)
        }, d.determineProvider = function() {
            var a = document.createElement("a");
            if (a.href = d.options.video, /youtube.com/.test(d.options.video)) return {
                provider: "youtube",
                id: a.href.slice(a.href.indexOf("v=") + 2).toString()
            };
            if (/vimeo.com/.test(d.options.video)) return {
                provider: "vimeo",
                id: a.href.split("/")[3].toString()
            };
            if (/[-A-Za-z0-9_]+/.test(d.options.video)) {
                var b = new String(d.options.video.match(/[-A-Za-z0-9_]+/));
                if (11 == b.length) return {
                    provider: "youtube",
                    id: b.toString()
                };
                for (var c = 0; c < d.options.video.length; c++)
                    if ("number" != typeof parseInt(d.options.video[c])) throw "not vimeo but thought it was for a sec";
                return {
                    provider: "vimeo",
                    id: d.options.video
                }
            }
            throw "OKVideo: Invalid video source"
        }, d.init()
    }, a.okvideo.options = {
        source: null,
        video: null,
        playlist: {
            list: null,
            index: 0,
            startSeconds: 0,
            suggestedQuality: "default"
        },
        disableKeyControl: 1,
        captions: 0,
        loop: 1,
        hd: 1,
        volume: 0,
        adproof: !1,
        unstarted: null,
        onFinished: null,
        onReady: null,
        onPlay: null,
        onPause: null,
        buffering: null,
        controls: !1,
        autoplay: !0,
        annotations: !0,
        cued: null
    }, a.fn.okvideo = function(b) {
        return b.target = this, this.each(function() {
            new a.okvideo(b)
        })
    }
}(jQuery), OKEvents = {
    yt: {
        ready: function(a) {
            a.target.setVolume(options.volume), 1 === options.autoplay && (options.playlist.list ? player.loadPlaylist(options.playlist.list, options.playlist.index, options.playlist.startSeconds, options.playlist.suggestedQuality) : a.target.playVideo()), OKEvents.utils.isFunction(options.onReady) && options.onReady()
        },
        onStateChange: function(a) {
            switch (a.data) {
                case -1:
                    OKEvents.utils.isFunction(options.unstarted) && options.unstarted();
                    break;
                case 0:
                    OKEvents.utils.isFunction(options.onFinished) && options.onFinished(), options.loop && a.target.playVideo();
                    break;
                case 1:
                    OKEvents.utils.isFunction(options.onPlay) && options.onPlay();
                    break;
                case 2:
                    OKEvents.utils.isFunction(options.onPause) && options.onPause();
                    break;
                case 3:
                    OKEvents.utils.isFunction(options.buffering) && options.buffering();
                    break;
                case 5:
                    OKEvents.utils.isFunction(options.cued) && options.cued();
                    break;
                default:
                    throw "OKVideo: received invalid data from YT player."
            }
        },
        error: function(a) {
            throw a
        }
    },
    v: {
        onReady: function() {
            OKEvents.utils.isFunction(options.onReady) && options.onReady()
        },
        onPlay: function() {
            OKEvents.utils.isMobile() || player.api("setVolume", options.volume), OKEvents.utils.isFunction(options.onPlay) && options.onPlay()
        },
        onPause: function() {
            OKEvents.utils.isFunction(options.onPause) && options.onPause()
        },
        onFinish: function() {
            OKEvents.utils.isFunction(options.onFinish) && options.onFinish()
        }
    },
    utils: {
        isFunction: function(a) {
            return "function" == typeof a ? !0 : !1
        },
        isMobile: function() {
            return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) ? !0 : !1
        }
    }
};