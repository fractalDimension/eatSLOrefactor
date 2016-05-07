import './addMember.html';

import 'meteor/aldeed:autoform';
import 'meteor/fabienb4:autoform-semantic-ui';
import { Template } from 'meteor/templating';
import { NetworkMembers } from '../../api/networkMembers.js';
// import $ from 'jquery';

Template.addMemberPage.onCreated( () => {
  let template = Template.instance();

  template.autorun( () => {
    template.subscribe( 'networkMemberNames' );
  });
});

Template.addMemberPage.onRendered( () => {
  console.log('page rendered');
  this.$('.multiSelect').dropdown();
});

Template.addMemberPage.helpers({
  'Members': function(){
    return NetworkMembers;
  },
  'cityOptions': function(){
    return [
      {'label': 'SLO', 'value': 'San Luis Obispo'},
      {'label': 'Los Osos', 'value': 'Los Osos'},
      {'label': 'Avila', 'value': 'Avila'},
    ];
  },
  'accountOptions': function(){
    return [
      {'label': 'Grower', 'value': 'grower'},
      {'label': 'Supplier', 'value': 'supplier'},
      {'label': 'Preparer', 'value': 'preparer'},
    ];
  },
  'nameOptions': function(){
    return NetworkMembers.find().map( (doc) => {
      return {'label': doc.name, 'value': doc.name};
    });
  },
});


