'use strict';

var runnerTracking = (function () {

    function run() {
        runnerMap.onInit();
    }

    return {
        initialize: function () {
            return window.cordova ? window.document.addEventListener('deviceready', run) : run();
        }
    };

})();