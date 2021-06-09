export { enableCommand };
import { sendMessage } from '../bot.js';
import { settingsChange } from './settingsChange.js';
async function enableCommand(args, message, guildSettings, serverPrefix) {
    let guild = message.guild;
    let messageMember = await guild.members.fetch(message.author.id, false);
    await guild.roles.fetch();
    if (!messageMember.hasPermission("ADMINISTRATOR")) {
        sendMessage(message.channel, "You must be an administrator to use this command.");
    }
    else if (args.length === 0) {
        sendMessage(message.channel, "You must specify a command (truth, dare, etc.) or category (pg, irl, etc.) to enable.");
    }
    else {
        let settingNames = args.filter(item => item !== "server");
        if (settingNames.length === 0) {
            sendMessage(message.channel, "You must specify a command (truth, dare, etc.) or category (pg, irl, etc.) to enable.");
        }
        else {
            let commands = args.filter(item => ["truth", "dare", "wyr", "nhie", "paranoia"].includes(item));
            let categories = args.filter(item => ["pg", "pg13", "r", "d", "irl"].includes(item));
            let toBeEnabled = [];
            if (commands.length !== 0) {
                for (let command of commands) {
                    if (categories.length !== 0) {
                        for (let category of categories) {
                            if (command !== "dare") {
                                if (category !== "irl" && category !== "d") {
                                    toBeEnabled.push(command + " " + category);
                                }
                            }
                            else {
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
            else {
                if (categories.length !== 0) {
                    for (let category of categories) {
                        if (category === "d" || category === "irl") {
                            toBeEnabled.push("dare " + category);
                        }
                        else {
                            ["truth", "dare", "wyr", "nhie", "paranoia"].forEach(command => toBeEnabled.push(command + " " + category));
                        }
                    }
                }
            }
            if (toBeEnabled.length === 0) {
                sendMessage(message.channel, "Could not find any valid commands or categories to enable. Double check that any commands or categories specified are spelled correctly and are not mutually exclusive (like `truth` and `irl`).");
            }
            else {
                await settingsChange(message, guildSettings, toBeEnabled, args.includes("server"), true);
                let enabledString = (toBeEnabled.length > 2) ?
                    `\`${toBeEnabled.slice(0, -1).join("\`, \`")}\`, and \`${toBeEnabled[toBeEnabled.length - 1]}\`` :
                    (toBeEnabled.length === 2) ?
                        `\`${toBeEnabled[0]}\` and \`${toBeEnabled[1]}\`` :
                        `\`${toBeEnabled[0]}\``;
                sendMessage(message.channel, `${enabledString} enabled ${(args.includes("server")) ? "serverwide" : "in this channel"}.`);
            }
        }
    }
    await guild.roles.fetch({ cache: false, force: true });
}
