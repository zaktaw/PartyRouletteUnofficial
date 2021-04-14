
const config = require('./config.json');

// allow sending messages for selected channels
async function on(msg) {

    let channels = await msg.guild.channels.cache.filter(
        channel => channel.parentID == config.textChatCategoryID
        || channel.id == config.drikkeTextChannelID
        || channel.id == config.spillTextChannelID
        || channel.id == config.inngangspartietVoiceChannelID
        || channel.parentID == config.byenCategoryID
        );
    
    channels.forEach((channel) => {
        
        if (channel.type == "text") {
            channel.overwritePermissions([
                {   
                    id: config.partyRouletteServerID, // everyone
                    allow: [ 'SEND_MESSAGES' ]
                },
                {
                    id: config.timeoutRoleID,
                    deny: [ 'SEND_MESSAGES', 'ADD_REACTIONS' ]
                }
            ])
        }

        else if (channel.type == "voice") {

            if (channel.id == config.inngangspartietVoiceChannelID) {
                channel.overwritePermissions([
                    {   
                        id: config.partyRouletteServerID, // everyone
                        allow: [ 'CONNECT' ]
                    },
                    {
                        id: config.timeoutRoleID,
                        deny: [ 'CONNECT' ]
                    }
                ])
            }

            else {
                channel.overwritePermissions([
                    {   
                        id: config.partyRouletteServerID, // everyone
                        deny: [ 'CONNECT' ]
                    },
                    {
                        id: config.timeoutRoleID,
                        deny: [ 'CONNECT' ]
                    }
                ])
            }
        }
    });
}

// deny sending messages for selected channels
async function off(msg) {

    let channels = await msg.guild.channels.cache.filter(
        channel => channel.parentID == config.textChatCategoryID
        || channel.id == config.drikkeTextChannelID
        || channel.id == config.spillTextChannelID
        || channel.parentID == config.vorsCategoryID
        || channel.parentID == config.byenCategoryID
        );

    channels.forEach((channel) => {

        if (channel.type == "text") {
            channel.overwritePermissions([
                {   
                    id: config.partyRouletteServerID, // everyone
                    deny: [ 'SEND_MESSAGES' ]
                },
                {
                    id: config.moderatorRoleID,
                    allow: [ 'SEND_MESSAGES' ]
                }
            ])

            channel.bulkDelete(100)
                .catch(err => console.log(err))
        }

        else if (channel.type == "voice") {
            channel.overwritePermissions([
                {   
                    id: config.partyRouletteServerID, // everyone
                    deny: [ 'CONNECT' ]
                },
                {
                    id: config.moderatorRoleID, // moderator
                    allow: [ 'CONNECT' ]
                }
            ])
        }
       
    });
}

module.exports = {
    on,
    off
}