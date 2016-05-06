import './map.html';

import { Template } from 'meteor/templating';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { NetworkMembers } from '../../../api/networkMembers.js';
import { networkPageVars } from '../../pages/network.js';
import { mapUtils } from './mapUtils.js';

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
  'click #viewReceives': (event, template) => {
    // TODO add check to see if 'receives' is not null
    let memberDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});

    let memberArray = memberDocument.network.receives.name;

    // clear network if one is drawn
    mapUtils.hideNetwork();

    // subscribe and draw the map once the subscription is ready
    template.subscribe('connectedMembers', memberArray, () => {
      mapUtils.drawNetwork(memberDocument, memberArray, 'receives');
    });
  },
  'click #viewGives': (event, template) => {
    // TODO add check to see if 'receives' is not null
    let memberDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});

    let memberArray = memberDocument.network.gives.name;

    // clear network if one is drawn
    mapUtils.hideNetwork();

    // subscribe and draw the map once the subscription is ready
    template.subscribe('connectedMembers', memberArray, () => {
      mapUtils.drawNetwork(memberDocument, memberArray, 'gives');
    });
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
    // only one info window declared and open at a time
    const infoWindow = new google.maps.InfoWindow();

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

          // 'info': '<h3><a id="openCardLink">' + document.name + '</a></h3> <button class="ui small button" id="viewReceives">Receives</button>',
        });

        markers[document._id] = marker;
        
        networkPageVars.boundaryPoints[document._id] = new google.maps.LatLng(document.lat, document.lng);

        const contentString = mapUtils.createInfoWindowContent(document);
        
        google.maps.event.addListener( marker, 'click', function() 
        {
          // set the data context and create an instance of the card
          networkPageVars.activeCardId.set(document._id);

          infoWindow.setContent( contentString );
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

