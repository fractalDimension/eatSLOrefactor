import './networkCard.html';

import { Template } from 'meteor/templating';
import { NetworkMembers } from '../../api/networkMembers.js';
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
  },
  receivesPresent: function()
  {
    let currentCardDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});

    if (currentCardDocument.network.receives) {
      return true;
    }
  },
  givesPresent: function()
  {
    let currentCardDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});

    if (currentCardDocument.network.gives) {
      return true;
    }
  }
});

Template.networkCard.events({
  'click #closeLink': () => {
    $('#detailCard').slideToggle('slow');
    networkPageVars.activeCardVisible.set(false);
    hideNetwork();
  },
  'click #viewReceives': (event, template) => {
    // TODO add check to see if 'receives' is not null
    let memberDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});

    let memberArray = memberDocument.network.receives.name;

    console.log(memberArray);
    // subscribe and draw the map once the subscription is ready
    template.subscribe('connectedMembers', memberArray, () => {
      drawNetwork(memberDocument, memberArray, 'receives');
    });
  },
  'click #viewGives': (event, template) => {
    // TODO add check to see if 'receives' is not null
    let memberDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});

    let memberArray = memberDocument.network.gives.name;

    console.log(memberArray);
    // subscribe and draw the map once the subscription is ready
    template.subscribe('connectedMembers', memberArray, () => {
      drawNetwork(memberDocument, memberArray, 'gives');
    });
  },
});

