export { Command, Meta };
import { sendMessage } from '../bot.js';
import { settingsChange } from './settingsChange.js';
async function Command(args, message, guildSettings, serverPrefix) {
    let guild = message.guild;
    let messageMember = await guild.members.fetch(message.author.id, false);
    await messageMember.roles.fetch();
    if (!messageMember.permissions.has(8)) {
        sendMessage(message.channel, "You must be an administrator to use this command.");
    }
    else if (!args.length) {
        sendMessage(message.channel, "You must specify a command (truth, dare, etc.) or category (pg, irl, etc.) to disable.");
    }
    else {
        let settingNames = args.filter(item => item !== "server");
        if (!settingNames.length) {
            sendMessage(message.channel, "You must specify a command (truth, dare, etc.) or category (pg, irl, etc.) to disable.");
        }
        else {
            let commands = args.filter(item => ["truth", "dare", "wyr", "nhie", "paranoia"].includes(item));
            let categories = args.filter(item => ["pg", "pg13", "r", "d", "irl"].includes(item));
            let toBeDisabled = [];
            if (args.includes("all")) {
                toBeDisabled = ["truth pg", "truth pg13", "dare pg", "dare pg13", "dare d", "dare irl", "wyr pg", "wyr pg13", "nhie pg", "nhie pg13", "paranoia pg", "paranoia pg13"]
            }
            else if (commands.length !== 0) {
                for (let command of commands) {
                    if (categories.length !== 0) {
                        for (let category of categories) {
                            if (command !== "dare") {
                                if (category !== "irl" && category !== "d") {
                                    toBeDisabled.push(command + " " + category);
                                }
                            }
                            else {
                                toBeDisabled.push(command + " " + category);
                            }
                        }
                    }
                    else {
                        if (command !== "dare") {
                            ["pg", "pg13"].forEach(category => toBeDisabled.push(command + " " + category));
                        }
                        else {
                            ["pg", "pg13", "d", "irl"].forEach(category => toBeDisabled.push("dare " + category));
                        }
                    }
                }
            }
            else if (categories.length !== 0) {
                for (let category of categories) {
                    if (category === "d" || category === "irl") {
                        toBeDisabled.push("dare " + category);
                    }
                    else {
                        ["truth", "dare", "wyr", "nhie", "paranoia"].forEach(command => toBeDisabled.push(command + " " + category));
                    }
                }
            }
            if (toBeDisabled.length === 0) {
                sendMessage(message.channel, "Could not find any valid commands or categories to disable. Double check that any commands or categories specified are spelled correctly and are not mutually exclusive (like `truth` and `irl`).");
            }
            else {
                await settingsChange(message, guildSettings, toBeDisabled, args.includes("server"), false);
                let disabledString = (toBeDisabled.length > 2) ?
                    `\`${toBeDisabled.slice(0, -1).join("\`, \`")}\`, and \`${toBeDisabled[toBeDisabled.length - 1]}\`` :
                    (toBeDisabled.length === 2) ?
                        `\`${toBeDisabled[0]}\` and \`${toBeDisabled[1]}\`` :
                        `\`${toBeDisabled[0]}\``;
                sendMessage(message.channel, `${disabledString} disabled ${(args.includes("server")) ? "serverwide" : "in this channel"}.`);
            }
        }
    }
    await messageMember.roles.fetch({ cache: false, force: true });
}
const Meta = {
    name: 'disable',
    description: 'Disable permissions for a specified command and rating',
    options:[
        {
            name: 'command',
            type: 'STRING',
            description: 'the command to disable'.
            required: true
        },
        {
            name: 'rating',
            type: 'STRING',
            description: 'the rating to disable',
            required: true
        }
    ]
}
