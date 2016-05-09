import './addMember.html';

import 'meteor/aldeed:autoform';
import 'meteor/fabienb4:autoform-semantic-ui';
import { Template } from 'meteor/templating';
import { NetworkMembers } from '../../api/networkMembers.js';
import { Session } from 'meteor/session';

Template.addMemberPage.onCreated( () => {
  // set session defaults to make the form type 'insert' with insert method
  Session.set('selectedMemberId', null);
  Session.set('formMethod', 'insertMember');

  AutoForm.resetForm('itemsMemberForm');

  let template = Template.instance();

  template.autorun( () => {
    template.subscribe( 'networkMembers' );
  });
});

Template.addMemberPage.onRendered( () => {
  console.log('page rendered');
  
  this.$('.multiSelect').dropdown();

  this.$('#memberSelectDropdown').dropdown({
    'onChange': function(value) {

      Session.set('selectedMemberId', value);
      Session.set('formMethod', 'updateMember');
      AutoForm.resetForm('itemsMemberForm');
      // $('.multiSelect').dropdown('refresh');
    },
  });
});

Template.addMemberPage.helpers({
  'memberCollection': function(){
    return NetworkMembers;
  },
  'memberArray': function(){
    return NetworkMembers.find();
  },
  'formType': function() {
    if (Session.get('selectedMemberId')) {
      return 'method-update';
    } else {
      return 'method';
    }
  },
  'memberDoc': function() {
    const memberId = Session.get('selectedMemberId');
    if (memberId) {
      return NetworkMembers.findOne({'_id': memberId});
    } else {
      return null;
    }
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
  'docPresent': function(){
    return Session.get('selectedMemberId');
  },
  'formMethod': function(){
    // this sets the meteor method for the form on submit
    const methodString = Session.get('formMethod');
    if (methodString === 'insertMember') {
      return 'insertMember';
    } else {
      return 'updateMember';
    }
  },
});

Template.addMemberPage.events({
  'click #addNewButton': () => {
    Session.set('formMethod', 'insertMember');
    Session.set('selectedMemberId', null);
    this.$('.dropdown').dropdown('clear', 'refresh');
  },
  'click #deleteButton': () => {
    const deletedDocId = Session.get('selectedMemberId');

    Session.set('selectedMemberId', null);
    this.$('.dropdown').dropdown('clear', 'refresh');
    Meteor.call('deleteMember', deletedDocId);
    AutoForm.resetForm('itemsMemberForm');
  },
});

Template.afQuickField.onRendered( () => {
  let template = Template.instance();
  
  if (template.data.class && template.data.class.includes('multiSelect') ) {
    $('.multiSelect').dropdown('refresh');
  }
});
