import './searchField.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { NetworkMembers } from '../../api/networkMembers.js';
import { ReactiveVar } from 'meteor/reactive-var';

Template.searchField.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'memberSearch', template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
});

Template.searchField.helpers({
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
  },
  members() {
    let members = NetworkMembers.find();
    if ( members ) {
      return members;
    }
  }
});

Template.searchField.events({
  'keyup [name="search"]' ( event, template ) {
    let value = event.target.value.trim();

    if ( value !== '' && event.keyCode === 13 ) {
      template.searchQuery.set( value );
      template.searching.set( true );
    }

    if ( value === '' ) {
      template.searchQuery.set( value );
    }
  }
});