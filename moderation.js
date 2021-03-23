
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

function velkommen(msg) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Velkommen til fest-rulett!')
        .setDescription('Fest-rulett er en Discord-fest der man blir plassert i tilfeldige voice channels med 2-5 andre tilfeldige deltakere av arrangementet. \
        Hvert kvarter byttes det automatisk hvilken kanal man er i og hvem man er med i. \
        Arrangementet starter fredag 12.03.2021 kl 19:00! Under er det skrevet litt mer informasjon om arrangementet.')
        .setColor(0xFF9400)
        .addField('Hvordan bli med?', 'Gå inn i voice-kanalen som heter "inngangspartiet" som ligger under kategorien "vors". \
        Hvert kvarter blir du automatisk plassert i en annen voice channel. Det kan hende du må vente litt i inngangspartiet før du blir plasssert\
        (rulleringene skjer xx:00, xx:15, xx:30, xx:45 hver time). Hvis du ikke er inne i en voice-kanal blir du ikke tatt med i rulleringen. \
        \n\nNB! Merk at hvis veldig mange er med kommer det til å være en forsinkelse på ca. 8-10 sekunder hver gang 10 personer har blitt flyttet \
        i en rullering. Så hvis du ikke blir flyttet er det bare å vente litt så skjer det om noen sekunder.')
        .addField('Byen', 'Voice channel-rulleringen foregår fram til 23 og da åpner byen! Disse kanalene er åpne for alle og man kan gå fritt mellom de.')
        .addField('Aktiviteter', 'Ved hver rullering blir det postet et forslag til en aktivitet som alle i voice-kanalen kan gjøre sammen. \
        Disse blir postet i kanalen "aktiviteter" under kategorien "other". Hvis aktiviteten krever at man skriver noe i en tekst chat, \
        bruk tekst-kanalen med samme navn som vocie-kanalen du er i. Merk at alle på arrangementet kan lese hva som skrives i alle tekst-kanaler.')
        .addField('Drikke', 'I kanalen som heter "drikke" under kategorien "other" kan du se hva de andre på arrangementet har drukket og du kan \
        legge inn hva du selv har drukket. For å legge inn noe er det bare å skrive navnet på det du har drukket, f. eks: Hansa (0,5 liter). Hvis du skriver noe feil \
        kan du fjerne det siste du la inn ved å skrive "undo" (uten ""-tegnene). Det er lagt inn timeout på 10 sekunder mellom hver gang man kan \
        skrive noe i kanalen for at drikkeoversikten skal rekke å oppdatere seg.')
        .addField('Musikk', 'Vi kjører en felles musikk-queue på beatsense.com for de som vil være med på det. Hvis du bruker Chrome og det ikke går å koble til, \
        prøv å bruke en annen nettleser. Her er linken til queue-en: http://www.beatsense.com/festsimulator?ref=beatster&u=017155ec2ac4S')
        .addField('Regler', '1. Ikke driv med noen form for trakasering eller diskrimenering av de andre deltakerne. Bare vær hyggelige mot hverandre. \
        \n2. Kun skriv i tekst-kanalen "general" og tekst-kanalen med samme navn som voice-kanalen du er i. Husk at alle deltakerene kan lese \
        hva som skrives i alle tekst-kanaler, så ikke skriv noe du ikke vil at de andre skal kunne lese! \
        \n3. Bare skriv det du har drukket i drikke-kanalen, ikke bruk den til å skrive andre ting. \
        \n4. Hvis du forlater arrangementet eller blir borte fra det i en lang periode, sørg for at du kobler fra voice-kanalen du er i.\
        \n5. Ellers er det bare å kose seg!');

    msg.channel.send(embed)
}

module.exports = {
    on,
    off,
    velkommen
}