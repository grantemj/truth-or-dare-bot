import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Discord = require("discord.js-light");
const { Intents:{ FLAGS }} = Discord;
require('dotenv').config();
const client = new Discord.Client({
    cacheGuilds: true,
    cacheChannels: false,
    cacheOverwrites: false,
    cacheRoles: false,
    cacheEmojis: false,
    cachePresences: false,
    allowedMentions: { parse:['users'], repliedUser: true },
    intents: [FLAGS.GUILDS, FLAGS.DIRECT_MESSAGES]
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
const defaultSettings = { "muted?": false, "truth pg": true, "truth pg13": true, "truth r": false, "dare pg": true, "dare pg13": true, "dare r": false, "dare d": true, "dare irl": true, "wyr pg": true, "wyr pg13": true, "wyr r": false, "nhie pg": true, "nhie pg13": true, "nhie r": false, "paranoia pg": true, "paranoia pg13": true, "paranoia r": false, "show paranoia": "default" };
const rRatedSettings = { "muted?": false, "truth pg": true, "truth pg13": true, "truth r": true, "dare pg": true, "dare pg13": true, "dare r": true, "dare d": true, "dare irl": true, "wyr pg": true, "wyr pg13": true, "wyr r": true, "nhie pg": true, "nhie pg13": true, "nhie r": true, "paranoia pg": true, "paranoia pg13": true, "paranoia r": true, "show paranoia": "default" };
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

import { helpCommand } from './Commands/helpCommand.js';
import { truthCommand } from './Commands/truthCommand.js';
import { dareCommand } from './Commands/dareCommand.js';
import { wyrCommand } from './Commands/wyrCommand.js';
import { nhieCommand } from './Commands/nhieCommand.js';
import { paranoiaCommand } from './Commands/paranoiaCommand.js';
import { ansCommand } from './Commands/ansCommand.js';
import { linkCommand } from './Commands/linkCommand.js';
import { prefixCommand } from './Commands/prefixCommand.js';
import { enableCommand } from './Commands/enableCommand.js';
import { disableCommand } from './Commands/disableCommand.js';
import { muteCommand } from './Commands/muteCommand.js';
import { unmuteCommand } from './Commands/unmuteCommand.js';
import { settingsCommand } from './Commands/settingsCommand.js';
import { showParanoiaCommand } from './Commands/showParanoiaCommand.js';
import { truthfulCommand } from './Commands/truthfulCommand.js';
import { pingCommand } from './Commands/pingCommand.js';
import { statsCommand } from './Commands/statsCommand.js';
import { clearParanoiaCommand } from './Commands/clearParanoiaCommand.js';
import {
    initiateMongo,
    getServerSettings,
    setServerSettings,
    deleteServerSettings,
    getPrefix, setPrefix,
    deletePrefix,
    getServerCount,
    updateServerCount,
    getStatistics,
    setStatistics
} from './mongodbFunctions.js';
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
    getServerCount,
    getStatistics
};

fs.readdirSync('./Commands/').forEach(file => {
    const cmd = (await import(`./Commands/${file}`));
    client.commands.set(file.split('Command')[0], cmd.Command);
    if (cmd.slashCommand) client.slashCommands.set(file.split('Command')[0], cmd.slashCommand);
});

initiateMongo().then(async () => {
    console.log("MongoDB connected")
    await client.login(process.env.TOKEN).catch(console.error);
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

    let newGuildSettings = {};

    guild.channels.cache
    .filter(c => c.type === 'text')
    .forEach(c => {
        if (c.nsfw) { newGuildSettings[c.id] = rRatedSettings }
        else { newGuildSettings[c.id] = defaultSettings }
    });

    await updateServerCount(client.shard.ids[0], client.guilds.cache.size)
    client.statistics.serversJoined++;
    /* await topggAPI.postStats({
        serverCount: client.guilds.cache.size,
        shardId: client.shard.ids[0],
        shardCount: client.options.shardCount
    }); */
    await setStatistics(client.shard.ids[0], client.statistics)

    console.log("Server count updated for shard " + client.shard.ids[0] + ": " + client.guilds.cache.size);

    await setServerSettings(guild.id, newGuildSettings);
    await setPrefix(guild.id, '+');
});
client.on('guildDelete', async (guild) => {
    console.log(`Server left: ${guild.name} (${guild.id})`);

    await updateServerCount(client.shard.ids[0], client.guilds.cache.size)
    client.statistics.serversLeft++;
    /* await topggAPI.postStats({
        serverCount: client.guilds.cache.size,
        shardId: client.shard.ids[0],
        shardCount: client.options.shardCount
    }); */
    await setStatistics(client.shard.ids[0], client.statistics)
    
    console.log("Server count updated for shard " + client.shard.ids[0] + ": " + client.guilds.cache.size);
    
    await deleteServerSettings(guild.id);
    await deletePrefix(guild.id);
});

client.on('channelDelete', async (channel) => {
    if (channel?.type === "text") {
        let guild = channel.guild;
        let guildSettings = await getServerSettings(guild.id);
        if (guildSettings) {
            delete guildSettings[channel.id];
        }
        await setServerSettings(guild.id, guildSettings);
    }
});

client.on('interaction', interaction => {
    if (!interaction.isCommand()) return;
    // WIP for future slash commands
    if (client.slashCommands.has(interaction.commandName) {
        interaction.defer();
        client.slashCommands.get(interaction.commandName)(args, interaction, guildSettings);
    }
});

client.on('message', async (message) => {
    if (message.author.id === client.user.id || message.author.bot) {
        return;
    }
    if (message.guild) {
        const { guild, channel } = message;
        let prefix = await getPrefix(guild.id);
        if (message.content.startsWith(prefix || '+')) {
            let guildSettings = await getServerSettings(guild.id);
            if (guildSettings === undefined || guildSettings === null) {
                console.log("Unindexed guild");
                let newGuildSettings = {};
                guild.channels.cache.filter(c => c.type === 'text').forEach(c => {
                    newGuildSettings[c.id] = defaultSettings;
                });
                await setServerSettings(guild.id, newGuildSettings);
                guildSettings = newGuildSettings
            }
            if (!guildSettings.hasOwnProperty(channel.id)) {
                console.log("Unindexed channel");
                guildSettings[channel.id] = defaultSettings;
                await setServerSettings(guild.id, guildSettings);
            }
            processCommand(message, guildSettings, false);
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
            processCommand(message, null, true);
        }
    }
});
async function processCommand(message, guildSettings, dm) {
    if (!dm) {
        var guildPrefix = await getPrefix(message.guild.id);
        if (guildPrefix === undefined) {
            guildPrefix = "+";
            await setPrefix(message.guild.id, guildPrefix);
        }
        var fullCommand = message.content.substr(guildPrefix.length);
    }
    else {
        var guildPrefix = "+";
        var fullCommand = message.content.substr(1);
    }
    let splitCommand = fullCommand.toLowerCase().trim().split(" ");
    let primaryCommand = splitCommand[0];
    let args = splitCommand.slice(1);
    if (args.some(item => { return /\[.+\]/.test(item); }) && primaryCommand !== "ans") {
        sendMessage(message.channel, `You don't need to enclose your arguments in brackets, the help command uses them as placeholders. Example: Use ${guildPrefix}truth pg, not ${guildPrefix}truth [pg]`);
    }
    else {
        if (!dm) {
            guildSettings = guildSettings;
            if (Date.now() - channelTime[message.channel.id] < 3000) {
                sendMessage(message.channel, "You're sending commands too fast, wait a few seconds before trying another");
            }
            else if (!guildSettings[message.channel.id]["muted?"]) {
                switch (primaryCommand) {
                    case "tod": {
                        let truthEnabled = guildSettings[message.channel.id]["truth pg"] || guildSettings[message.channel.id]["truth pg13"] || guildSettings[message.channel.id]["truth r"];
                        let dareEnabled = (guildSettings[message.channel.id]["dare pg"] || guildSettings[message.channel.id]["dare pg13"] || guildSettings[message.channel.id]["dare r"]) && (guildSettings[message.channel.id]["dare irl"] || guildSettings[message.channel.id]["dare d"]);
                        if (truthEnabled && dareEnabled) {
                            (Math.random() < 0.5) ? truthCommand(args, message, guildSettings) : dareCommand(args, message, guildSettings);
                        }
                        else if (truthEnabled) {
                            truthCommand(args, message, guildSettings);
                        }
                        else if (dareEnabled) {
                            dareCommand(args, message, guildSettings);
                        }
                        else {
                            sendMessage(message.channel, "Truths and dares are disabled here");
                        }
                        break;
                    }
                    case "help":
                        helpCommand(args, message, guildPrefix);
                        break;
                    case "truth":
                    case "t":
                        client.statistics.truth++;
                        truthCommand(args, message, guildSettings);
                        break;
                    case "dare":
                    case "d":
                        client.statistics.dare++;
                        dareCommand(args, message, guildSettings);
                        break;
                    case "wyr":
                        client.statistics.wyr++;
                        wyrCommand(args, message, guildSettings);
                        break;
                    case "nhie":
                        client.statistics.nhie++;
                        nhieCommand(args, message, guildSettings);
                        break;
                    case "paranoia":
                    case "p":
                        client.statistics.paranoia++;
                        paranoiaCommand(args, message, guildSettings);
                        break;
                    case "random": {
                        let categories = [];
                        if (guildSettings["truth pg"] || guildSettings["truth pg13"] || guildSettings["truth r"]) {
                            categories.push("truth");
                        }
                        if ((guildSettings["dare pg"] || guildSettings["dare pg13"] || guildSettings["dare r"]) && (guildSettings["dare d"] || guildSettings["dare irl"])) {
                            categories.push("dare");
                        }
                        if (guildSettings["wyr pg"] || guildSettings["wyr pg13"] || guildSettings["wyr r"]) {
                            categories.push("wyr");
                        }
                        if (guildSettings["nhie pg"] || guildSettings["nhie pg13"] || guildSettings["nhie r"]) {
                            categories.push("nhie");
                        }
                        while (true) {
                            let rand = Math.random();
                            if (rand < 0.25 && categories.includes("truth")) {
                                truthCommand(args, message, guildSettings);
                                break;
                            }
                            else if (rand < 0.5 && categories.includes("dare")) {
                                dareCommand(args, message, guildSettings);
                                break;
                            }
                            else if (rand < 0.75 && categories.includes("wyr")) {
                                wyrCommand(args, message, guildSettings);
                                break;
                            }
                            else if (categories.includes("nhie")) {
                                nhieCommand(args, message, guildSettings);
                                break;
                            }
                        }
                        break;
                    }
                    case "ans":
                        sendMessage(message.channel, "You can only use that command in DMs");
                        break;
                    case "cp":
                    case "clearparanoia":
                        sendMessage(message.channel, "You can only use that command in DMs");
                        break;
                    case "links":
                    case "link":
                    case "vote":
                    case "invite":
                        linkCommand(message);
                        break;
                    case "prefix":
                        prefixCommand(args, message, guildPrefix);
                        break;
                    case "en":
                    case "enable":
                        enableCommand(args, message, guildSettings, guildPrefix);
                        break;
                    case "dis":
                    case "disable":
                        disableCommand(args, message, guildSettings, guildPrefix);
                        break;
                    case "config":
                    case "settings":
                        settingsCommand(args, message, guildSettings);
                        break;
                    case "sp":
                    case "toggleparanoia":
                    case "showparanoia":
                        showParanoiaCommand(args, message, guildSettings, guildPrefix);
                        break;
                    case "tf":
                    case "truthful":
                        truthfulCommand(message, args);
                        break;
                    case "ping":
                        pingCommand(message);
                        break;
                    case "stats":
                        statsCommand(message);
                        break;
                    case "shard":
                        sendMessage(message.channel, JSON.stringify(client.shard.ids));
                        break;
                    case "test":
                        console.log(`Command received: ${fullCommand}`);
                        break;
                    case "shards":
                        sendMessage(message.channel, JSON.stringify(await client.shard.fetchClientValues("readyTimestamp")));
                        break;
                    case "m":
                    case "mute":
                    case "um":
                    case "unmute":
                    case "":
                        break;
                }
                channelTime[message.channel.id] = Date.now();
            }
        }
        else {
            switch (primaryCommand) {
                case "help":
                    helpCommand(args, message, '+');
                    break;
                case "ans":
                    ansCommand(args, message);
                    break;
                case "links":
                    linkCommand(message);
                    break;
                case "clearparanoia":
                    clearParanoiaCommand(message);
                    break;
                default:
                    sendMessage(message.channel, `${primaryCommand} is not a valid command that can be used in DMs.`);
                    break;
            }
        }
    }
    if (!dm) {
        guildSettings = guildSettings;
        if (primaryCommand == "mute") {
            muteCommand(args, message, guildSettings, guildPrefix);
        }
        else if (primaryCommand == "unmute") {
            unmuteCommand(args, message, guildSettings, guildPrefix);
        }
    }
}
function sendMessage(channel, messageContent) {
    channel.send(messageContent).catch(() => { console.log("Missing permissions"); });
}
