const config = require('./config.json')
const BYEN_OPEN_TIME = config.byenOpenTime * 1000
const BYEN_CATEGORY_ID = config.byenCategoryID
const SERVER_ID = config.serverID
const ANNOUNCEMENT_TIME_LONG = config.announcementtimeByenLong
const ANNOUNCEMENT_TIME_SHORT = config.announcementtimeByenSort

function startTimeout(msg, changeChannelsInterval) {  
    close(msg)
    let timeNow = new Date().getTime()
    let millisecondsTillOpenByen = BYEN_OPEN_TIME - timeNow
    console.log("Opening byen in " + millisecondsTillOpenByen + " milliseconds")

    // open byen
    setTimeout(() => {
        open(msg)
        clearInterval(changeChannelsInterval) // end roulette
    }, millisecondsTillOpenByen)

    // announce long
    if (ANNOUNCEMENT_TIME_LONG > 0) {
        setTimeout(() => {
            msg.channel.send("@everyone Byen åpner om " + (ANNOUNCEMENT_TIME_LONG/1000/60) + " minutter!")
                .then(message => message.delete({ timeout: 5000 })); // delete message after 5 seconds
        }, millisecondsTillOpenByen - ANNOUNCEMENT_TIME_LONG)
    }
    
    // announce short
    if (ANNOUNCEMENT_TIME_SHORT > 0) {
        setTimeout(() => {
            msg.channel.send("@everyone Byen åpner om " + (ANNOUNCEMENT_TIME_SHORT/1000) + " sekunder!")
                .then(message => message.delete({ timeout: 5000 })); // delete message after 5 seconds
        }, millisecondsTillOpenByen - ANNOUNCEMENT_TIME_SHORT)
    }
}

function open(msg) {
    channels = getByenChannels(msg);
       
    channels.forEach((channel) => {
        channel.overwritePermissions([
            {   
                id: SERVER_ID,
                allow: [ 'CONNECT' ]
            }
        ])
    });

    msg.channel.send("@everyone Byen er nå åpen!")
        .then(message => message.delete({ timeout: 5000 })); // delete message after 5 seconds
    console.log('Byen is now open');
}

function close(msg) {
    channels = getByenChannels(msg);
       
    channels.forEach((channel) => {
        channel.overwritePermissions([
            {   
                id: SERVER_ID,
                deny: [ 'CONNECT' ]
            }
        ])
    });

    console.log('Byen is now closed');
}

function getByenChannels(msg) {
    let channels = msg.guild.channels.cache.filter(channel => channel.parentID == BYEN_CATEGORY_ID && channel.type == 'voice').array();
    return channels;
}

module.exports = {
    open,
    close,
    startTimeout
}