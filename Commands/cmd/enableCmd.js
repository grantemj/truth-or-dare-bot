export { cmd };
import { Command } from '../commandTemplate.js';
import { settingsChange } from './settingsChange.js';
import { joinToString } from '../../utils.js'

const cmd = new Command({
    title: "Enable Command",
    aliases: ['enable', 'en'],
    desc: 'Used to clear a user\'s queue of paranoia questions',
    type: 'c',
    requiredArgs: [
        {
            name: 'serverwide', // Update this as optional as stated in "helpCommand.go" ?
            description: "Whether the settings should be changed for all channels in the server.",
            type: 'BOOLEAN',
        },
        {
            name: 'command',
            description: "The command to disable",
            type: 'STRING',
            choices: [ // Perhaps have this also just grab all of the 'q' type commands to auto-gen this too? Or at least part of it?
                { name: "truth",    desc: "Disables all categories for the truth command." },
                { name: "dare",     desc: "Disables all categories for the dare command." },
                { name: "wyr",      desc: "Disables all categories for the Would You Rather command." },
                { name: "nhie",     desc: "Disables all categories for the Never Have I Ever command." },
                { name: "paranoia", desc: "Disables all categories for the paranoia command." },
                { name: "all",      desc: "all" }
            ]
        },
        {
            name: 'category',
            description: "The category to disable",
            type: 'STRING',
            choices: [
                { name: "pg",   desc: "Disables pg category for all commands, or can be added after a command to disable for that command only." },
                { name: "pg13", desc: "Disables pg13 category for all commands, or can be added after a command to disable for that command only." },
                { name: "r",    desc: "Disables r category for all commands, or can be added after a command to disable for that command only." },
                { name: "d",    desc: "Disables digital category for the dare command." },
                { name: "irl",  desc: "Disables real life category for the dare command." },
                { name: "all",  desc: "all" }
            ]
        },
    ],
    optionalArgs: [
        {
            name: 'channel',
            description: "If not serverwide, which channel to change settings in",
            type: 'CHANNEL',
        }
    ],

    cmd: async function (args, message, guildSettings, serverPrefix) {
        let guild = message.guild
        let member = await guild.members.fetch(message.author.id, false)
        let roles = await Promise.all(member.roles.cache.map(role => guild.roles.fetch(role.id, false)))
        let admin = member.permissions.has("ADMINISTRATOR")
            || roles.some(role => role.permissions.has("ADMINISTRATOR"))
        if (!admin) {
            sendMessage(message.channel, "You must be an administrator to use this command.");
        }
        else if (!args.length) {
            sendMessage(message.channel, "You must specify a command (truth, dare, etc.) or category (pg, irl, etc.) to enable.");
        }
        else {
            let settingNames = args.filter(item => item !== "server");
            if (!settingNames.length) {
                sendMessage(message.channel, "You must specify a command (truth, dare, etc.) or category (pg, irl, etc.) to enable.");
            }
            else {
                let commands = args.filter(item => ["truth", "dare", "wyr", "nhie", "paranoia"].includes(item));
                let categories = args.filter(item => ["pg", "pg13", "r", "d", "irl"].includes(item));
                let toBeEnabled = [];
                if (args.includes("all")) {
                    toBeEnabled = ["truth pg", "truth pg13", "dare pg", "dare pg13", "dare d", "dare irl", "wyr pg", "wyr pg13", "nhie pg", "nhie pg13", "paranoia pg", "paranoia pg13"]
                }
                else if (commands.length !== 0) {
                    for (let command of commands) {
                        if (categories.length !== 0) {
                            for (let category of categories) {
                                if (command === "dare" || (category !== "irl" && category !== "irl")) {
                                    toBeEnabled.push(command + " " + category);
                                }
                            }
                        }
                        else {
                            if (command !== "dare") {
                                ["pg", "pg13"].forEach(category => toBeEnabled.push(command + " " + category));
                            }
                            else {
                                ["pg", "pg13", "d", "irl"].forEach(category => toBeEnabled.push("dare " + category));
                            }
                        }
                    }
                }
                else if (categories.length !== 0) {
                    for (let category of categories) {
                        if (category === "d" || category === "irl") {
                            toBeEnabled.push("dare " + category);
                        }
                        else {
                            ["truth", "dare", "wyr", "nhie", "paranoia"].forEach(command => toBeEnabled.push(command + " " + category));
                        }
                    }
                }
                if (toBeEnabled.length === 0) {
                    sendMessage(message.channel, "Could not find any valid commands or categories to enable. Double check that any commands or categories specified are spelled correctly and are not mutually exclusive (like `truth` and `irl`).");
                }
                else {
                    await settingsChange(message, guildSettings, toBeEnabled, args.includes("server"), true);
                    let enabledString = joinToString(toBeEnabled);
                    sendMessage(message.channel, `${enabledString} enabled ${(args.includes("server")) ? "serverwide" : "in this channel"}`);
                }
            }
        }
    },

    slash:async function (interaction, channelSettings) {
        let { guild, channel, options } = interaction
        let serverwide = options.get('serverwide').value
        let command = options.get('command').value
        let category = options.get('category').value
    
        if ((command !== "dare" && command !== "all") && (category === "d" || category === "irl")) {
            interaction.editReply("The d and irl categories only apply to the dare command")
            return
        }
    
        let toBeEnabled = []
        let commandArray = command === "all" ? ["truth", "dare", "wyr", "nhie", "paranoia"] : [command]
        let categoryArray = category === "all" ? ["pg", "pg13", "r", "d", "irl"] : [category]
        for (let x of commandArray) {
            for (let y of categoryArray) {
                if (x === "dare" || (y !== "d" && y !== "irl")) {
                    toBeEnabled.push(x + " " + y)
                }
            }
        }
    
        if (serverwide) {
            let serverChannels = await handler.query("getServerChannels", guild)
            for (let c of serverChannels) {
                let cs = await handler.query("getChannelSettings", c)
                for (let setting of toBeEnabled) {
                    cs[setting] = true
                }
                handler.query("setChannelSettings", c, cs)
            }
    
            interaction.editReply(joinToString(toBeEnabled) + " enabled serverwide")
        } else if (options.has('channel')) {
            if (options.get('channel').channel.type !== "text") {
                interaction.editReply("The channel must be a text channel")
                return
            }
    
            let channelID = options.get('channel').channel.id
            let cs = await handler.query("getChannelSettings", channelID)
            for (let setting of toBeEnabled) {
                cs[setting] = true
            }
            handler.query("setChannelSettings", channelID, cs)
    
            interaction.editReply(`${joinToString(toBeEnabled)} enabled in <#${channelID}>`)
        } else {
            for (let setting of toBeEnabled) {
                channelSettings[setting] = true
            }
            handler.query("setChannelSettings", channel.id)
    
            interaction.editReply(`${joinToString(toBeEnabled)} enabled in the current channel`)
        }
    }
})