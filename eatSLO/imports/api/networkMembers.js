import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import 'meteor/aldeed:collection2';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { check } from 'meteor/check';

export const NetworkMembers = new Mongo.Collection('networkMembers');

if (Meteor.isServer) {
	// This code only runs on the server

	NetworkMembers._ensureIndex( { "accountType" : 1 } );
	console.log('created networkMembers index')

	Meteor.publish('networkMembers', function networkMemberPublication() {
		return NetworkMembers.find();
  });

  Meteor.publish( 'memberSearch', function( search ) {
    check( search, Match.OneOf( String, null, undefined ) );

    let query      = {},
        projection = { limit: 10, sort: { name: 1 } };

    if ( search ) {
      let regex = new RegExp( search, 'i' );

      query = {
        $or: [
          { accountType: regex },
        ]
      };

      projection.limit = 100;
    }

    return NetworkMembers.find( query, projection );
  });

  Meteor.publish( 'networkSearch', function( search ) {
    check( search, Match.OneOf( Array, null, undefined ) );

    let query      = {},
        projection = 
        {
          fields: 
          {
            name: 1,
            city: 1,
            "profile.description": 1,
            accountType: 1,
            lat: 1,
            lng: 1,
            network: 1,
          }
        };

    if (search.length > 0)
    { 
      query = { accountType: 
        {
          $in: search
        }
      }
      // example of finished query
      //{ city: { $in: ['San Luis Obispo', 'Avila'] } } 
    };
    
    return NetworkMembers.find( query, projection );
  });

  Meteor.publish( 'connectedMembers', function( memberNameArray ) {
    check( memberNameArray, Match.OneOf( Array, null, undefined ) );

    let projection = 
        {
          fields: 
          {
            name: 1,
            city: 1,
            "profile.description": 1,
            accountType: 1,
            lat: 1,
            lng: 1,
            network: 1,
          }
        };


    if (memberNameArray.length > 0)
    { 
      query = { name: 
        {
          $in: memberNameArray
        }
      }
      // example of finished query
      //{ city: { $in: ['San Luis Obispo', 'Avila'] } } 
    };
    
    return NetworkMembers.find( query, projection );
  });
}

//next two sections enforce db operations to only happen via methods server side

NetworkMembers.allow({
	insert: () => false,
	update: () => false,
	remove: () => false
});

NetworkMembers.deny({
	insert: () => true,
	update: () => true,
	remove: () => true
});


Meteor.methods({
  'insertMember': (doc) => {
    check( doc, NetworkMembers.simpleSchema() );

    NetworkMembers.insert(doc);
    console.log('member added: ' + doc.name);
  },
  'deleteMember': (docId) => {
    // TODO change this check to be for user permision
    // check( doc, NetworkMembers.simpleSchema() );

    NetworkMembers.remove(docId);
    console.log('doc delete');
  },
  'updateMember': (modifier, documentId) => {
    // TODO change this check to be for user permision and data integrity
    // check( doc, NetworkMembers.simpleSchema() );

    NetworkMembers.update(documentId, modifier);
    console.log('doc updated');
  },
});

//create schema rules for db
let NetworkMembersSchema = new SimpleSchema({
  'name': {
    type: String,
    label: 'The name of the organization.'
  },
  'city': {
    type: String,
    label: 'The city where the organization lives.'
  },
  'accountType': {
    type: String,
    label: 'Type of organization.'
  },
  'lat': {
    type: Number,
    decimal: true,
    label: 'Latitude.'
  },
  'lng': {
    type: Number,
    decimal: true,
    label: 'Longitude.'
  },
  'profile': {
    type: Object,
    minCount: 1,
    label: 'Info about the organization.'
  },
  'profile.address': {
    type: String,
    label: 'Street address.'
  },
  'profile.website': {
    type: String,
    label: 'Website to find more info.'
  },
  'profile.description': {
    type: String,
    label: 'A short description. (One or two sentences)',
  },
  'profile.owner': {
    type: String,
    label: 'Owner of the organization.'
  },
  'profile.story': {
    type: String,
    label: 'A longer description of what the organization is about.'
  },
  'network': {
    type: Object,
    minCount: 1,
    label: 'Who the organization interacts with.'
  },
  'network.receives': {
    type: Object,
    minCount: 1,
    label: 'Who you receive from.',
    'optional': true,
  },
  'network.gives': {
    type: Object,
    minCount: 1,
    label: 'Who you give to.',
    'optional': true,
  },
  'network.receives.name': {
    type: [String],
    label: 'Receives from',
    'optional': true
  },
  'network.gives.name': {
    type: [String],
    label: 'Gives to',
    'optional': true,
  },
});

NetworkMembers.attachSchema( NetworkMembersSchema );
