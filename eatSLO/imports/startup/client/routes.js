import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates (the js files should load the hmtl)
import '../../ui/layouts/Layout.html';
import '../../ui/pages/home.html';
import '../../ui/pages/about.html';
import '../../ui/pages/network.js';
import '../../ui/components/nav.html';



FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {top: "navBar", content: "homePage"});
  }
});

FlowRouter.route('/about', {
  action: function() {
    BlazeLayout.render("mainLayout", {top: "navBar", content: "aboutPage"});
  }
});

FlowRouter.route('/network', {
  action: function() {
    BlazeLayout.render("mainLayout", {top: "navBar", content: "networkPage"});
  }
});