import { networkPageVars } from '../../pages/network.js';
import { NetworkMembers } from '../../../api/networkMembers.js';

const mapUtils = {
  // this function is ugly but it builds an html string for the googlemaps infoWindow to use
  'createInfoWindowContent': (addedDocument) => {
    const templateString = ['<div class="ui items">' +
                              '<div class="item">' +
                                '<div class="content">' +
                                  '<a class="header" id="openCardLink">' + addedDocument.name + '</a>' +
                                '<div class="description">' +
                                  '<p>Info about business</p>'];

    // check to see if buttons should be added
    if (addedDocument.network.receives) {
      templateString.push('<button class="ui small button" id="viewReceives">Receives</button>');
    }
    if (addedDocument.network.gives) {
      templateString.push('<button class="ui small button" id="viewGives">Gives</button>');
    }

    // finish the string with closing divs
    templateString.push('</div></div></div></div>');

    return templateString.join();
  },
  'drawNetwork': (memberDocument, memberArray, arrowType) => {

    var arrowProperties;

    if (memberArray) {
      if (arrowType === 'gives') {
        arrowProperties = {
          'arrowColor': '#007f00',
          'lineArrow': {
            'path': google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          },
          'offsetPercent': '20%',
        };
      } else {
        arrowProperties = {
          'arrowColor': '#FF0000',
          'lineArrow': {
            'path': google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          },
          'offsetPercent': '80%',
        };
      }

      // create object to set the bounds of the viewable map
      const bounds = new google.maps.LatLngBounds();

      // cycle thru the array of members and look up the coordinates to construct the networkLines array
      _.each(memberArray, (organization) => {
        const fromOrgDocument = NetworkMembers.findOne({'name': organization});

        if (fromOrgDocument) {
          const fromOrgLat = fromOrgDocument.lat;
          const fromOrgLng = fromOrgDocument.lng;

          const lineCoordinates = [
            {'lat': fromOrgLat, 'lng': fromOrgLng},
            {'lat': memberDocument.lat, 'lng': memberDocument.lng},
          ];

          const receivesLine = new google.maps.Polyline({
            'path': lineCoordinates,
            'strokeColor': arrowProperties.arrowColor,
            'strokeOpacity': 1.0,
            'strokeWeight': 2,
            'icons': [{
              'icon': arrowProperties.lineArrow,
              'offset': arrowProperties.offsetPercent,
            }],
          });

          // draw the line on the map
          receivesLine.setMap(GoogleMaps.maps.networkMap.instance);
          // store the map
          networkPageVars.memberNetwork.push(receivesLine);
          // include the connected member in the bounds
          const orgPosition = new google.maps.LatLng(fromOrgLat, fromOrgLng);
          bounds.extend(orgPosition);
        } else {
          console.log('could not find: ' + organization);
        }
      });

      // render the map with the bounds of connected network
      //console.log('drawing bounds');
      if (bounds !== null) {
        // add main member
        const orgPosition = new google.maps.LatLng(memberDocument.lat, memberDocument.lng);
        bounds.extend(orgPosition);
        
        // render map
        // resizeMap();
        GoogleMaps.maps.networkMap.instance.fitBounds(bounds);
      }
    }
  },
  'hideNetwork': () => {
    if (networkPageVars.memberNetwork.length > 0) {
      _.each(networkPageVars.memberNetwork, (line) => {
        // remove the line from the map
        line.setMap(null);
      });
    }
    // clear the variable for the next use
    networkPageVars.memberNetwork = [];
  },
  'redrawBounds': () => {
    // google bounds object to hold points
    const bounds = new google.maps.LatLngBounds();

    _.each(networkPageVars.boundaryPoints, (boundaryPoint) => {
      // add each bound to the google object
      bounds.extend(boundaryPoint);
    });

    // render map with bounds
    console.log("bounds drawn");
    GoogleMaps.maps.networkMap.instance.fitBounds(bounds);
  },
  'resizeMap': () => {
    console.log('resized');
    // let the map know the div changed size
    google.maps.event.trigger(GoogleMaps.maps.networkMap.instance, 'resize');
  },
  'centerOnActiveCard': () => {
    const activeCardDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});
    const centerLatLng = new google.maps.LatLng(activeCardDocument.lat, activeCardDocument.lng);
    GoogleMaps.maps.networkMap.instance.setCenter(centerLatLng);
  },
};

export { mapUtils };
