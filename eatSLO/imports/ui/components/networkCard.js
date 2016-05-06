import './networkCard.html';

import { Template } from 'meteor/templating';
import { NetworkMembers } from '../../api/networkMembers.js';
import { drawNetwork, hideNetwork, resizeMap, centerOnActiveCard} from './map.js';
import { networkPageVars } from '../pages/network.js';
import $ from 'jquery';
import 'meteor/semantic:ui';
import '/client/lib/semantic-ui/definitions/modules/dropdown.js';

Template.networkCard.onRendered( () => {
  // console.log('im rendered');
  $('#detail-card').slideToggle('slow', function() {
    $('.slick-slider').slick({
      'slidesToShow': 1,
      'slidesToScroll': 1,
      'dots': false,
      'arrows': false,
      'infinite': false,
      'lazyLoad': 'ondemand',
    });
    resizeMap();
    centerOnActiveCard();
  });
  // note 'this' is necessary
  this.$('.cardDropdown').dropdown({
    'keepOnScreen': true,
  });
  $('#mapFilterDiv').slideToggle('slow');
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
    $('#mapFilterDiv').slideToggle('slow');
    $('#detail-card').slideToggle('slow', function(){
      resizeMap();
      networkPageVars.activeCardVisible.set(false);
      hideNetwork();
    });
  },
  'click #centerLink': () => {
    centerOnActiveCard();
  },
  'click #viewReceives': (event, template) => {
    // TODO add check to see if 'receives' is not null
    let memberDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});

    let memberArray = memberDocument.network.receives.name;

    // subscribe and draw the map once the subscription is ready
    template.subscribe('connectedMembers', memberArray, () => {
      drawNetwork(memberDocument, memberArray, 'receives');
    });
  },
  'click #viewGives': (event, template) => {
    // TODO add check to see if 'receives' is not null
    let memberDocument = NetworkMembers.findOne({'_id': networkPageVars.activeCardId.get()});

    let memberArray = memberDocument.network.gives.name;

    // console.log(memberArray);
    // subscribe and draw the map once the subscription is ready
    template.subscribe('connectedMembers', memberArray, () => {
      drawNetwork(memberDocument, memberArray, 'gives');
    });
  },
});

