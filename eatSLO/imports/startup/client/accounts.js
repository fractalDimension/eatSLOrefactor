import { AccountsTemplates } from 'meteor/useraccounts:core';

import '../../ui/pages/signIn.html';

let pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    '_id': "username",
    'type': "text",
    'displayName': "username",
    'required': true,
    'minLength': 5,
  },
  {
    '_id': 'email',
    'type': 'email',
    'required': true,
    'displayName': "email",
    're': /.+@(.+){2,}\.(.+){2,}/,
    'errStr': 'Invalid email',
  },
  pwd
]);

AccountsTemplates.configure({
  'defaultLayoutType': 'blaze',
  'defaultLayout': 'mainLayout',
  'defaultLayoutRegions': {
    'top': 'navBar',
    'content': 'customSignIn',
  },
  'defaultContentRegion': 'main',
  'hideSignUpLink': true,
});

AccountsTemplates.configureRoute('signIn');
