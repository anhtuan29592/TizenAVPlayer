(function () {
    'use strict';

    /**
     * Displays logging information on the screen and in the console.
     * @param {string} msg - Message to log.
     */
    function log(msg) {
    	console.log('[PlayerAvplay]: ' + msg);
    }

    var player;

    // flag to monitor UHD toggling
    var uhdStatus = false;

    /**
     * Register keys used in this application
     */
    function registerKeys() {
        var usedKeys = [
            'MediaPlay',	
            'MediaPause',
            'MediaStop',
            'MediaFastForward',
            'MediaRewind',            
            '0',
            '1',
            '2',
            '3'
        ];

        usedKeys.forEach(
            function (keyName) {
                tizen.tvinputdevice.registerKey(keyName);
            }
        );
    }


    /**
     * Handle input from remote
     */
    function registerKeyHandler() {
        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 13:    // Enter
                    player.toggleFullscreen();
                    break;
                case 415:   // MediaPlay
		    player.play();
		    break;
                case 19:    // MediaPause
                    player.pause();
                    break;
                case 413:   // MediaStop
                    player.stop();
                    break;
                case 417:   // MediaFastForward
                    player.ff();
                    break;
                case 412:   // MediaRewind
                    player.rew();
                    break;
                case 48: //Key 0
                    log();
                    break;
                case 49: //Key 1
                    setUhd();
                    break;
                case 50: //Key 2
                    player.getTracks();
                    break;
                case 51: //Key 3
                    player.getProperties();
                    break;
                case 10009: // Return
                    if (webapis.avplay.getState() !== 'IDLE' && webapis.avplay.getState() !== 'NONE') {
                        player.stop();
                    }
                    tizen.application.getCurrentApplication().exit();
                    break;
                default:
                    log("Unhandled key");
            }
        });
    }

    function registerMouseEvents() {
        /*document.querySelector('.video-controls .play').addEventListener(
            'click',
            function () {
                player.play();
            }
        );
        document.querySelector('.video-controls .stop').addEventListener(
            'click',
            function () {
                player.stop();
            }
        );
        document.querySelector('.video-controls .pause').addEventListener(
            'click',
            function() {
            	player.pause();
            }
            
        );
        document.querySelector('.video-controls .ff').addEventListener(
            'click',
            function() {
            	player.ff()
            }
        );
        document.querySelector('.video-controls .rew').addEventListener(
            'click',
            function() {
            	player.rew();
            }
        );
        document.querySelector('.video-controls .fullscreen').addEventListener(
            'click',
            function() {
            	player.toggleFullscreen();
            }
        );*/
    }

    /**
     * Enabling uhd manually in order to play uhd streams
     */
    function setUhd() {
        if (!uhdStatus) {
            if (webapis.productinfo.isUdPanelSupported()) {
                log('4k enabled');
                uhdStatus = true;
            } else {
                log('this device does not have a panel capable of displaying 4k content');
            }

        } else {
            log('4k disabled');
            uhdStatus = false;
        }
        player.setUhd(uhdStatus);
    }


    /**
     * Function initialising application.
     */
    window.onload = function () {

        if (window.tizen === undefined) {
            log('This application needs to be run on Tizen device');
            return;
        }
        
        registerKeys();
        registerKeyHandler();

        var config = {
            url: 'http://vtvgo-live-appobj.b5695cde.cdnviet.com/38dd6f29ba821d0c48e889688e343afd1523528658/live/_definst_/vtv3.m3u8?tiviso',
            player: document.getElementById('av-player'),
//            controls: document.querySelector('.video-controls'),
//            info: document.getElementById('info'),
            logger: log
        };


        //Check the screen width so that the AVPlay can be scaled accordingly
        tizen.systeminfo.getPropertyValue(
            "DISPLAY",
            function (display) {
                log("The display width is " + display.resolutionWidth);
                config.resolutionWidth = 1920;

                // initialize player - loaded from videoPlayer.js
                player = new VideoPlayer(config);
                player.open(config.url);
                registerMouseEvents();
            },
            function(error) {
                log("An error occurred " + error.message);
            }
        );

    };
}());
