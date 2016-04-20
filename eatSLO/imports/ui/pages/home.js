import './home.html';

import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.homePage.events({
  'click #goNetwork': () => {
    FlowRouter.go('/network');
  },
});
