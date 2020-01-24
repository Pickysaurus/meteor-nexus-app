import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Links from '/imports/api/links';
import Nexus from 'nexus-api';

let NexusModsClient;

function insertLink(title, url) {
  Links.insert({ title, url, createdAt: new Date() });
}

if (Meteor.isServer) {

  Meteor.methods({
    validateAPIkey: async function (apiKey) {
      check(apiKey, String);
      try {
        !NexusModsClient ? await configureNexusClient(apiKey) : undefined;
        const validateReply = await NexusModsClient.validateKey(apiKey);
        return validateReply;
      }
      catch(err) {
        console.error(err);
        throw new Meteor.Error('Error validating API key', err);
      }

    },
    getGames: async function (apiKey) {
      check(apiKey, String);
      try {
        await configureNexusClient(apiKey);
        const gameList = NexusModsClient.getGames();
        return gameList;
      } 
      catch(err) {
        console.error(err);
        throw new Meteor.Error('Error getting games', err);
      }     
    }
  })
}

async function configureNexusClient(apiKey) {
  if (!NexusModsClient) {
    NexusModsClient = await Nexus.create(apiKey, 'Mod Data Site', '1.0.0', 'skyrim').catch(err => console.error);
  }
  else {
    await NexusModsClient.setKey(apiKey);
  }
}

Meteor.startup(async () => {
  // If the Links collection is empty, add some data.
  if (Links.find().count() === 0) {
    insertLink(
      'Do the Tutorial',
      'https://www.meteor.com/tutorials/react/creating-an-app'
    );

    insertLink(
      'Follow the Guide',
      'http://guide.meteor.com'
    );

    insertLink(
      'Read the Docs',
      'https://docs.meteor.com'
    );

    insertLink(
      'Discussions',
      'https://forums.meteor.com'
    );
  }
});