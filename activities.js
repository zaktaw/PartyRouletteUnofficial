const Discord = require('discord.js');
const utility = require('./utility.js')

let index = 10;

let activities = [
    {
        index: 0,
        title: "Livshistorie",
        content: "Alle i rommet forteller sin livshistorie på maks 30 sekunder."
    },
    {
        index: 1,
        title: "Lol",
        content: "Prøv å få alle i rommet til å le ved å poste et bilde i chatten."
    },
    {
        index: 2,
        title: "Samarbeidshistorie",
        content: "Alle i rommet lager en historie sammen ved å rullere på å skrive hvert sitt ord i chatten."
    },
    {
        index: 3,
        title: "Funfact",
        content: "Alle i rommet forteller en funfact om seg selv."
    },
    {
        index: 4,
        title: "Hattefest",
        content: "Alle i rommet tar på et valgfritt hodeplagg og har på dette fram til neste rullering."
    },
    {
        index: 5,
        title: "Emoji-historie",
        content: "Velg én person i rommet til å være historie-forteller. De andre i rommet bytter på å skrive en emoji i chatten mens \
        historiefortelleren forteller (/ narrates) hva emoji-historien handler om."
    },
    {
        index: 6,
        title: "Gruppebilde",
        content: "Ta et gruppebilde (screenshot av alle webkameraene i rommet) sammen og post det i tekstchat-kanalen General."
    },
    {
        index: 7,
        title: "Kategori-lek",
        content: "Én i rommet sier en kategori (f. eks frukt). Alle deltakerne sier så eksemplarer av den valgte kategorien på rundgang \
        helt til en person ikke kommer på noe eller bruker for lang tid. Gjenta til alle i rommet har sagt en kategori."
    },
    {
        index: 8,
        title: "Miming",
        content: "Alle i rommet bytter på å mime en valgt berømt person (kan være fiktiv, ekte, levende eller dø). \
        Om å gjøre for de andre å gjette riktig først!"
    },
    {
        index: 9,
        title: "Make 'em laugh",
        content: "Alle i rommet sender en setning på privatmelding til personen under dem i rommmet. \
        Skriv setningen med intensjon om å få personen til å le. Alle i rommet bytter så på å prøve å lese setningen de mottok \
        uten å le."
    },
    {
        index: 10,
        title: "eeeh..",
        content: "Fram til neste rom-rullering er det ikke lov å bruke bokstaven 'e' når man snakker og skriver. Erstatt bokstaven med en annen bokstav \
        ved å f. eks si 'jag' istedet for 'jeg'."
    },
    {
        index: 11,
        title: "GIF captions",
        content: "Én i rommet poster en GIF i chatten. De andre i rommet poster en caption (en morsom bildetekst) til GIF-en. \
        Alle i rommet stemmer så på caption-en de synes var best ved å reagere med en tommel opp-emoji på den."
    },
    {
        index: 12,
        title: "Koppfest!",
        content: "Fram til neste rullering må alle i rommet drikke fra en gjenstand som vanligvis ikke \
        blir brukt til å drikke fra. Ekstra creds for kreativitet!"
    },
    {
        index: 13,
        title: "Try not to laugh!",
        content: "Prøv å ikke smile eller le fram til neste rom-rullering. Prøv samtidig å få de andre i rommet til å smile eller le. \
        Kan gjøres til en drikkelek hvis man vil ved at man må drikke hver gang man smiler eller ler."
    }, 
    {
        index: 14,
        title: ":O",
        content: "Alle i rommet bytter på å bruke webkameraet til å lage den skumleste grimasen de greier."
    },
    {
        index: 15,
        title: "SHOTS!",
        content: "Alle i rommet tar en shot av valgfri drikke."
    }
]

let activitiesTest = [
    {
        index: 0,
        title: "Activity 1",
        content: "Content for activity 1."
    },
    {
        index: 1,
        title: "Activity 2",
        content: "Content for activity 2."
    },
    {
        index: 2,
        title: "Activity 3",
        content: "Content for activity 3."
    },
    {
        index: 3,
        title: "Activity 4",
        content: "Content for activity 4."
    },
    {
        index: 4,
        title: "Activity 5",
        content: "Content for activity 5."
    },
    {
        index: 5,
        title: "Activity 6",
        content: "Content for activity 6."
    },
    {
        index: 6,
        title: "Activity 7",
        content: "Content for activity 7."
    },
    {
        index: 7,
        title: "Activity 8",
        content: "Content for activity 8."
    },
    {
        index: 8,
        title: "Activity 9",
        content: "Content for activity 9."
    },
    {
        index: 9,
        title: "Activity 10",
        content: "Content for activity 10."
    },
    {
        index: 10,
        title: "Activity 11",
        content: "Content for activity 11."
    },
    {
        index: 11,
        title: "Activity 12",
        content: "Content for activity 12."
    },
    {
        index: 12,
        title: "Activity 13",
        content: "Content for activity 13."
    },
    {
        index: 13,
        title: "Activity 14",
        content: "Content for activity 14."
    }, 
    {
        index: 14,
        title: "Activity 15",
        content: "Content for activity 15"
    },
    {
        index: 15,
        title: "Activity 16",
        content: "Content for activity 16."
    }
]

const colors = [0xFFFB00, 0xFF0000, 0xFF9400, 0x66FF00, 0x00FFEE, 0x0042FF, 0x7900FF, 0xFE00FF]

function getRandomActivity() {

    if (activities.length == 0) return;

    let randNum = utility.genRandNum(0,activities.length-1); // get a random activity from non-shuffled array
    let activity = activities[randNum];
    activities.splice(randNum, 1); // remove activity from non-shuffled array
    let embedColor = colors[utility.genRandNum(0,colors.length-1)];

    // make embed
    const activityEmbed = new Discord.MessageEmbed()
        .setTitle(activity.title)
        .setColor(embedColor)
        .setDescription(activity.content);

    return activityEmbed
}

function getActivity() {
    if (index > activities.length-1) return;

    let activity = activities[index];
    index++;
    let embedColor = colors[utility.genRandNum(0,colors.length-1)];

    // make embed
    const activityEmbed = new Discord.MessageEmbed()
        .setTitle(activity.title)
        .setColor(embedColor)
        .setDescription(activity.content);

    return activityEmbed
}

module.exports = {
    getActivity
}