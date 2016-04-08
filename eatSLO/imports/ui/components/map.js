import './map.html';

import { Template } from 'meteor/templating';
import { GoogleMaps } from 'meteor/dburles:google-maps';

Template.networkMap.helpers(
{
  //paramters to load when map is first displayed   
  mapOptions: function() 
  {
    if (GoogleMaps.loaded()) 
    {
      return {
        center: new google.maps.LatLng(35.281694, -120.659695),
        zoom: 15,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      };
    }
  }
});