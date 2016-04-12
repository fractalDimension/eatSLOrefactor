import './networkCard.html';

import { Template } from 'meteor/templating';
import { NetworkMembers } from '../../api/networkMembers.js';
import { Session } from 'meteor/session';
import { drawNetwork, hideNetwork } from './map.js';
import { networkPageVars } from '../pages/network.js';

Template.networkCard.onRendered( () => {
  console.log('im alive');
});

Template.networkCard.helpers(
{
  activeCard: function()
  {
    return NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});
  }
});

Template.networkCard.events({
  'click #closeLink': () => {
    $('#detailCard').slideToggle('slow');
    networkPageVars.activeCardVisible.set(false);
    hideNetwork();
  },
  'click #viewNetwork': (event, template) => {
    // TODO add check to see if 'receives' is not null
    let memberDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});

    console.log('view network click, active card Document: ');
    console.log(memberDocument);

    let memberId = memberDocument._id;
    let memberArray = memberDocument.network.receives.name;
    let memberLat = memberDocument.lat;
    let memberLng = memberDocument.lng;

    console.log(memberArray);
    // subscribe and draw the map once the subscription is ready
    template.subscribe('connectedMembers', memberArray, () => {
      // it might be better to just pass the whole doc in...
      drawNetwork(memberId, memberArray, memberLat, memberLng);
    });
      
   },
});

