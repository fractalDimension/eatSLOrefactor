import './mapFilter.html';

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { redrawBounds} from './map.js';
import { networkPageVars } from '../pages/network.js';
import { NetworkMembers } from '../../api/networkMembers.js';

Template.mapFilter.onCreated( function() 
{
	let template = Template.instance();

   //create reactive dict within the scope of the template instance that gets destroyed
   template.searchQuery = new ReactiveVar( new Array() );
   template.mapState = new ReactiveDict();
   //TODO: eliminate default values and check if null sessionSetter
   template.mapState.set(
   {
      growerChecked: false,
      supplierChecked: false,
      preparerChecked: false,
   });

   template.autorun( () => {
   	template.subscribe( 'networkSearch', template.searchQuery.get(), () => {
         if (networkPageVars.mapReady.get() ) {
            redrawBounds();
         };
      });
   });
   
});

Template.mapFilter.events(
{
   'click #supplier-toggle': function(e,template)
   {
   	$('#supplier-toggle').toggleClass("active");
      //TODO refactor: use the prsence of the class to know if its checked
      toggleMapState('supplierChecked');
      querySetter(template, 'supplier', template.mapState.get('supplierChecked'));
      
   },
   'click #preparer-toggle': function(e,template)
   {
   	$('#preparer-toggle').toggleClass("active");
      toggleMapState('preparerChecked');
      querySetter(template, 'preparer', template.mapState.get('preparerChecked'));
   },
   'click #grower-toggle': function(e,template)
   {
   	$('#grower-toggle').toggleClass("active");
      toggleMapState('growerChecked');
      querySetter(template, 'grower', template.mapState.get('growerChecked'));
   }
});

var toggleMapState = function (stateName)
{
   Template.instance().mapState.set(stateName, !Template.instance().mapState.get(stateName));
}

//this sets the session variable that the network page subscription is taking as a parameter
var querySetter = function (template, filterValue, isChecked) 
{
   if (isChecked)
   {
      //add item to session array to construct query with
      var prevSession = template.searchQuery.get().slice(0);
      var newSession = [filterValue];
      Array.prototype.push.apply(newSession, prevSession);
      template.searchQuery.set( newSession );
      //Session.set(dictKey, newSession);
      //console.log(newSession);
   } else 
   {
      //if the button is un checked then remove item from session array 
      var prevSession = template.searchQuery.get().slice(0);
      var index = prevSession.indexOf(filterValue);
      if (index > -1) 
      {
         prevSession.splice(index, 1);
         
         template.searchQuery.set(prevSession);
         //console.log(prevSession);
      }
   }
}