export { settingsChange };
import { handler } from '../bot.js';
async function settingsChange(message, guildSettings, settingNames, server, value) {
    if (server) {
        for (let channel in guildSettings) {
            for (let settingName of settingNames) {
                if (settingName === "show paranoia" && typeof value === "string") {
                    guildSettings[channel][settingName] = value;
                }
                else if (settingName !== "show paranoia" && typeof value === "boolean") {
                    guildSettings[channel][settingName] = value;
                }
            }
        }
        handler.query("setServerSettings", message.guild.id, guildSettings);
    }
    else {
        for (let settingName of settingNames) {
            if (settingName === "show paranoia" && typeof value === "string") {
                guildSettings[message.channel.id][settingName] = value;
            }
            else if (settingName !== "show paranoia" && typeof value === "boolean") {
                guildSettings[message.channel.id][settingName] = value;
            }
        }
        handler.query("setServerSettings", message.guild.id, guildSettings);
    }
}
