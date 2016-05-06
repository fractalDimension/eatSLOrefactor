import './map.html';

import { Template } from 'meteor/templating';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { NetworkMembers } from '../../api/networkMembers.js';
import { networkPageVars } from '../pages/network.js';

Template.networkMap.helpers(
{
  // paramters to load when map is first displayed
  mapOptions: function()
  {
    if (GoogleMaps.loaded())
    {
      return {
        'center': new google.maps.LatLng(35.281694, -120.659695),
        'zoom': 11,
        'zoomControl': false,
        'streetViewControl': false,
        'mapTypeControl': false,
      };
    }
  }
});

Template.networkMap.events({
  'click #openCardLink': () => {
    networkPageVars.activeCardVisible.set(true);
  },
});

Template.networkMap.onCreated(function()
{
  GoogleMaps.ready('networkMap', function(map)
  {
    console.log('Map ready!');
    networkPageVars.mapReady.set(true);

    // place to store map markers
    const markers = {};
    // place to store open info window
    const infoWindows = {};

    NetworkMembers.find().observe(
    {
      'added': function(document)
      {
        // console.log("doc added: ");
        
        switch (document.accountType) {
          case 'preparer':
            var urlString = '/images/markers/preparer_pin.svg';
            break;
          case 'grower':
            var urlString = '/images/markers/grower_pin.svg';
            break;
          case 'supplier':
            var urlString = '/images/markers/supplier_pin.svg';
            break;
          default:
            console.log('no account type for marker found');
        }

        const image = {
          'url': urlString,
          'size': new google.maps.Size(20, 30),
          'origin': new google.maps.Point(0, 0),
          'anchor': new google.maps.Point(10, 30),
          
        };

        // create marker for the document
        const marker = new google.maps.Marker(
        {
          'animation': google.maps.Animation.DROP,
          'position': new google.maps.LatLng(document.lat, document.lng),
          'map': map.instance,
          'icon': image,
          'id': document._id,

          'info': '<h3><a id="openCardLink">' + document.name + '</a></h3>',
        });

        const infoWindow = new google.maps.InfoWindow();

        markers[document._id] = marker;
        infoWindows[document._id] = infoWindow;
        networkPageVars.boundaryPoints[document._id] = new google.maps.LatLng(document.lat, document.lng);
        
        google.maps.event.addListener( marker, 'click', function() 
        {
          // close any open infoWindow
          _.each(infoWindows, (oneWindow) => {
            oneWindow.close();
          });

          // set the data context and create an instance of the card
          networkPageVars.activeCardId.set(document._id);

          infoWindow.setContent( this.info );
          infoWindow.open( map.instance, this );
        });

      },

      'removed': function(oldDocument) 
      {
        // remove point from bounds
        delete networkPageVars.boundaryPoints[oldDocument._id];

        // remove marker from the map
        markers[oldDocument._id].setMap(null);

        delete markers[oldDocument._id];
      },
    });

  });
});

const drawNetwork = (memberDocument, memberArray, arrowType) => {
  
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
      resizeMap();
      GoogleMaps.maps.networkMap.instance.fitBounds(bounds);
    }
  }
};

const hideNetwork = () => {
  if (networkPageVars.memberNetwork.length > 0) {
    _.each(networkPageVars.memberNetwork, (line) => {
      // remove the line from the map
      line.setMap(null);
    });
  }
  // clear the variable for the next use
  networkPageVars.memberNetwork = [];
};

const resizeMap = () => {
  console.log('resized');
  // let the map know the div changed size
  google.maps.event.trigger(GoogleMaps.maps.networkMap.instance, 'resize');
};

const redrawBounds = () => {
  // google bounds object to hold points
  const bounds = new google.maps.LatLngBounds();

  _.each(networkPageVars.boundaryPoints, (boundaryPoint) => {
    //console.log(boundaryPoint);
    // add each bound to the google object
    bounds.extend(boundaryPoint);
  });

  // render map with bounds
  console.log("bounds drawn");
  GoogleMaps.maps.networkMap.instance.fitBounds(bounds);
};

const centerOnActiveCard = () => {
  const activeCardDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});
  const centerLatLng = new google.maps.LatLng(activeCardDocument.lat, activeCardDocument.lng);
  GoogleMaps.maps.networkMap.instance.setCenter(centerLatLng);
};

export { drawNetwork, hideNetwork, resizeMap, redrawBounds, centerOnActiveCard};
