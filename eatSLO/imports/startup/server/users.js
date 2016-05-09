import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  console.log('Checking for user accounts');
  
  if ( !Accounts.findUserByUsername('eatslo') ) {
    console.log('No users found. Creating first account.');

    const adminAccount = {
      'username': 'eatslo',
      'password': 'rootamental1543',
    };

    Accounts.createUser(adminAccount);
  }
});
