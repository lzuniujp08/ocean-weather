import Papa from 'papaparse'
import { LineTextCanvas } from './leaflet.textCanvas'
// import turf from 'turf'

export class Func500mb {

  constructor(map) {
    this._map = map;
  }

  start() {
    var renderer = this._renderer = new LineTextCanvas();
    var options = {
      renderer: renderer,
      color: '#354656',
      weight: 0.8,
      opacity: 0.85,
      fill: false,
      // noClip:true,
      // smoothFactor:0.1
    };
    var arr = [];

    // if(this._500mbFeatureGroup && this._map.hasLayer(this._500mbFeatureGroup)) {
    //   this._map.removeLayer(this._500mbFeatureGroup);
    // }
    // this._500mbFeatureGroup = L.featureGroup([]).addTo(this._map);

    Papa.parse('./static/data/500mb.csv', {
      download: true,
      complete: function (results) {
        // var r = results;
      },
      step: function (results, parser) {
        if(results.data[0][0] === '' && arr.length) {

          // handler data -------------start------------------------
          var latlngs = [];
          for(var i = 0, len = arr.length; i < len; i++) {
            var row = arr[i];
            var lat = +row[0];
            var lng = +row[1];
            var value = options.text = +row[2];
            var latlng = L.latLng(lat, lng);

            if(i === 0) {
              latlngs.push(latlng);
            } else {
              var lastlng = (latlngs[latlngs.length - 1]).lng;
              var extend = Math.abs(lng - lastlng);
              if(extend >= 180) { //解决经度范围超过180连线异常
                if(latlngs.length > 2) {
                  // let geo = L.polyline(latlngs, options).toGeoJSON();
                  // let curved = turf.bezier(geo, 10000, 0.85);
                  // let newlatlngs = [];
                  // for(let i = 0, len = curved.geometry.coordinates.length; i < len; i++) {
                  //   newlatlngs.push(L.latLng(curved.geometry.coordinates[i][1], curved.geometry.coordinates[i][0]));
                  // }
                  // this._500mbFeatureGroup.addLayer(L.polyline(newlatlngs, options));
                  // this._500mbFeatureGroup.addLayer(L.polyline(latlngs, options));
                  L.polyline(latlngs, options).addTo(this._map);
                }
                latlngs = [];
                latlngs.push(latlng);
              } else {
                latlngs.push(latlng);
                if(i === len - 1) {
                  if(latlngs.length > 2) {
                    // let geo = L.polyline(latlngs, options).toGeoJSON();
                    // let curved = turf.bezier(geo, 10000, 0.85);
                    // let newlatlngs = [];
                    // for(let i = 0, len = curved.geometry.coordinates.length; i < len; i++) {
                    //   newlatlngs.push(L.latLng(curved.geometry.coordinates[i][1], curved.geometry.coordinates[i][0]));
                    // }
                    // this._500mbFeatureGroup.addLayer(L.polyline(newlatlngs, options));
                    // this._500mbFeatureGroup.addLayer(L.polyline(latlngs, options));
                     L.polyline(latlngs, options).addTo(this._map);
                  }
                  latlngs = [];
                }
              }
            }
          }
          // handler datq ----------------end-----------------------------
          arr = [];
        } else {
          if(arr) {
            arr.push(results.data[0]);
          } else {
            arr = [];
          }
        }
      }.bind(this)
    });
  }

  stop　() {
    // if(this._map.hasLayer(this._500mbFeatureGroup)) {
    //   this._map.removeLayer(this._500mbFeatureGroup);
    // }
    if (this._renderer) {
      this._renderer.remove();
    }    
  }
}