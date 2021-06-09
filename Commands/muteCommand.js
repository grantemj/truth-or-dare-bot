export { muteCommand };
import { sendMessage } from '../bot.js';
import { setServerSettings } from '../mongodbFunctions.js';
async function muteCommand(args, message, guildSettings, guildPrefix) {
    let guild = message.guild;
    let messageMember = await guild.members.fetch(message.author.id, false);
    await guild.roles.fetch();
    if (!messageMember.hasPermission('ADMINISTRATOR')) {
        sendMessage(message.channel, "You must be an administrator to use this command.");
    }
    else {
        if (args.includes('server') && args.length === 1) {
            for (let channel in guildSettings) {
                guildSettings[channel]["muted?"] = true;
            }
            await setServerSettings(guild.id, guildSettings);
            sendMessage(message.channel, `Muted serverwide. Use ${guildPrefix}unmute to unmute.`);
        }
        else if (args.length == 0) {
            if (guildSettings[message.channel.id]["muted?"] == true) {
                sendMessage(message.channel, "I am already muted");
            }
            else {
                guildSettings[message.channel.id]["muted?"] = true;
                await setServerSettings(guild.id, guildSettings);
                sendMessage(message.channel, `Muted in this channel. Use ${guildPrefix}unmute to unmute.`);
            }
        }
    }
    await guild.roles.fetch({ cache: false, force: true });
}
