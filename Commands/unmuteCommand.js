export { unmuteCommand };
import { sendMessage } from '../bot.js';
import { setServerSettings } from '../mongodbFunctions.js';
async function unmuteCommand(args, message, guildSettings, guildPrefix) {
    let guild = message.guild;
    let messageMember = await guild.members.fetch(message.author.id, false);
    await guild.roles.fetch();
    if (!messageMember.hasPermission('ADMINISTRATOR')) {
        sendMessage(message.channel, "You must be an administrator to use this command.");
    }
    else {
        if (args.includes('server') && args.length == 1) {
            for (let channel in guildSettings) {
                guildSettings[channel]["muted?"] = false;
            }
            await setServerSettings(guild.id, guildSettings);
            sendMessage(message.channel, `Unmuted serverwide. Use ${guildPrefix}mute to mute again.`);
        }
        else if (args.length == 0) {
            if (guildSettings[message.channel.id]["muted?"] == false) {
                sendMessage(message.channel, "I am already unmuted");
            }
            else {
                guildSettings[message.channel.id]["muted?"] = false;
                await setServerSettings(guild.id, guildSettings);
                sendMessage(message.channel, `Unmuted in this channel. Use ${guildPrefix}mute to mute."`);
            }
        }
    }
    await guild.roles.fetch({ cache: false, force: true });
}
