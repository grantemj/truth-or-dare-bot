import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Discord = require("discord.js-light");
const { Intents:{ FLAGS }} = Discord;
require('dotenv').config();
const heapdump = require("heapdump")
const client = new Discord.Client({
    cacheGuilds: true,
    cacheChannels: false,
    cacheOverwrites: false,
    cacheRoles: false,
    cacheEmojis: false,
    cachePresences: false,
    allowedMentions: { parse:['users'], repliedUser: true },
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"]
});
/* const topgg = require('@top-gg/sdk');
const topggAPI = new topgg.Api(process.env.TOPGG); */
const fs = require('fs');
const originalLog = console.log;
console.log = function (input) {
    let date = new Date();
    originalLog(`${(date.getHours() >= 10) ? date.getHours() : "0" + date.getHours()}:${(date.getMinutes() >= 10) ? date.getMinutes() : "0" + date.getMinutes()}:${(date.getSeconds() >= 10) ? date.getSeconds() : "0" + date.getSeconds()}    ${input}`);
};
function getQuestions(text) {
    let lines = text.split(/\r?\n/);
    let categoryRegex = /<--(?!-)([^#<>]+)(?<!-)-->/;
    let currentCategory = undefined;
    let returnValue = {};
    for (let line of lines) {
        let categoryMatch = line.match(categoryRegex);
        if (categoryMatch !== null) {
            currentCategory = categoryMatch[1];
            if (!Array.isArray(returnValue[currentCategory])) {
                returnValue[currentCategory] = [];
            }
        }
        else if (line[0] === "#" && line[1] === " ") {
            if (currentCategory !== undefined) {
                returnValue[currentCategory].push(line.slice(2));
            }
        }
    }
    return returnValue;
}
const TRUTHQUESTIONS = getQuestions(fs.readFileSync('./Questions/truthQuestions.quf', { "encoding": 'utf-8' }));
const DAREQUESTIONS = getQuestions(fs.readFileSync('./Questions/dareQuestions.quf', { "encoding": 'utf-8' }));
const WYRQUESTIONS = getQuestions(fs.readFileSync('./Questions/wyrQuestions.quf', { "encoding": 'utf-8' }));
const NHIEQUESTIONS = getQuestions(fs.readFileSync('./Questions/nhieQuestions.quf', { "encoding": 'utf-8' }));
const PARANOIAQUESTIONS = getQuestions(fs.readFileSync('./Questions/paranoiaQuestions.quf', { "encoding": 'utf-8' }));
client.numberTruths = TRUTHQUESTIONS.pg.length + TRUTHQUESTIONS.pg13.length + TRUTHQUESTIONS.r.length;
client.numberDares = DAREQUESTIONS.pg_d.length + DAREQUESTIONS.pg13_d.length + DAREQUESTIONS.r_d.length + DAREQUESTIONS.pg_irl.length + DAREQUESTIONS.pg13_irl.length + DAREQUESTIONS.r_irl.length;
client.numberWyr = WYRQUESTIONS.pg.length + WYRQUESTIONS.pg13.length + WYRQUESTIONS.r.length;
client.numberNhie = NHIEQUESTIONS.pg.length + NHIEQUESTIONS.pg13.length + NHIEQUESTIONS.r.length;
client.numberParanoias = PARANOIAQUESTIONS.pg.length + PARANOIAQUESTIONS.pg13.length + PARANOIAQUESTIONS.r.length;
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
const defaultSettings = { "muted?": false, "truth pg": true, "truth pg13": true, "truth r": false, "dare pg": true, "dare pg13": true, "dare r": false, "dare d": true, "dare irl": false, "wyr pg": true, "wyr pg13": true, "wyr r": false, "nhie pg": true, "nhie pg13": true, "nhie r": false, "paranoia pg": true, "paranoia pg13": true, "paranoia r": false, "show paranoia": "default" };
const rRatedSettings = { "muted?": false, "truth pg": true, "truth pg13": true, "truth r": true, "dare pg": true, "dare pg13": true, "dare r": true, "dare d": true, "dare irl": false, "wyr pg": true, "wyr pg13": true, "wyr r": true, "nhie pg": true, "nhie pg13": true, "nhie r": true, "paranoia pg": true, "paranoia pg13": true, "paranoia r": true, "show paranoia": "default" };
const allEnabledSettings = { "muted?": false, "truth pg": true, "truth pg13": true, "truth r": true, "dare pg": true, "dare pg13": true, "dare r": true, "dare d": true, "dare irl": true, "wyr pg": true, "wyr pg13": true, "wyr r": true, "nhie pg": true, "nhie pg13": true, "nhie r": true, "paranoia pg": true, "paranoia pg13": true, "paranoia r": true, "show paranoia": "default" }; 
var channelTime = {};
client.statistics = { "timeCreated": Date.now(), "truth": 0, "dare": 0, "wyr": 0, "nhie": 0, "paranoia": 0, "serversJoined": 0, "serversLeft": 0 };
setInterval(() => {
    if (Date.now() - client.statistics.timeCreated > 3600000) {
        client.statistics = {
            "timeCreated": Date.now(),
            "truth": 0,
            "dare": 0,
            "wyr": 0,
            "nhie": 0,
            "paranoia": 0,
            "serversJoined": 0,
            "serversLeft": 0
        };
        console.log("Statistics reset");
    }
}, 600000);

import { MongoHandler } from './mongodbFunctions.js';
const handler = new MongoHandler()
handler.init().then(() => {
    console.log("MongoDB connected")
    client.login(process.env.TOKEN)
})

const commandIDs = require('./commandIDs.json')

export {
    Discord,
    client,
    fs,
    TRUTHQUESTIONS,
    DAREQUESTIONS,
    WYRQUESTIONS,
    NHIEQUESTIONS,
    PARANOIAQUESTIONS,
    sendMessage,
    handler,
    commandIDs
};

fs.readdirSync('./Commands/').forEach(async file => {
    const cmd = (await import(`./Commands/${file}`));
    if (file.includes("Command")) {
        if (cmd.Command) client.commands.set(file.split('Command')[0].toLowerCase(), cmd.Command);
        if (cmd.Aliases) cmd.Aliases.forEach(a => {
            client.commands.set(a, cmd.Command)
        })
        if (cmd.SlashCommand) client.slashCommands.set(file.split('Command')[0], cmd.SlashCommand);
    }
});

client.on('debug', console.log)
client.on('ready', () => {
    console.log("Connected");
    client.user.setActivity('truth or dare | +help', { type: "PLAYING" });
});
client.on('rateLimit', (info) => {
    console.log(`Rate limit hit, Time: ${info.timeout ? info.timeout : 'Unknown timeout '}, Path: ${info.path || 'Unknown path'}, Route: ${info.route || 'Unknown route'}`);
});
client.on('guildCreate', async (guild) => {
    if (client.guilds.cache.has(guild.id)) return;
    console.log(`Server joined: ${guild.name} (${guild.id})`);

    let serverChannels = []
    guild.channels.cache
        .filter(c => c.type === 'text')
        .forEach(c => {
            serverChannels.push(c.id)
            if (c.nsfw) { 
                handler.query("setChannelSettings", c.id, rRatedSettings)
            } else {
                handler.query("setChannelSettings", c.id, defaultSettings)
            }
        });
    handler.query("setServerChannels", guild.id, serverChannels);

    handler.query("updateServerCount", client.shard.ids[0], client.guilds.cache.size)
    client.statistics.serversJoined++;
    /* await topggAPI.postStats({
        serverCount: client.guilds.cache.size,
        shardId: client.shard.ids[0],
        shardCount: client.options.shardCount
    }); */
    handler.query("setStatistics", client.shard.ids[0], client.statistics)

    console.log("Server count updated for shard " + client.shard.ids[0] + ": " + client.guilds.cache.size);

    handler.query("setPrefix", guild.id, '+');
});
client.on('guildDelete', async (guild) => {
    console.log(`Server left: ${guild.name} (${guild.id})`);

    handler.query("updateServerCount", client.shard.ids[0], client.guilds.cache.size)
    client.statistics.serversLeft++;
    /* await topggAPI.postStats({
        serverCount: client.guilds.cache.size,
        shardId: client.shard.ids[0],
        shardCount: client.options.shardCount
    }); */
    handler.query("setStatistics", client.shard.ids[0], client.statistics)

    let serverChannels = await handler.query("getServerChannels", guild.id)
    serverChannels.forEach(id => {
        handler.query("deleteChannelSettings", id)
    })
    
    console.log("Server count updated for shard " + client.shard.ids[0] + ": " + client.guilds.cache.size);
    
    handler.query("deletePrefix", guild.id);
});

client.on('channelDelete', async (channel) => {
    if (channel?.type === "text") {
        let serverChannels = await handler.query("getServerChannels", channel.guild.id)
        handler.query("setServerChannels", serverChannels.filter(c => c !== channel.id))
        handler.query("deleteChannelSettings", channel.id)
    }
});

client.on('interaction', async (interaction) => {
    if (!interaction.isCommand()) return;
    let channelSettings = interaction.channel?.type === "dm" ?
        await handler.query("getChannelSettings", interaction.channel.id) :
        allEnabledSettings
    if (client.slashCommands.has(interaction.commandName)) {
        interaction.defer();
        client.slashCommands.get(interaction.commandName)(interaction, channelSettings);
    }
});

client.on('message', async (message) => {
    if (message.author.bot || (message.channel.type !== "text" && message.channel.type !== "dm")) {
        return;
    }

    const { guild, channel } = message;
    if (guild) {
        let prefix = await handler.query("getPrefix", guild.id);
        if (prefix === undefined || prefix === null) {
            prefix = '+'
            handler.query("setPrefix", guild.id, prefix)
        }
        if (message.content.startsWith(prefix || '+')) {
            let channelSettings = await handler.query("getChannelSettings", channel.id);
            if (channelSettings === undefined || channelSettings === null) {
                console.log("Unindexed channel");

                channelSettings = channel.nsfw ? rRatedSettings : defaultSettings

                handler.query("setChannelSettings", channel.id, channelSettings);
            }
            processCommand(message, channelSettings, prefix || '+', false);
            if (Math.random() < 0.007) {
                let linkEmbed = new Discord.MessageEmbed()
                    .setColor('#e91e62')
                    .setTitle("Links")
                    .addField('\u200B', 'Enjoying the bot? Make sure to [give feedback](https://truthordarebot.xyz/feedback) and [suggest questions](https://truthordarebot.xyz/question_submit).')
                    .setTimestamp();
                sendMessage(channel, linkEmbed);
            }
        }
    }
    else {
        if (message.content.startsWith('+')) {
            processCommand(message, null, '+', true);
        }
    }
});

async function processCommand(message, channelSettings, prefix, dm) {
    var fullCommand = dm ? message.content.substr(1) : message.content.substr(prefix.length)
    let splitCommand = fullCommand.toLowerCase().trim().split(/ +|\n/gm);
    let primaryCommand = splitCommand[0];
    let args = splitCommand.slice(1);
    if (args.some(item => { return /\[.+\]/.test(item); }) && primaryCommand !== "ans") {
        sendMessage(message.channel, `You don't need to enclose your arguments in brackets, the help command uses them as placeholders. Example: Use ${prefix}truth pg, not ${prefix}truth [pg]`);
    }
    else {
        if (!dm) {
            if (Date.now() - channelTime[message.channel.id] < 3000) {
                sendMessage(message.channel, "You're sending commands too fast, wait a few seconds before trying another");
            }
            else if (!channelSettings["muted?"]) {
                if (primaryCommand === 'random') {
                    let categories = [];
                    if (channelSettings["truth pg"] || channelSettings["truth pg13"] || channelSettings["truth r"]) {
                        categories.push("truth");
                    }
                    if ((channelSettings["dare pg"] || channelSettings["dare pg13"] || channelSettings["dare r"]) && (channelSettings["dare d"] || channelSettings["dare irl"])) {
                        categories.push("dare");
                    }
                    if (channelSettings["wyr pg"] || channelSettings["wyr pg13"] || channelSettings["wyr r"]) {
                        categories.push("wyr");
                    }
                    if (channelSettings["nhie pg"] || channelSettings["nhie pg13"] || channelSettings["nhie r"]) {
                        categories.push("nhie");
                    }
                    let command = Math.floor(Math.random() * categories.length)
                    client.commands.get(command)(args, message, channelSettings)
                } else if (primaryCommand === 'tod') {
                    let truthEnabled = channelSettings["truth pg"] || channelSettings["truth pg13"] || channelSettings["truth r"];
                    let dareEnabled = (channelSettings["dare pg"] || channelSettings["dare pg13"] || channelSettings["dare r"]) && (channelSettings["dare irl"] || channelSettings["dare d"]);
                    if (truthEnabled && dareEnabled) {
                        (Math.random() < 0.5)
                        ? client.commands.get('truth')(args, message, channelSettings)
                        : client.commands.get('dare')(args, message, channelSettings);
                    }
                    else if (truthEnabled) {
                        client.commands.get('truth')(args, message, channelSettings);
                    }
                    else if (dareEnabled) {
                        client.commands.get('dare')(args, message, channelSettings);
                    }
                    else {
                        sendMessage(message.channel, "Truths and dares are disabled here");
                    }
                } else if (primaryCommand === 'shard') {
                    sendMessage(message.channel, JSON.stringify(client.shard.ids));
                } else if (primaryCommand === 'shards') {
                    sendMessage(message.channel, JSON.stringify(await client.shard.ids));
                } else if (client.commands.has(primaryCommand)) {
                    client.commands.get(primaryCommand)(args, message, channelSettings, prefix);
                }
                channelTime[message.channel.id] = Date.now();
            }
        }
    }
}

function sendMessage(channel, messageContent) {
    channel.send(messageContent).catch(() => { console.log("Missing permissions"); });
}

// var dumps = 0
// setInterval(() => {
//     dumps++
//     console.log(client.shard.ids[0] + " " + process.memoryUsage().heapUsed)
//     heapdump.writeSnapshot("/root/dumps/" + client.shard.ids[0] + "_dump_" + dumps + ".heapsnapshot", () => {
//         console.log("Heap written")
//     })
// }, 200000)