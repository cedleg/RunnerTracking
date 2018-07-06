'use strict';

console.log('Locator device loading');
var locator = (function() {

    /**
     * @type {number} geolocalisation id
     */
    var id;

    /**
     * @returns {Object} locator module
     */
    var position;

     var successCallback = function(event){
        position = { lat: event.coords.latitude, lng: event.coords.longitude };
        this(position);
     }

    return {
        getPosition: function () {
            return position;
        },

        current: function(success, error, option){
            return navigator.geolocation.getPosition(successCallback.bind(success), error, option);

        },

        watch: function(success, error, option){
            return navigator.geolocation.watchPosition(successCallback.bind(success), error, option);
        },

        clear(){

        }
    };

})();