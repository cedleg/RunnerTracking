'use strict';

var runnerMap = (function () {

    var map;
    var marker;
    var locPosition;
    var directionsDisplay;

    function clear(){
        directionsDisplay.setMap(null);
        window.document.getElementById('clearDirection').style.display = 'none';
    }

    function trace() {
        directionsDisplay.setMap(map);
        var endpointPosition = new google.maps.LatLng(this.latLng.lat(), this.latLng.lng());
        var selectedMode = 'WALKING';
        var directionsService = new google.maps.DirectionsService();
        var request = {
            origin: locPosition,
            destination: endpointPosition,
            travelMode: google.maps.TravelMode[selectedMode]
        };

        directionsService.route(request, function (response, status) {
            if ('OK' == status) {
                directionsDisplay.setDirections(response);
                window.document.getElementById('clearDirection').style.display = 'block';
                return;
            }
            this.snackTrace('Can\'t determine direction!');
        });
    }

    function onLongClick() {
        var id;
        google.maps.event.addListener(map, 'mousedown', function (event) {
            id = window.setTimeout(trace.bind(event), 500);
        });
        google.maps.event.addListener(map, 'mouseup', function (event) {
            clearTimeout(id);
        });
    }

    function createMap(position) {
        map = new google.maps.Map(document.getElementById('runnerMap'), {
            center: position,
            zoom: 14,
            disableDefaultUI: true,
            minZoom: 10,
            maxZoom: 20,
            mapTypeId: 'terrain',
            styles: mapStyleRetro
        });
        onLongClick();
    }

    function createMarker(position) {
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: 'My position'
        });
    }

    function geocodeLatLng(geocoder, map, infowindow, position) {
        geocoder.geocode({ 'location': position }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    function success() {
        locPosition = locator.getPosition();
        if (!map) {
            createMap(locPosition);
            createMarker(locPosition);
            var geocoder = new window.google.maps.Geocoder;
            var infowindow = new window.google.maps.InfoWindow;
            geocodeLatLng(geocoder, map, infowindow, locPosition);
            return;
        }
        map.panTo(locPosition);
        marker.setPosition(locPosition);
        geocodeLatLng(geocoder, map, infowindow);
    }

    function error() {
        snackTrace('Can\'t determine your position!');
    }

    /**
     * @returns [Object] runnerMap module
     */
    return {
        onInit: function () {
            locator.watch(success, error);
            directionsDisplay = new google.maps.DirectionsRenderer();
            window.document.getElementById('clearDirection').addEventListener('click', clear);       
        },

        onPlay: function () {

        },

        onPause: function () {

        }
    };

    function snackTrace(msg) {
        var snackbarContainer = document.querySelector('#snackbar');
        var data = {
            message: msg,
            timeout: 5000,
            actionHandler: function () { },
            actionText: 'Undo'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }

})();