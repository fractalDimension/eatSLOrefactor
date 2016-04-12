import './network.html';

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '../components/map.js';
import '../components/mapFilter.js';
import '../components/networkCard.js';

// these are used to manage the component states instead of polluting the Session variable namespace
const networkPageVars = {
  'activeCardId': new ReactiveVar(),
  'activeCardVisible': new ReactiveVar(false),
  'memberNetwork': [],
};

Template.networkPage.helpers({
  'displayCardVisible': () => {
    return networkPageVars.activeCardVisible.get();
  },
});

export { networkPageVars };
