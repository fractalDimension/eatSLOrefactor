import { Meteor } from 'meteor/meteor';
import { GoogleMaps } from 'meteor/dburles:google-maps';

Meteor.startup(function() {
  // load the map on client load instead of map template so its more responsive
  GoogleMaps.load({'key': 'AIzaSyCGJ1byWbP6fmOPB8iR_CFieYMjSm0SKxc'});
});
