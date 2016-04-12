import { Meteor } from 'meteor/meteor';
import { NetworkMembers } from '../../api/networkMembers.js';


Meteor.startup(() => {
  console.log('Server started');

  if (NetworkMembers.find().count() === 0) {
    console.log('Adding dummy accounts');

    let dummyNetworkMembers = [
      {
        'name': 'Bliss Cafe',
        'slug': 'bliss-cafe',
        'city': 'San Luis Obispo',
        'accountType': 'preparer',
        // test moving these to a sub-object (might cause trouble with reactivity)
        'lat': 35.279858,
        'lng': -120.663549,
        'profile':
        {
          'address': '123 Higuera st',
          'website': 'blisscafeslo.com',
          'description': "We're a local vegan cafe!",
          'owner': 'David Fintel',
          'story': 'We started out as a food booth and grew into the devoted restaurant you see today.'
        },
        'network':
        {
          'receives':
          {
            'name': ['Chumash Farms', 'Cal Poly Organic Farm', 'See Canyon Fruit Ranch'],
          },
          'gives':
          {
            'name': ['Food Bank'],
          },
        },
      },
      {
        'name': 'Chumash Farms',
        'slug': 'chumash-farms',
        'city': 'Los Osos',
        'accountType': 'grower',
        'lat': 35.322514,
        'lng': -120.830992,
        'profile':
        {
          'address': '647 Main st',
          'website': 'chumashfarms.com',
          'description': "I'm a farm that Scott is involved with.",
          'owner': 'Steve Aoki',
          'story': 'We grow lots of this and Scott helps us out a bunch. He can paint signs and connect us with awesome people.'
        },
        'network':
        {
          'gives':
          {
            'name': ['Bliss Cafe', 'Food Bank'],
          },
        },
      },
      {
        'name': "Linaea's",
        'slug': 'linaeas',
        'city': 'San Luis Obispo',
        'accountType': 'preparer',
        'lat': 35.279123,
        'lng': -120.663250,
        'profile':
        {
          'address': '475 Garden st',
          'website': 'coffeshop.com',
          'description': 'Locally owned coffee shop.',
          'owner': 'Ms. Linaea',
          'story': 'This is a coffee shop that Michael finds enjoyable. He will often head down to eat there before work.'
        },
        'network':
        {
          'receives':
          {
            'name': ['Chumash Farms', 'See Canyon Fruit Ranch', 'Bear Creek Ranch'],
          },
          'gives':
          {
            'name': ['Food Bank'],
          },
        },
      },
      {
        'name': 'Cal Poly Organic Farm',
        'slug': 'cal-poly-organic-farm',
        'city': 'San Luis Obispo',
        'accountType': 'grower',
        'lat': 35.298402,
        'lng': -120.670819,
        'profile':
        {
          'address': 'Cal Poly Campus',
          'website': 'calpoly.org',
          'description': 'we sell things',
          'owner': 'Cal Poly Corp.',
          'story': 'The Cal Poly Organic Farm is an 11 acre production unit in the Horticulture and Crop Science Department that is certified organic by California Certified Organic Farmers (CCOF) with the primary mission of providing undergraduate students a place to experience hands-on learning in organic and sustainable farming and gardening practices. Our vegetable production includes dozens of varieties of produce that are marketed in several local direct sales events like farmer’s markets, a campus farm market and to local vendors and restaurants; produce not sold is donated to the Food Bank.'
        },
        'network':
        {
          'gives':
          {
            'name': ['Bliss Cafe', 'Food Bank', 'Good Tides'],
          },
        },
      },
      {
        'name': 'See Canyon Fruit Ranch',
        'slug': 'see-canyon-fruit-ranch',
        'city': 'Avila',
        'accountType': 'grower',
        'lat': 35.211889,
        'lng': -120.724289,
        'profile':
        {
          'address': '2345 See Canyon Road',
          'website': 'http://www.seecanyonwedding.com/',
          'description': "We're a local vegan cafe!",
          'owner': 'Guy Dude',
          'story': 'The Cal Poly Organic Farm is an 11 acre production unit in the Horticulture and Crop Science Department that is certified organic by California Certified Organic Farmers (CCOF) with the primary mission of providing undergraduate students a place to experience hands-on learning in organic and sustainable farming and gardening practices. Our vegetable production includes dozens of varieties of produce that are marketed in several local direct sales events like farmer’s markets, a campus farm market and to local vendors and restaurants; produce not sold is donated to the Food Bank.'
        },
        'network':
        {
          'gives':
          {
            'name': ['Bliss Cafe', 'Food Bank', "Linaea's"],
          },
        },
      },
      {
        'name': 'Bear Creek Ranch',
        'slug': 'bear-creek-ranch',
        'city': 'Los Osos',
        'accountType': 'supplier',
        'lat': 35.280563,
        'lng': -120.783978,
        'profile':
        {
          'address': '3698 clark valley rd',
          'website': 'http://www.localharvest.org/bear-creek-ranch-M42544',
          'description': 'Growing sub-tropical fruits',
          'owner': 'Guy Dude',
          'story': 'Bear Creek Ranch is a 600 acre ranch nestled at the end of Clark Valley Road in between Los Osos and San Luis Obispo.Through rotational grazing we strive to create healthy native grasslands and oak woodlands. Our goals are sustainibility, biodiversity, promoting native grasses, and overall health of our land' 
        },
        'network':
        {
          'gives':
          {
            'name': ['Bliss Cafe', 'Food Bank', "Linaea's"]
          }
        }
      },
      {
        'name': 'Good Tides',
        'slug': 'good-tides',
        'city': 'Los Osos',
        'accountType': 'supplier',
        'lat': 35.327639,
        'lng': -120.840564,
        'profile':
        {
          'address': '1326 2nd Street, Baywood Park ',
          'website': 'http://www.goodtides.com/',
          'description': 'Organic Bistro',
          'owner': 'Guy Dude',
          'story': 'Good Tides offers you a wholesome, full menu of Organic meals and other delicious goodies. ',
        },
        'network':
        {
          'receives':
          {
            'name': ['Cal Poly Organic Farm']
          }
        }
      }

    ];

    _.each(dummyNetworkMembers, function(account) {
      NetworkMembers.insert(account);
    });
  }

});