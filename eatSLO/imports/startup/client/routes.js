import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates (the js files should load the hmtl)
import '../../ui/layouts/Layout.html';
import '../../ui/pages/home.js';
import '../../ui/pages/about.html';
import '../../ui/pages/network.js'; // correct js loading example
import '../../ui/pages/search.js';
import '../../ui/pages/addMember.js';
import '../../ui/components/nav.html';


FlowRouter.route('/', {
  action() {
    BlazeLayout.render("mainLayout", {top: "navBar", content: "homePage"});
  }
});

FlowRouter.route('/about', {
  action() {
    BlazeLayout.render("mainLayout", {top: "navBar", content: "aboutPage"});
  }
});

FlowRouter.route('/network', {
  action() {
    BlazeLayout.render("mainLayout", {top: "navBar", content: "networkPage"});
  }
});

FlowRouter.route('/search', {
  action() {
    BlazeLayout.render("mainLayout", {top: "navBar", content: "searchPage"});
  }
});

FlowRouter.route('/addMember', {
  'triggersEnter': [AccountsTemplates.ensureSignedIn],
  action() {
    BlazeLayout.render("mainLayout", {top: "navBar", content: "addMemberPage"});
  }
});
