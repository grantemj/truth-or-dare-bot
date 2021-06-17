export { Command, SlashCommand, Meta };
import { sendMessage, handler } from '../bot.js';
import { settingsChange } from './settingsChange.js';

async function Command(args, message, guildSettings, serverPrefix) {
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
}

async function SlashCommand(interaction, channelSettings) {
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

const Meta = {
    name: 'enable',
    description: 'Enable permissions for a specified command and category',
    defaultPermission: false,
    options: [
        {
            name: 'serverwide',
            description: "Whether the settings should be changed for all channels in the server",
            type: 'BOOLEAN',
            required: true
        },
        {
            name: 'command',
            description: "The command to enable",
            type: 'STRING',
            required: true,
            choices: [
                { name: "truth", value: "truth" },
                { name: "dare", value: "dare" },
                { name: "wyr", value: "wyr" },
                { name: "nhie", value: "nhie" },
                { name: "paranoia", value: "paranoia" },
                { name: "all", value: "all" }
            ]
        },
        {
            name: 'category',
            description: "The category to enable",
            type: 'STRING',
            required: true,
            choices: [
                { name: "pg", value: "pg" },
                { name: "pg13", value: "pg13" },
                { name: "r", value: "r" },
                { name: "d", value: "d" },
                { name: "irl", value: "irl" },
                { name: "all", value: "all" }
            ]
        },
        {
            name: 'channel',
            description: "If not serverwide, which channel to change settings in",
            type: 'CHANNEL',
            required: false
        }
    ]
}

function joinToString(array) {
    return (array.length > 2) ?
        `\`${array.slice(0, -1).join("\`, \`")}\`, and \`${array[array.length - 1]}\`` :
        (array.length === 2) ?
            `\`${array[0]}\` and \`${array[1]}\`` :
            `\`${array[0]}\``
}
