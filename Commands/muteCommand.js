export { muteCommand };
import { sendMessage, handler } from '../bot.js';
async function muteCommand(args, message, guildSettings, guildPrefix) {
    let guild = message.guild
    let member = await guild.members.fetch(message.author.id, false)
    let roles = await Promise.all(member.roles.cache.map(role => guild.roles.fetch(role.id, false)))
    console.dir(roles)
    let admin = member.permissions.has("ADMINISTRATOR")
        || roles.some(role => role.permissions.has("ADMINISTRATOR"))
    if (!admin) {
        sendMessage(message.channel, "You must be an administrator to use this command.");
    }
    else {
        if (args.includes('server') && args.length === 1) {
            for (let channel in guildSettings) {
                guildSettings[channel]["muted?"] = true;
            }
            handler.query("setServerSettings", guild.id, guildSettings);
            sendMessage(message.channel, `Muted serverwide. Use ${guildPrefix}unmute to unmute.`);
        }
        else if (args.length == 0) {
            if (guildSettings[message.channel.id]["muted?"] == true) {
                sendMessage(message.channel, "I am already muted");
            }
            else {
                guildSettings[message.channel.id]["muted?"] = true;
                handler.query("setServerSettings", guild.id, guildSettings);
                sendMessage(message.channel, `Muted in this channel. Use ${guildPrefix}unmute to unmute.`);
            }
        }
    }
}
