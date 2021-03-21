const Discord = require('discord.js');
const config = require('./config.json');
const roulette = require('./roulette.js');
const byen = require('./byen.js');
const moderation = require('./moderation.js');
const bot = new Discord.Client();

const PREFIX = config.prefix;

bot.on('ready', () => {
    console.log("Bot is online!");
}); 

bot.on('rateLimit', (rateLimitInfo) => {
    console.log("RATE LIMIT REACHED:")
    console.log(rateLimitInfo)
});

// "voice channel ID: "text channel ID"
const rooms = {
    "798244656974004228": ['820403403410112553'], // hall 
    "809803149266255902": ['820403647140724788'] // living room
}


// bot.on('voiceStateUpdate', async (oldState, newState)  => {
//     if (oldState.channelID != newState.channelID) {
       
//         if (rooms.hasOwnProperty(newState.channelID)) { // only add new role if the user is entering a listed room
//             let guild = await bot.guilds.fetch(config.serverID)
//             let member = await guild.members.fetch(newState.id)
//             member = await member.roles.add(rooms[newState.channelID])
//         }
        
//         if (rooms.hasOwnProperty(oldState.channelID)) {
//             let guild = await bot.guilds.fetch(config.serverID)
//             let member = await guild.members.fetch(newState.id)
//             member.roles.remove(rooms[oldState.channelID])
//         }
//         // member.roles.add(rooms[newState.channelID]) // add the role belonging to the room the user entered
//         //     .then((member) => {
//         //         if (!rooms.hasOwnProperty(oldState.channelID)) return; // only remove role if member is leaving a listed room
//         //         member.roles.remove(rooms[oldState.channelID]) // remove the role belonging to the room the user came from
//         //     });
//     }
// });

bot.login(process.env.PARTY_ROULETTE_TOKEN);

bot.on('message', (msg) => {

    if (msg.author.bot) return; // stops bot from replying to itself

    let args = msg.content.substring(PREFIX.length).split(" ");

    // Prevent spam from bot
    if (!msg.guild) return; // bot will only reply if message is sent in the guild (server)
    if (!msg.content.startsWith(PREFIX)) return; // bot will only reply if the message starts with the specified prefix

    // Only admins can use the bot
    if (!msg.member.hasPermission('ADMINISTRATOR')) {
        msg.channel.send("You have to be an administrator to use this bot");
        return;
    }

    // Handle arguments given
    switch (args[0].toLowerCase()) {

        case 'test':
            msg.channel.send("PartyRoulette is working")
                .then(message => message.delete({ timeout: 5000 })); // delete message after 5 seconds
            break;
            
        case 'start' :
            roulette.startRoulette(msg);
            msg.delete({ timeout: 5000 });
            break;

        case 'stop' :
            roulette.stopRoulette(msg);
            msg.delete({ timeout: 5000 });
            break;

        case 'openbyen' :
            byen.open(msg)
            msg.delete({ timeout: 5000 });
            break;

        case 'closebyen' :
            byen.close(msg)
            msg.delete({ timeout: 5000 });
            break;

        case 'on' :
            moderation.on(msg);
            msg.delete({ timeout: 5000 });
            break;

        case 'off' :
            moderation.off(msg);
            msg.delete({ timeout: 5000 });
            break;


        case 'velkommen' :
            velkommen(msg);
            msg.delete({ timeout: 5000 });
            break;

        default :
            msg.channel.send(`"${args[0]}" is an invalid command.`);
    }   
});
