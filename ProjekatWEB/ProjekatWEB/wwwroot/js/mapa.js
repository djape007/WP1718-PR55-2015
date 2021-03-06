
function PostaviMapu(mapElementId, markerElementId, callbackFunc, coordinateMarkera = null, coordinateCentra = null, _zoom = 12) {
  if (coordinateCentra == null) {
    coordinateCentra = [2207181.56940382, 5661129.415474222];
  }  
  
  var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: mapElementId,
        controls: ol.control.defaults({
          attributionOptions: {
            collapsible: false
          }
        }),
        view: new ol.View({
          center: coordinateCentra,    //ovo je NS
          zoom: _zoom
        })
      });
    
    var marker = new ol.Overlay({
        element: document.getElementById(markerElementId)
    });

    map.addOverlay(marker);

    if (coordinateMarkera != null) {
      marker.setPosition(coordinateMarkera);
    }
    
    map.on('click', function(evt) {
        var coordianteRaw = evt.coordinate;
        marker.setPosition(coordianteRaw);
        var coordLonLat = ol.proj.toLonLat(coordianteRaw);
        reverseGeocode(coordLonLat, coordianteRaw, callbackFunc);
    });
}

function reverseGeocode(coords, originalCoords, callback) {
    fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + coords[0] + '&lat=' + coords[1])
    .then(function(response) {
            return response.json();
        }).then(function(json) {
            if (callback != null) {
              callback(json, originalCoords);
            }
        });
}