import { Meteor } from 'meteor/meteor';
import 'meteor/aldeed:autoform';

Meteor.startup(function() {
  console.log('autoform hooks file loaded');
  const hooksObject = {
    // Called when any submit operation succeeds
    'onSuccess': function(method, result) {
      console.log('submited succesfully');
      // clear the dropdowns
      $('.dropdown').dropdown('clear');
    },
  };
  // add to all forms
  AutoForm.addHooks(null, hooksObject);
});
