import './network.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { NetworkMembers } from '../../api/networkMembers.js';

import '../components/map.js';

Template.networkPage.onCreated(function networkPageOnCreated() {
 	Meteor.subscribe('networkMembers');
});