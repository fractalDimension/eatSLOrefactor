import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
 
export const NetworkMembers = new Mongo.Collection('networkMembers');

if (Meteor.isServer) {
  // This code only runs on the server
	Meteor.publish('networkMembers', function networkMemberPublication() {
		return NetworkMembers.find();
  });
}