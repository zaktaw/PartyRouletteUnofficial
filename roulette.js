const utility = require('./utility.js');
const config = require('./config.json');
const byen = require('./byen.js');
const activities = require('./activities.js');

const CATEGORY_ID = config.vorsCategoryID;
const LOBBY_ID = config.inngangspartietVoiceChannelID;
const ROULETTE_DURATION = config.rouletteDuration; // how much time between the channels changing (time in milliseconds).
const ANNOUNCEMENT_TIME_LONG = config.announcementTimeLong; // announce to the members that the channels changing in x time long before channels are changing (time in milleseconds). Disabled if time=0.
const ANNOUNCEMENT_TIME_SHORT = config.announcementTimeShort; // announce to the members that the channels are changing in x time short before channels are changing (time in milleseconds). Disabled if time=0.
const MIN_GROUP_SIZE = config.minGroupSize; // the preferred minimum number of members that will be assigned to each channel. 
const MAX_GROUP_SIZE = config.maxGroupSize; // the preferred maximum number of members that will be assigned to each channel.

let rouletteID = 0; // tracks how many roulettes that have been executed for logging purposes.
let started = false; // a roulette has been started.
let changeChannelsInterval;
let announcementLongTimeout;
let announcementShortTimeout;

function startRoulette(msg) {
    if (started) return msg.channel.send("Party roulette has already been started. Stop the party roulette with command 'pr stop' before starting a new one.");
    executeRoulette(msg)
    changeChannelsInterval = setInterval(() => executeRoulette(msg), ROULETTE_DURATION);
    started = true;
    msg.channel.send("Party roulette has been started.")
    byen.startTimeout(msg, changeChannelsInterval)
}

function stopRoulette(msg) {
    if (!started) return msg.channel.send("Party roulette has not been started. Start a roulette with command 'pr start'.");
    clearInterval(changeChannelsInterval);
    clearTimeout(announcementLongTimeout);
    clearTimeout(announcementShortTimeout);
    started = false;
    rouletteID = 0;
    msg.channel.send("Party roulette has been stopped.")
}

// get all members in the server. 
// Filter: ignore bots and only include users that are connected to a voice channel.
function getMembers(msg) {
    let members = msg.guild.members.cache.filter(member => !member.user.bot && member.voice.channel).array();
    return members;
}

// get all the channels in the server.
// Filter: only get voice channels in the specified category
function getChannels(msg) {
    let channels = msg.guild.channels.cache.filter(channel => channel.parentID == CATEGORY_ID && channel.type == 'voice' && channel.id != LOBBY_ID).array();
    return channels;
}

function shuffleMembers(members) {
    let membersShuffled = [];

    while (members.length > 0) {
        let randNum = utility.genRandNum(0,members.length-1); // get a random member from non-shuffled array
        membersShuffled.push(members[randNum]); // add member to the shuffled array
        members.splice(randNum, 1); // remove member from non-shuffled array
    }

    return membersShuffled;
}

function shuffleChannels(channels) {
    let channelsShuffled = [];

    while (channels.length > 0) {
        let randNum = utility.genRandNum(0,channels.length-1); // get a random channel from non-shuffled array
        channelsShuffled.push(channels[randNum]); // add channel to the shuffled array
        channels.splice(randNum, 1); // remove channel from non-shuffled array
    }

    return channelsShuffled;
}

/* Returns an array of arrays containing the groups.
The first value in each array is the voice channel the group will be assigned to and the rest of the values are the members.
Exampe: [ [voiceChannel1, member1, member2], [voiceChannel2, member3, member4, member5] ]
*/
function makeGroups(membersShuffled, channelsShuffled) {
    let channelCounter = 0;
    let groupMemberCounter = 0;
    let groupSize = utility.genRandNum(MIN_GROUP_SIZE,MAX_GROUP_SIZE);
    let groups = [ [channelsShuffled[0]] ]; // initialize array with the first voice channel 

    console.log("\Group " + (channelCounter+1) + ", size: " + groupSize);

    for (let i=0; i<membersShuffled.length; i++) {

        let channel = channelsShuffled[channelCounter];
        let member = membersShuffled[i];

        console.log("  Member: " + member.displayName + " => " + channel.name);

        groups[channelCounter][groupMemberCounter+1] = member; // assign member to group. +1 becauce the first value is reserved for the voice channel.
        groupMemberCounter++;

        // prepare a new group when a group has been filled if there are more members to assign
        if (groupMemberCounter == groupSize && i<membersShuffled.length-1) {
            channelCounter++;
            groups.push([channelsShuffled[channelCounter]]);
            groupSize = utility.genRandNum(MIN_GROUP_SIZE,MAX_GROUP_SIZE); 
            groupMemberCounter = 0;
            if (channelCounter == channelsShuffled.length) channelCounter = 0; // go back to the first channel if there aren't any left

            console.log("Group " + (channelCounter+1) + ", size: " + groupSize);
        }
    }

    return groups;
}

