import './network.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { NetworkMembers } from '../../api/networkMembers.js';

Template.networkPage.onCreated(function networkPageOnCreated() {
 	console.log('was i created?');
 	Meteor.subscribe('networkMembers');
});