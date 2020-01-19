import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import Nexus from 'nexus-api';

export const userAccounts = new Mongo.Collection('userAccounts');

if (Meteor.isServer) {
    Meteor.publish('userAccounts', function accountsPublication() {
        return userAccounts.find({});
    })
}

Meteor.methods({
    'account.create'(userData) {
        check(userData, Object);

        console.log('account.create', userData);

        const nexusAPIObject = Nexus.create(userData.key, "Meteor MongoDB", "1.0.0", "skyrim")
            .then((object) => console.log('nexusAPIObject', object))
            .catch(console.error);

        userAccounts.insert({
            name: userData.name,
            avatar: userData.avatar,
            id: userData.id,
            key: userData.key,
            apiObject: nexusAPIObject,
        });
    },
    'account.getGames'(key) {
        check(key, String);

        const user = userAccounts.findOne({key:key});

        user.apiObject.getGames().then((gameList) => {
            console.log(gameList.length, "games found.");
            return gameList;
        });
    },
});