// check if the last group has too few members and if so move them to other groups
// only do this if other groups exists
function makeCorrections(groups) {    
    let lastGroup = groups[groups.length-1];
    if (lastGroup.length-1 < MIN_GROUP_SIZE && groups.length > 1) { // subtract 1 to not count the channel
 
        while (lastGroup.length > 1) {
            let member = lastGroup.pop(); // remove member from group
            
            // find the group with the fewest members to assign the members more evenly
            let smallestGroup = groups[0]; 
            for (let i=0; i<groups.length-1; i++) { // length-1 to not include the last group
                if (groups[i].length < smallestGroup.length) smallestGroup = groups[i];
            }

            console.log('Correction: ' + member.displayName + ' => ' + smallestGroup[0].name);
            smallestGroup.push(member); // add member to the smallest group
        }

        groups.pop(); // delete the last group
    }

    return groups;
}

function setVoiceChannels(groups) {
    for (let i=0; i<groups.length; i++) {

        for (let j=1; j<groups[i].length; j++) { // j=1 to only iterate through the members and not the channel
            let member = groups[i][j];
            let channel = groups[i][0];
            member.voice.setChannel(channel.id)
                .catch(err => console.log(err));
        }

    }
}

// Send an announcemnet to the members of the server that the channels are about to change in long time.
function announceChangingChannelsLong(msg) {
    let time = ROULETTE_DURATION - ANNOUNCEMENT_TIME_LONG; // how long before sending announcement.
    let timeInMinutes = ANNOUNCEMENT_TIME_LONG/1000/60;
    announcementLongTimeout = setTimeout( () => {
        msg.channel.send("@everyone Channels are changing in " + timeInMinutes  + (timeInMinutes>1?" minutes":" minute") + "!") //@everyone is used to tag everyone in the server.
            .then(message => message.delete({ timeout: 5000 })); // delete message after 5 seconds
    }, time);
}

// Send an announcemnet to the members of the server that the channels are about to change in short time.
function announceChangingChannelsShort(msg) {
    let time = ROULETTE_DURATION - ANNOUNCEMENT_TIME_SHORT; // how long before sending announcement.
    let timeInSeconds = ANNOUNCEMENT_TIME_SHORT/1000;
    announcementShortTimeout = setTimeout( () => {
        msg.channel.send("@everyone Channels are changing in " + timeInSeconds  + " seconds!") //@everyone is used to tag everyone in the server.
            .then(message => message.delete({ timeout: 5000 })); // delete message after 5 seconds
    }, time);
}

function sendActivity(msg) {
    let activity = activities.getActivity();
    if (activity) { // recieves an empty activity when activites array is empty
        msg.channel.send(activity)
    }
}

function executeRoulette(msg) {

    if (ANNOUNCEMENT_TIME_LONG > 0) announceChangingChannelsLong(msg);
    if (ANNOUNCEMENT_TIME_SHORT > 0) announceChangingChannelsShort(msg);

    rouletteID++;
    console.log("\nRoulette " + rouletteID + ":");

    let members = getMembers(msg);
    let channels = getChannels(msg);
    let membersShuffled = shuffleMembers(members);
    let channelsShuffled = shuffleChannels(channels);

    let groups = makeGroups(membersShuffled, channelsShuffled);
    groups = makeCorrections(groups);
   
    setVoiceChannels(groups);

    //sendActivity(msg) // not in use
}

module.exports = {
    startRoulette,
    stopRoulette,
    getMembers,
    getChannels,
    shuffleMembers,
    shuffleChannels,
    executeRoulette
}